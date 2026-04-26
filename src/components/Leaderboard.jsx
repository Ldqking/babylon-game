// ============================================================
// Leaderboard — 排行榜展示组件
// ============================================================

import { useI18n } from '../i18n/index.jsx'

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400']

export default function Leaderboard({ entries, max = 5 }) {
  const { t } = useI18n()
  if (!entries || entries.length === 0) return null

  return (
    <div className="border-t border-white/10 pt-3">
      <h3 className="text-white/40 text-xs font-semibold tracking-widest mb-2">
        {t('leaderboard')}
      </h3>
      <div className="space-y-1">
        {entries.slice(0, max).map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2">
              <span className={`w-5 text-left font-bold ${RANK_COLORS[i] || 'text-white/30'}`}>
                #{i + 1}
              </span>
              <span className="text-white/70 truncate max-w-[120px]">{entry.name}</span>
            </span>
            <span className="text-white font-bold tabular-nums">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
