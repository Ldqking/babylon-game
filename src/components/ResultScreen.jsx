// ============================================================
// ResultScreen — 结算页面（科技风）
// ============================================================

import { useI18n } from '../i18n/index.jsx'
import Leaderboard from './Leaderboard'
import { ORB_COUNT, GEM_COUNT, STAR_COUNT } from '../game/constants'

export default function ResultScreen({ result, score, stats, time, lives, bonus, leaderboard, onBack }) {
  const { t } = useI18n()
  const isWin = result === 'won'
  const baseScore = stats.orbs * 10 + stats.gems * 25 + stats.stars * 50

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#05080f]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4">
        <div className="relative bg-[#0d1520]/95 backdrop-blur-md border border-[#1a3050]/60 rounded-xl px-10 py-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.08),inset_0_0_40px_rgba(0,150,255,0.02)]">
          {/* 顶部装饰 */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* 标题区域 */}
          <div className="mb-5">
            <div className="text-3xl mb-2">{isWin ? '★' : '⚠'}</div>
            <h2 className={`text-xl font-bold tracking-wider ${isWin ? 'text-transparent bg-gradient-to-b from-yellow-200 to-yellow-400 bg-clip-text' : 'text-red-400'}`}>
              {isWin ? t('result.win') : t('result.gameover')}
            </h2>
            <p className="text-slate-500 text-xs mt-1">{isWin ? t('result.winDesc') : t('result.gameoverDesc')}</p>
          </div>

          {/* 统计数据面板 */}
          <div className="bg-[#0a121f]/80 border border-[#1a3050]/40 rounded-lg p-4 mb-5 space-y-1.5">
            {/* 最终得分 */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1a3050]/30">
              <span className="text-slate-500 text-xs tracking-wider">{t('result.finalScore')}</span>
              <span className="text-cyan-300 font-mono font-bold text-xl tabular-nums">{score}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1">
              <ResultRow label={t('result.baseScore')} value={baseScore} valueClass="text-slate-300" />
              {isWin && <ResultRow label={t('result.timeBonus')} value={`+${bonus}`} valueClass="text-emerald-400" />}
              <ResultRow label={t('result.orbs')} value={`${stats.orbs}/${ORB_COUNT}`} valueClass="text-blue-400" />
              <ResultRow label={t('result.gems')} value={`${stats.gems}/${GEM_COUNT}`} valueClass="text-green-400" />
              <ResultRow label={t('result.stars')} value={`${stats.stars}/${STAR_COUNT}`} valueClass="text-yellow-400" />
              <ResultRow label={t('result.time')} value={`${time}s`} valueClass="text-slate-300" />
              {isWin && <ResultRow label={t('result.livesRemaining')} value={`${lives}/3`} valueClass="text-red-400" />}
            </div>
          </div>

          {/* 排行榜 */}
          <div className="mb-5">
            <Leaderboard entries={leaderboard} />
          </div>

          {/* 返回按钮 */}
          <button
            onClick={onBack}
            className="group relative w-full py-2.5 rounded-lg text-sm font-semibold tracking-widest
                       border border-[#1a3050]/60 bg-[#0a121f]/80 text-slate-400 cursor-pointer
                       transition-all duration-200 overflow-hidden
                       hover:border-cyan-500/30 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(0,150,255,0.1)]"
          >
            <span className="relative z-10">{t('result.back')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* 底部装饰 */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}

function ResultRow({ label, value, valueClass }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600 text-[10px] tracking-wide">{label}</span>
      <span className={`font-mono font-bold text-[11px] tabular-nums ${valueClass}`}>{value}</span>
    </div>
  )
}
