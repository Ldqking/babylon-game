// ============================================================
// ResultScreen — 结算页面
// ============================================================

import { useI18n } from '../i18n/index.jsx'
import Leaderboard from './Leaderboard'
import { ORB_COUNT, GEM_COUNT, STAR_COUNT } from '../game/constants'

export default function ResultScreen({ result, score, stats, time, lives, bonus, leaderboard, onBack }) {
  const { t } = useI18n()
  const isWin = result === 'won'
  const baseScore = stats.orbs * 10 + stats.gems * 25 + stats.stars * 50

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-10 py-8 text-center shadow-2xl w-full max-w-sm mx-4">
        <div className="text-4xl mb-2">{isWin ? '🎉' : '💀'}</div>
        <h2 className="text-white text-2xl font-bold mb-1">
          {isWin ? t('result.win') : t('result.gameover')}
        </h2>
        <p className="text-white/40 text-sm mb-4">
          {isWin ? t('result.winDesc') : t('result.gameoverDesc')}
        </p>

        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">{t('result.finalScore')}</span>
            <span className="text-cyan-300 font-bold text-lg">{score}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">{t('result.baseScore')}</span>
            <span className="text-white/70">{baseScore}</span>
          </div>
          {isWin && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">{t('result.timeBonus')}</span>
              <span className="text-emerald-400 font-semibold">+{bonus}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-white/40">{t('result.orbs')}</span>
            <span className="text-white/70">{stats.orbs}/{ORB_COUNT}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">{t('result.gems')}</span>
            <span className="text-white/70">{stats.gems}/{GEM_COUNT}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">{t('result.stars')}</span>
            <span className="text-white/70">{stats.stars}/{STAR_COUNT}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40">{t('result.time')}</span>
            <span className="text-white/70">{time}s</span>
          </div>
          {isWin && (
            <div className="flex justify-between text-xs">
              <span className="text-white/40">{t('result.livesRemaining')}</span>
              <span className="text-red-400">{lives}/{3}</span>
            </div>
          )}
        </div>

        <Leaderboard entries={leaderboard} />

        <button
          onClick={onBack}
          className="mt-4 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg
                     transition-all duration-200 font-medium cursor-pointer border border-white/10 w-full"
        >
          {t('result.back')}
        </button>
      </div>
    </div>
  )
}
