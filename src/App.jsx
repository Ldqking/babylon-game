// ============================================================
// App — 游戏主组件
//
// 职责：
// 1. 管理顶层游戏阶段 (menu / playing / gameover / won)
// 2. 将逻辑委托给 useGame Hook
// 3. 根据 gamePhase 渲染对应的 UI 层
// ============================================================

import { useRef, useState, useCallback } from 'react'
import { useGame } from './hooks/useGame'
import { saveToLeaderboard, loadLeaderboard } from './game/leaderboard'
import MenuScreen from './components/MenuScreen'
import GameHUD from './components/GameHUD'
import ResultScreen from './components/ResultScreen'

function App() {
  const canvasRef = useRef(null)

  // ---- 游戏状态 ----
  const [gamePhase, setGamePhase] = useState('menu')
  const [playerName, setPlayerName] = useState('')
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [stats, setStats] = useState({ orbs: 0, gems: 0, stars: 0 })
  const [endData, setEndData] = useState(null)    // 结算时保存完整结果数据
  const [leaderboard, setLeaderboard] = useState([])

  // 游戏运行中 → 定期同步 HUD 状态
  const handleStateChange = useCallback((state) => {
    setLives(state.lives)
    setScore(state.score)
    setTime(state.time)
    setStats(state.stats)
  }, [])

  // 游戏结束 → 保存排行榜并切换到结果界面
  const handleGameEnd = useCallback((data) => {
    setEndData(data)
    setGamePhase(data.result === 'won' ? 'won' : 'gameover')
    const lb = saveToLeaderboard(playerName, data.score, data.orbs, data.gems, data.stars, data.time)
    setLeaderboard(lb)
  }, [playerName])

  // 注入游戏 Hook（仅在 playing 阶段激活场景）
  useGame(canvasRef, playerName, gamePhase, {
    onStateChange: handleStateChange,
    onGameEnd: handleGameEnd,
  })

  // 点击"Start Game"进入游戏
  function handleStart(name) {
    setPlayerName(name)
    setGamePhase('playing')
    setLives(3)
    setScore(0)
    setTime(0)
    setStats({ orbs: 0, gems: 0, stars: 0 })
    setEndData(null)
    setLeaderboard([])
  }

  // 从结算页返回主菜单
  function handleBackToMenu() {
    setGamePhase('menu')
    setEndData(null)
    setLeaderboard([])
  }

  return (
    <div className="relative w-full h-svh bg-[#0a0a12] overflow-hidden font-sans">
      {/* Babylon.js 渲染画布 */}
      <canvas
        ref={canvasRef}
        className={`block w-full h-full outline-none ${gamePhase !== 'playing' ? 'hidden' : ''}`}
      />

      {/* HUD：仅游戏中显示 */}
      {gamePhase === 'playing' && (
        <GameHUD lives={lives} score={score} time={time} stats={stats} />
      )}

      {/* 主菜单 */}
      {gamePhase === 'menu' && (
        <MenuScreen onStart={handleStart} />
      )}

      {/* 结算页（Game Over / 胜利共用同一组件） */}
      {(gamePhase === 'gameover' || gamePhase === 'won') && endData && (
        <ResultScreen
          result={endData.result}
          score={endData.score}
          stats={{ orbs: endData.orbs, gems: endData.gems, stars: endData.stars }}
          time={endData.time}
          lives={endData.lives}
          bonus={endData.bonus || 0}
          leaderboard={leaderboard}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  )
}

export default App
