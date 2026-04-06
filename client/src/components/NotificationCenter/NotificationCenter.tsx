import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, removeNotification } from '../../store';
import './NotificationCenter.scss';

export const NotificationCenter: React.FC = () => {
  const notifications = useAppSelector((state) => state.ui.notifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      window.setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 3500),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dispatch, notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="notificationCenter" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notificationCenter__item notificationCenter__item--${notification.type}`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => dispatch(removeNotification(notification.id))}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
