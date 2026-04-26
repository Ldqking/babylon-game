// ============================================================
// GameHUD — 游戏内 HUD（科技风）
// ============================================================

import { useI18n } from '../i18n/index.jsx'
import { MAX_LIVES, ORB_COUNT, GEM_COUNT, STAR_COUNT } from '../game/constants'

export default function GameHUD({ lives, score, time, stats, onToggleControls }) {
  const { t } = useI18n()

  return (
    <>
      {/* 生命值 */}
      <div className="absolute top-4 left-4 bg-[#0a121f]/80 backdrop-blur-sm border border-[#1a3050]/50 rounded-lg px-3 py-2 select-none shadow-[0_0_15px_rgba(0,150,255,0.06)]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 tracking-widest mr-1">HP</span>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span
              key={i}
              className={`text-sm leading-none ${i < lives ? 'text-red-400 drop-shadow-[0_0_6px_rgba(255,50,50,0.5)]' : 'text-slate-700'}`}
            >&#9829;</span>
          ))}
        </div>
      </div>

      {/* 计时器 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0a121f]/80 backdrop-blur-sm border border-[#1a3050]/50 rounded-lg px-4 py-2 select-none shadow-[0_0_15px_rgba(0,150,255,0.06)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,200,255,0.6)] animate-pulse" />
          <span className="text-slate-500 text-[10px] tracking-widest">{t('hud.time')}</span>
          <span className="text-cyan-300 text-base font-bold tabular-nums font-mono">{time}s</span>
        </div>
      </div>

      {/* 分数 */}
      <div className="absolute top-4 right-4 bg-[#0a121f]/80 backdrop-blur-sm border border-[#1a3050]/50 rounded-lg px-4 py-2 select-none shadow-[0_0_15px_rgba(0,150,255,0.06)]">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] tracking-widest">{t('hud.score')}</span>
          <span className="text-cyan-300 text-base font-bold tabular-nums font-mono">{score}</span>
        </div>
      </div>

      {/* 收集统计 */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#0a121f]/80 backdrop-blur-sm border border-[#1a3050]/40 rounded-lg px-4 py-1.5 select-none shadow-[0_0_15px_rgba(0,150,255,0.04)]">
        <div className="flex items-center gap-4">
          <StatItem label={t('hud.orbs')} dotClass="bg-blue-400" dotStyle={{ boxShadow: '0 0 6px rgba(0,100,255,0.5)' }}>
            {stats.orbs}/{ORB_COUNT}
          </StatItem>
          <div className="w-px h-3 bg-[#1a3050]/50" />
          <StatItem label={t('hud.gems')} dotClass="bg-green-400" dotStyle={{ boxShadow: '0 0 6px rgba(0,200,100,0.5)' }}>
            {stats.gems}/{GEM_COUNT}
          </StatItem>
          <div className="w-px h-3 bg-[#1a3050]/50" />
          <StatItem label={t('hud.stars')} dotClass="bg-yellow-400" dotStyle={{ boxShadow: '0 0 6px rgba(255,200,0,0.5)' }}>
            {stats.stars}/{STAR_COUNT}
          </StatItem>
        </div>
      </div>

      {/* 操作提示按钮 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={onToggleControls}
          className="bg-[#0a121f]/70 backdrop-blur-sm border border-[#1a3050]/40 rounded-lg px-4 py-2
                     text-slate-500 hover:text-cyan-400 text-xs transition-all duration-200 cursor-pointer
                     hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,150,255,0.1)]
                     flex items-center gap-2"
        >
          <span className="font-mono text-[10px]">[?]</span>
          <span className="text-[10px] tracking-wider">{t('hud.controls')}</span>
        </button>
      </div>
    </>
  )
}

function StatItem({ label, dotClass, dotStyle, children }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} style={dotStyle} />
      <span className="text-slate-500 text-[10px]">{label}</span>
      <span className="text-white text-xs font-bold tabular-nums">{children}</span>
    </div>
  )
}
