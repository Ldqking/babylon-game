// ============================================================
// Leaderboard — 排行榜展示组件（科技风）
// ============================================================

import { useI18n } from '../i18n/index.jsx'

const RANK_COLORS = ['text-yellow-400', 'text-slate-300', 'text-orange-400']

export default function Leaderboard({ entries, max = 5 }) {
  const { t } = useI18n()
  if (!entries || entries.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-0.5 h-3 bg-cyan-500/40" />
        <h3 className="text-slate-500 text-[10px] tracking-[0.2em]">{t('leaderboard')}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
      </div>
      <div className="space-y-1">
        {entries.slice(0, max).map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-0.5">
            <span className="flex items-center gap-2">
              <span className={`w-6 text-left font-mono text-[11px] font-bold ${RANK_COLORS[i] || 'text-slate-600'}`}>
                #{i + 1}
              </span>
              <span className="text-slate-400 truncate max-w-[120px]">{entry.name}</span>
            </span>
            <span className="text-cyan-300 font-mono font-bold text-[11px] tabular-nums">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
