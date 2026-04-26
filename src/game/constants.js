// ============================================================
// 游戏常量配置
// 所有可调参数集中在此，方便调试和平衡性调整
// ============================================================

export const MAP_SIZE = 8           // 地图半边长，总范围 [-MAP_SIZE, MAP_SIZE]
export const PLAYER_SPEED = 0.14    // 玩家每帧移动速度

export const ORB_COUNT = 12         // 蓝色小球（普通收集物）数量
export const GEM_COUNT = 6          // 绿色水晶（中级收集物）数量
export const STAR_COUNT = 3         // 金色几何结（稀有收集物）数量
export const ENEMY_COUNT = 3        // 追击敌人的数量（普通难度基础值）

export const ENEMY_SPEED = 0.035    // 敌人基础追击速度
export const MAX_LIVES = 3          // 玩家最大生命值（红心数）

// ---- 难度配置 ----
export const DIFFICULTY = {
  easy: {
    labelKey: 'difficulty.easy',
    enemySpeedMul: 0.6,       // 敌人速度系数
    enemyCount: 2,            // 敌人数量
  },
  normal: {
    labelKey: 'difficulty.normal',
    enemySpeedMul: 1.0,
    enemyCount: 3,
  },
  hard: {
    labelKey: 'difficulty.hard',
    enemySpeedMul: 2.0,
    enemyCount: 6,
  },
}

export const ORB_SCORE = 10         // 每个小球的得分
export const GEM_SCORE = 25         // 每个水晶的得分
export const STAR_SCORE = 50        // 每个稀有收集物的得分

export const MAX_TIME_BONUS = 500   // 通关时间奖励上限
export const TIME_BONUS_DECAY = 5   // 每秒衰减的时间奖励分数
export const INVINCIBLE_MS = 1500   // 受伤后无敌时间（毫秒）
export const COLLECT_DIST = 1.0     // 收集判定距离
export const ENEMY_HIT_DIST = 0.9   // 敌人碰撞判定距离

export const LASER_SPEED = 0.6      // 激光飞行速度（单位/帧）
export const LASER_RANGE = 14       // 激光最大射程
export const LASER_COOLDOWN = 350   // 激光发射冷却（毫秒）
export const ENEMY_RESPAWN_DELAY = 3000  // 敌人被消灭后重生延迟（毫秒）
