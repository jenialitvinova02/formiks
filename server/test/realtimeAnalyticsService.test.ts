import { realtimeAnalyticsService } from '../services/realtimeAnalyticsService';

describe('Realtime analytics service', () => {
  beforeEach(() => {
    realtimeAnalyticsService.resetForTests();
  });

  it('aggregates real response and template events into a live snapshot', () => {
    const now = new Date();

    realtimeAnalyticsService.recordEvent({
      type: 'template_created',
      userId: 1,
      templateId: 10,
      templateTitle: 'Exam Form',
      occurredAt: new Date(now.getTime() - 30 * 60 * 1000),
    });
    realtimeAnalyticsService.recordEvent({
      type: 'response_submitted',
      userId: 2,
      templateId: 10,
      templateTitle: 'Exam Form',
      answersCount: 6,
      occurredAt: new Date(now.getTime() - 3 * 60 * 1000),
    });
    realtimeAnalyticsService.recordEvent({
      type: 'response_submitted',
      userId: 3,
      templateId: 10,
      templateTitle: 'Exam Form',
      answersCount: 5,
      occurredAt: new Date(now.getTime() - 60 * 1000),
    });

    const snapshot = realtimeAnalyticsService.getSnapshot(now);

    expect(snapshot.totals.responsesLastFiveMinutes).toBe(2);
    expect(snapshot.totals.responsesLastHour).toBe(2);
    expect(snapshot.totals.templatesCreatedLastHour).toBe(1);
    expect(snapshot.totals.activeUsersLastFiveMinutes).toBe(2);
    expect(snapshot.topTemplates[0]).toMatchObject({
      templateId: 10,
      label: 'Exam Form',
      responseCount: 2,
    });
    expect(snapshot.recentEvents).toHaveLength(3);
  });
});
