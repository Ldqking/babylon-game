// ============================================================
// GameHUD — 游戏内 HUD
// ============================================================

import { useI18n } from '../i18n/index.jsx'
import { MAX_LIVES, ORB_COUNT, GEM_COUNT, STAR_COUNT, ENEMY_COUNT } from '../game/constants'

export default function GameHUD({ lives, score, time, stats }) {
  const { t } = useI18n()

  return (
    <>
      {/* 生命值 */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl select-none">
        {Array.from({ length: MAX_LIVES }, (_, i) => (
          <span
            key={i}
            className={`text-lg leading-none ${i < lives ? 'text-red-400' : 'text-white/20'}`}
          >&#9829;</span>
        ))}
      </div>

      {/* 计时器 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl select-none">
        <span className="text-white/40 text-xs font-medium mr-2">{t('hud.time')}</span>
        <span className="text-white text-lg font-bold tabular-nums">{time}s</span>
      </div>

      {/* 分数 */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl select-none">
        <span className="text-white/40 text-xs font-medium mr-2">{t('hud.score')}</span>
        <span className="text-cyan-300 text-lg font-bold tabular-nums">{score}</span>
      </div>

      {/* 收集统计 */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-lg select-none">
        <span className="text-blue-300 text-xs">
          {t('hud.orbs')} <span className="font-bold text-white">{stats.orbs}/{ORB_COUNT}</span>
        </span>
        <span className="text-green-300 text-xs">
          {t('hud.gems')} <span className="font-bold text-white">{stats.gems}/{GEM_COUNT}</span>
        </span>
        <span className="text-yellow-300 text-xs">
          {t('hud.stars')} <span className="font-bold text-white">{stats.stars}/{STAR_COUNT}</span>
        </span>
        <span className="text-red-300 text-xs">
          {t('hud.enemies')} <span className="font-bold text-white">{ENEMY_COUNT}</span>
        </span>
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg select-none">
        <span className="text-white/40 text-xs">{t('hud.controls')}</span>
      </div>
    </>
  )
}
