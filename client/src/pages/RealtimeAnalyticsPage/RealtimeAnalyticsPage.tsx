import React from 'react';
import { InlineAlert, LoadingSkeleton } from '../../components';
import { useRealtimeAnalytics } from '../../hooks/useRealtimeAnalytics';
import { useAppSelector } from '../../store';
import './RealtimeAnalyticsPage.scss';

function formatEventLabel(type: string) {
  if (type === 'response_submitted') return 'Response submitted';
  if (type === 'template_created') return 'Template created';
  if (type === 'template_updated') return 'Template updated';
  return type;
}

function formatMinuteLabel(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

function formatTimestamp(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(isoDate));
}

export const RealtimeAnalyticsPage: React.FC = () => {
  const token = useAppSelector((state) => state.session.token);
  const { snapshot, loading, error, connected } = useRealtimeAnalytics(token);

  if (loading) {
    return (
      <section className="realtime-analytics">
        <div className="page-title">
          <h1>Live Analytics</h1>
          <p>Streaming form activity, update volume and recent response traffic.</p>
        </div>
        <div className="realtime-analytics__panel">
          <LoadingSkeleton rows={6} />
        </div>
      </section>
    );
  }

  if (error && !snapshot) {
    return (
      <section className="realtime-analytics">
        <div className="page-title">
          <h1>Live Analytics</h1>
        </div>
        <InlineAlert title="Failed to load live analytics" message={error} />
      </section>
    );
  }

  if (!snapshot) {
    return (
      <section className="realtime-analytics">
        <div className="page-title">
          <h1>Live Analytics</h1>
        </div>
        <InlineAlert
          title="No analytics snapshot available"
          message="The stream has not produced any state yet."
        />
      </section>
    );
  }

  const maxBarValue = Math.max(
    1,
    ...snapshot.minuteSeries.map((entry) => Math.max(entry.responses, entry.templates)),
  );

  return (
    <section className="realtime-analytics">
      <div className="page-title">
        <h1>Live Analytics</h1>
        <p>
          Near real-time metrics with a target delay of up to{' '}
          {snapshot.acceptableDelaySeconds} seconds.
        </p>
      </div>

      {!connected && (
        <InlineAlert
          title="Live connection unavailable"
          message="The dashboard will keep trying to reconnect. Metrics may be stale until the stream returns."
        />
      )}

      <div className="realtime-analytics__status">
        <span className={`realtime-analytics__badge ${connected ? 'is-live' : 'is-offline'}`}>
          {connected ? 'Connected' : 'Reconnecting'}
        </span>
        <p>Last snapshot: {formatTimestamp(snapshot.generatedAt)}</p>
      </div>

      <div className="realtime-analytics__metrics">
        <article className="realtime-analytics__metric">
          <strong>{snapshot.totals.responsesLastFiveMinutes}</strong>
          <span>Responses in 5 minutes</span>
        </article>
        <article className="realtime-analytics__metric">
          <strong>{snapshot.totals.responsesLastHour}</strong>
          <span>Responses in 60 minutes</span>
        </article>
        <article className="realtime-analytics__metric">
          <strong>{snapshot.totals.activeUsersLastFiveMinutes}</strong>
          <span>Active users in 5 minutes</span>
        </article>
        <article className="realtime-analytics__metric">
          <strong>{snapshot.totals.templatesCreatedLastHour}</strong>
          <span>Templates created in 60 minutes</span>
        </article>
        <article className="realtime-analytics__metric">
          <strong>{snapshot.totals.templatesUpdatedLastHour}</strong>
          <span>Templates updated in 60 minutes</span>
        </article>
      </div>

      <div className="realtime-analytics__grid">
        <article className="realtime-analytics__panel">
          <div className="realtime-analytics__panel-head">
            <h2>Activity timeline</h2>
            <small>Last 12 minutes</small>
          </div>
          <div className="realtime-analytics__chart">
            {snapshot.minuteSeries.map((entry) => (
              <div key={entry.minute} className="realtime-analytics__chart-column">
                <div className="realtime-analytics__chart-bars">
                  <span
                    className="bar bar--responses"
                    style={{ height: `${(entry.responses / maxBarValue) * 100}%` }}
                    title={`${entry.responses} responses`}
                  />
                  <span
                    className="bar bar--templates"
                    style={{ height: `${(entry.templates / maxBarValue) * 100}%` }}
                    title={`${entry.templates} template updates`}
                  />
                </div>
                <small>{formatMinuteLabel(entry.minute)}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="realtime-analytics__panel">
          <div className="realtime-analytics__panel-head">
            <h2>Top templates</h2>
            <small>By response volume in the last hour</small>
          </div>
          {snapshot.topTemplates.length ? (
            <ul className="realtime-analytics__rank-list">
              {snapshot.topTemplates.map((template) => (
                <li key={template.templateId}>
                  <div>
                    <strong>{template.label}</strong>
                    <small>Template #{template.templateId}</small>
                  </div>
                  <span>{template.responseCount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="realtime-analytics__empty">
              No responses yet in the current analytics window.
            </p>
          )}
        </article>

        <article className="realtime-analytics__panel realtime-analytics__panel--full">
          <div className="realtime-analytics__panel-head">
            <h2>Recent events</h2>
            <small>Real application events, newest first</small>
          </div>
          {snapshot.recentEvents.length ? (
            <ul className="realtime-analytics__event-list">
              {snapshot.recentEvents.map((event) => (
                <li key={event.id}>
                  <div>
                    <strong>{formatEventLabel(event.type)}</strong>
                    <p>
                      User #{event.userId}
                      {event.templateId ? ` • Template #${event.templateId}` : ''}
                      {event.templateTitle ? ` • ${event.templateTitle}` : ''}
                      {event.answersCount ? ` • ${event.answersCount} answers` : ''}
                    </p>
                  </div>
                  <time>{formatTimestamp(event.occurredAt)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="realtime-analytics__empty">No events have arrived yet.</p>
          )}
        </article>
      </div>
    </section>
  );
};

export default RealtimeAnalyticsPage;
