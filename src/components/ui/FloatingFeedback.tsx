import React, { useEffect } from 'react';

export interface FloatingItem {
  id: string;
  text: string;
  type: 'points' | 'perfect' | 'combo' | 'levelup' | 'error';
  subtext?: string;
}

interface FloatingProps {
  items: FloatingItem[];
  onRemove: (id: string) => void;
}

export const FloatingFeedback: React.FC<FloatingProps> = ({ items, onRemove }) => {
  useEffect(() => {
    if (items.length === 0) return;
    const timers = items.map((item) =>
      window.setTimeout(() => {
        onRemove(item.id);
      }, 1600)
    );
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [items, onRemove]);

  return (
    <div className="floating-feedback-overlay" pointer-events="none">
      {items.map((item) => (
        <div key={item.id} className={`floating-pill floating-${item.type}`}>
          <span className="floating-main-text">{item.text}</span>
          {item.subtext && <span className="floating-sub-text">{item.subtext}</span>}
        </div>
      ))}
    </div>
  );
};
