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
    type: 'response_submitted' | 'template_created' | 'template_updated';
    userId: number;
    templateId?: number;
    templateTitle?: string;
    answersCount?: number;
    occurredAt: string;
  }>;
  minuteSeries: Array<{
    minute: string;
    responses: number;
    templates: number;
  }>;
  topTemplates: Array<{
    templateId: number;
    label: string;
    responseCount: number;
  }>;
}
