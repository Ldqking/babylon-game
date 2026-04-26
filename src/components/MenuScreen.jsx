// ============================================================
// MenuScreen — 游戏主菜单
// ============================================================

import { useState } from 'react'
import { useI18n } from '../i18n/index.jsx'
import Leaderboard from './Leaderboard'
import { loadLeaderboard } from '../game/leaderboard'

export default function MenuScreen({ onStart }) {
  const { t, toggleLang, locale } = useI18n()
  const [name, setName] = useState('')
  const leaderboard = loadLeaderboard()

  function handleStart() {
    onStart(name.trim() || 'Player')
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* 语言切换按钮 */}
      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white
                   text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer border border-white/10"
      >
        {t('langToggle')}
      </button>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-10 py-8 text-center shadow-2xl w-full max-w-sm mx-4">
        <div className="text-4xl mb-2">&#9917;</div>
        <h1 className="text-white text-2xl font-bold mb-1">{t('menu.title')}</h1>
        <p className="text-white/40 text-sm mb-6">{t('menu.subtitle')}</p>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('menu.namePlaceholder')}
          maxLength={16}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm
                     placeholder-white/30 outline-none focus:border-cyan-400/50 transition-colors mb-4"
          onKeyDown={e => e.key === 'Enter' && handleStart()}
        />

        <button
          onClick={handleStart}
          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30
                     px-6 py-2.5 rounded-lg transition-all duration-200 font-medium cursor-pointer mb-6"
        >
          {t('menu.start')}
        </button>

        <Leaderboard entries={leaderboard} />
      </div>
    </div>
  )
}
