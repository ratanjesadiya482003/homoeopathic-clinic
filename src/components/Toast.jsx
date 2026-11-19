import React, { useEffect } from 'react';

export default function Toast({ toasts, onDismiss }) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

