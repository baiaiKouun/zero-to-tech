"use client";

import { useEffect } from "react";

function formatTime(iso) {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryModal({ open, items, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-heading">
          <div>
            <p className="section-kicker">历史记录</p>
            <h3>最近的分析</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            关闭
          </button>
        </div>

        {items.length === 0 ? (
          <p className="history-empty">还没有记录，先分析一句试试。</p>
        ) : (
          <div className="history-list">
            {items.map((item) => (
              <div className="history-item" key={item.id}>
                <p className="history-text">{item.text}</p>
                <span className="history-meta">
                  {item.score} · {item.label} · {formatTime(item.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
