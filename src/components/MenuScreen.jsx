// ============================================================
// MenuScreen — 游戏主菜单（科技风）
// ============================================================

import { useState } from 'react'
import { useI18n } from '../i18n/index.jsx'
import { DIFFICULTY } from '../game/constants'
import Leaderboard from './Leaderboard'
import { loadLeaderboard } from '../game/leaderboard'

export default function MenuScreen({ onStart }) {
  const { t, toggleLang, locale } = useI18n()
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState('normal')
  const leaderboard = loadLeaderboard()

  function handleStart() {
    onStart(name.trim() || 'Player', difficulty)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* 背景装饰网格 */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#00ccff 1px,transparent 1px),linear-gradient(90deg,#00ccff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
      />

      {/* 语言切换 */}
      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 bg-[#0a121f]/80 backdrop-blur-sm border border-[#1a3050]/50
                   text-slate-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded-lg
                   transition-all duration-200 cursor-pointer tracking-wider"
      >
        {t('langToggle')}
      </button>

      <div className="relative w-full max-w-sm mx-4">
        {/* 主面板 */}
        <div className="relative bg-[#0d1520]/90 backdrop-blur-md border border-[#1a3050]/60 rounded-xl px-10 py-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.08),inset_0_0_40px_rgba(0,150,255,0.02)]">
          {/* 顶部装饰 */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Logo / 标题 */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-500/40" />
              <span className="text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,200,255,0.3)]">&#9670;</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-500/40" />
            </div>
            <h1 className="text-transparent bg-gradient-to-b from-cyan-200 to-cyan-400 bg-clip-text text-2xl font-bold tracking-wider">{t('menu.title')}</h1>
            <p className="text-slate-500 text-xs mt-1 tracking-wide">{t('menu.subtitle')}</p>
          </div>

          {/* 昵称输入 */}
          <div className="relative mb-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('menu.namePlaceholder')}
              maxLength={16}
              className="w-full bg-[#0a121f]/80 border border-[#1a3050]/60 rounded-lg px-4 py-2.5
                         text-cyan-300 text-sm placeholder-slate-600 outline-none
                         focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,150,255,0.1)]
                         transition-all duration-200 font-mono"
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
            <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 focus-within:opacity-100 transition-opacity" />
          </div>

          {/* 难度选择 */}
          <div className="mb-5">
            <p className="text-slate-600 text-[10px] tracking-[0.2em] mb-2">{t('menu.difficulty')}</p>
            <div className="flex gap-2">
              {Object.entries(DIFFICULTY).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all duration-200 cursor-pointer ${
                    difficulty === key
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(0,200,255,0.1)]'
                      : 'bg-[#0a121f]/60 text-slate-500 border-[#1a3050]/40 hover:border-[#1a3050]/80 hover:text-slate-300'
                  }`}
                >
                  {t(cfg.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* 开始按钮 */}
          <button
            onClick={handleStart}
            className="group relative w-full py-2.5 rounded-lg font-semibold text-sm tracking-widest
                       border border-cyan-500/30 bg-gradient-to-b from-cyan-500/15 to-cyan-500/5
                       text-cyan-300 cursor-pointer overflow-hidden
                       transition-all duration-200
                       hover:shadow-[0_0_25px_rgba(0,200,255,0.2)] hover:border-cyan-500/50"
          >
            <span className="relative z-10">{t('menu.start')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* 底部排行榜 */}
          <div className="mt-5 pt-4 border-t border-[#1a3050]/40">
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  )
}
