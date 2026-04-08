type AnalyticsEventType =
  | 'response_submitted'
  | 'template_created'
  | 'template_updated';

interface AnalyticsEventPayload {
  type: AnalyticsEventType;
  userId: number;
  templateId?: number;
  templateTitle?: string;
  answersCount?: number;
  occurredAt?: Date;
}

interface AnalyticsEvent extends Required<Omit<AnalyticsEventPayload, 'occurredAt'>> {
  id: string;
  occurredAt: Date;
}

interface MinuteBucket {
  minute: string;
  responses: number;
  templates: number;
}

export interface RealtimeAnalyticsSnapshot {
  generatedAt: string;
  acceptableDelaySeconds: number;
  windowMinutes: number;
  totals: {
    responsesLastFiveMinutes: number;
    responsesLastHour: number;
    templatesCreatedLastHour: number;
    templatesUpdatedLastHour: number;
    activeUsersLastFiveMinutes: number;
  };
  recentEvents: Array<{
    id: string;
    type: AnalyticsEventType;
    userId: number;
    templateId?: number;
    templateTitle?: string;
    answersCount?: number;
    occurredAt: string;
  }>;
  minuteSeries: MinuteBucket[];
  topTemplates: Array<{
    templateId: number;
    label: string;
    responseCount: number;
  }>;
}

type Listener = (snapshot: RealtimeAnalyticsSnapshot) => void;

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const MINUTE_SERIES_POINTS = 12;
const RECENT_EVENTS_LIMIT = 12;
const ACCEPTABLE_DELAY_SECONDS = 5;

class RealtimeAnalyticsService {
  private events: AnalyticsEvent[] = [];

  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  recordEvent(payload: AnalyticsEventPayload) {
    const occurredAt = payload.occurredAt ?? new Date();
    const event: AnalyticsEvent = {
      id: `${occurredAt.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      type: payload.type,
      userId: payload.userId,
      templateId: payload.templateId ?? 0,
      templateTitle: payload.templateTitle ?? '',
      answersCount: payload.answersCount ?? 0,
      occurredAt,
    };

    this.events.push(event);
    this.pruneOldEvents(occurredAt);
    this.emit();
  }

  getSnapshot(now = new Date()): RealtimeAnalyticsSnapshot {
    this.pruneOldEvents(now);

    const fiveMinutesAgo = new Date(now.getTime() - FIVE_MINUTES_MS);
    const oneHourAgo = new Date(now.getTime() - ONE_HOUR_MS);

    const recentFiveMinutes = this.events.filter((event) => event.occurredAt >= fiveMinutesAgo);
    const recentHour = this.events.filter((event) => event.occurredAt >= oneHourAgo);

    const responseEvents = recentHour.filter((event) => event.type === 'response_submitted');
    const createdTemplateEvents = recentHour.filter((event) => event.type === 'template_created');
    const updatedTemplateEvents = recentHour.filter((event) => event.type === 'template_updated');

    const topTemplatesMap = new Map<number, { templateId: number; label: string; responseCount: number }>();
    for (const event of responseEvents) {
      if (!event.templateId) continue;
      const previous = topTemplatesMap.get(event.templateId) ?? {
        templateId: event.templateId,
        label: event.templateTitle || `Template #${event.templateId}`,
        responseCount: 0,
      };
      previous.responseCount += 1;
      if (event.templateTitle) {
        previous.label = event.templateTitle;
      }
      topTemplatesMap.set(event.templateId, previous);
    }

    return {
      generatedAt: now.toISOString(),
      acceptableDelaySeconds: ACCEPTABLE_DELAY_SECONDS,
      windowMinutes: 60,
      totals: {
        responsesLastFiveMinutes: recentFiveMinutes.filter(
          (event) => event.type === 'response_submitted',
        ).length,
        responsesLastHour: responseEvents.length,
        templatesCreatedLastHour: createdTemplateEvents.length,
        templatesUpdatedLastHour: updatedTemplateEvents.length,
        activeUsersLastFiveMinutes: new Set(recentFiveMinutes.map((event) => event.userId)).size,
      },
      recentEvents: [...this.events]
        .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
        .slice(0, RECENT_EVENTS_LIMIT)
        .map((event) => ({
          id: event.id,
          type: event.type,
          userId: event.userId,
          templateId: event.templateId || undefined,
          templateTitle: event.templateTitle || undefined,
          answersCount: event.answersCount || undefined,
          occurredAt: event.occurredAt.toISOString(),
        })),
      minuteSeries: this.buildMinuteSeries(now),
      topTemplates: [...topTemplatesMap.values()]
        .sort((a, b) => b.responseCount - a.responseCount)
        .slice(0, 5),
    };
  }

  resetForTests() {
    this.events = [];
    this.listeners.clear();
  }

  private emit() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private pruneOldEvents(now: Date) {
    const threshold = now.getTime() - ONE_HOUR_MS;
    this.events = this.events.filter((event) => event.occurredAt.getTime() >= threshold);
  }

  private buildMinuteSeries(now: Date): MinuteBucket[] {
    const buckets = new Map<string, MinuteBucket>();

    for (let index = MINUTE_SERIES_POINTS - 1; index >= 0; index -= 1) {
      const bucketDate = new Date(now.getTime() - index * 60 * 1000);
      bucketDate.setSeconds(0, 0);
      const minute = bucketDate.toISOString();
      buckets.set(minute, { minute, responses: 0, templates: 0 });
    }

    for (const event of this.events) {
      const bucketDate = new Date(event.occurredAt);
      bucketDate.setSeconds(0, 0);
      const minute = bucketDate.toISOString();
      const bucket = buckets.get(minute);
      if (!bucket) continue;
      if (event.type === 'response_submitted') {
        bucket.responses += 1;
      } else {
        bucket.templates += 1;
      }
    }

    return [...buckets.values()];
  }
}

export const realtimeAnalyticsService = new RealtimeAnalyticsService();
