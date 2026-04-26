// ============================================================
// 排行榜存储
// 使用 localStorage 在浏览器本地持久化 Top 10 成绩
// ============================================================

const LEADERBOARD_KEY = 'babel_demo_lb'

/** 从 localStorage 读取排行榜数据 */
export function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * 向排行榜写入一条新记录，保留 Top 10
 * @returns {Array} 更新后的排行榜
 */
export function saveToLeaderboard(name, score, orbs = 0, gems = 0, stars = 0, time = 0) {
  const entry = { name, score, orbs, gems, stars, time, date: Date.now() }
  const lb = [...loadLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb))
  return lb
}
