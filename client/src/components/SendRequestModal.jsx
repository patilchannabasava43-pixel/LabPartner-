import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

export default function SendRequestModal({ isOpen, onClose, student, onSend }) {
  const [message, setMessage] = useState(
    'Hey! I noticed we study similar subjects and have matching availability. Would love to partner up for labs and study sessions!'
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSend(student._id || student.user?._id, message);
    setSubmitting(false);
    onClose();
  };

  const templates = [
    'Would love to team up for lab assignments and midterm prep!',
    'Saw your profile in Computer Science! Looking for an active study partner for our weekly labs.',
    'Hey! We have overlapping schedules this weekend. Let us collaborate on the project!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
              <img
                src={student.avatar || student.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Send Partner Invitation</h3>
              <p className="text-xs text-slate-500">To {student.name || student.user?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Personal Invitation Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-sm text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Explain what subjects or projects you'd like to collaborate on..."
              maxLength={300}
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Be friendly and mention shared subjects</span>
              <span>{message.length} / 300</span>
            </div>
          </div>

          {/* Quick template chips */}
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Quick Templates:
            </span>
            <div className="flex flex-col gap-1.5">
              {templates.map((tpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setMessage(tpl)}
                  className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-indigo-50/70 hover:text-indigo-900 border border-slate-200 transition-colors"
                >
                  "{tpl}"
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

