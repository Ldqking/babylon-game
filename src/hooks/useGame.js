// ============================================================
// useGame — 游戏引擎 Hook
// ============================================================

import { useEffect, useRef } from 'react'
import {
  Engine, Scene, FreeCamera, HemisphericLight, PointLight, Vector3, Color3,
} from 'babylonjs'
import {
  MAP_SIZE, PLAYER_SPEED, ENEMY_SPEED, MAX_LIVES,
  ORB_COUNT, GEM_COUNT, STAR_COUNT,
  ORB_SCORE, GEM_SCORE, STAR_SCORE,
  MAX_TIME_BONUS, TIME_BONUS_DECAY, INVINCIBLE_MS,
  COLLECT_DIST, ENEMY_HIT_DIST,
  LASER_SPEED, LASER_RANGE, LASER_COOLDOWN, ENEMY_RESPAWN_DELAY,
  DIFFICULTY,
} from '../game/constants'
import {
  buildScene, buildWalls, createPlayer,
  createOrbs, createGems, createStars, createEnemies,
  createLaser, spawnParticles, updateParticles,
} from '../game/entities'

export function useGame(canvasRef, playerName, difficulty, gamePhase, callbacks, paused) {
  const keysRef = useRef({})
  const pausedRef = useRef(false)
  const engineRef = useRef(null)
  const sceneRef = useRef(null)
  const { onStateChange, onGameEnd } = callbacks
  const diffCfg = DIFFICULTY[difficulty] || DIFFICULTY.normal
  const effectiveEnemySpeed = ENEMY_SPEED * diffCfg.enemySpeedMul
  pausedRef.current = paused

  useEffect(() => {
    if (gamePhase !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return

    // ---- 游戏运行时状态 ----
    const game = {
      lives: MAX_LIVES, score: 0,
      orbsCollected: 0, gemsCollected: 0, starsCollected: 0,
      elapsed: 0, isOver: false,
      countdown: 3,  // 开始倒计时（秒）
    }
    const particles = []
    const lasers = []
    let lastDirection = new Vector3(0, 0, 1)  // 默认朝前
    let lastShotTime = 0

    // ---- 初始化 Babylon ----
    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true, stencil: true,
    })
    const scene = new Scene(engine)
    engineRef.current = engine
    sceneRef.current = scene

    // ---- 场景布景 ----
    buildScene(scene); buildWalls(scene)

    const camera = new FreeCamera('cam', new Vector3(0, 14, -14), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, false)
    camera.minZ = 0.1

    const hemi = new HemisphericLight('hemi', new Vector3(0, 1, -0.3), scene)
    hemi.intensity = 0.8; hemi.diffuse = new Color3(0.7, 0.8, 1)
    const fill = new HemisphericLight('fill', new Vector3(0, -0.3, 1), scene)
    fill.intensity = 0.3
    const accent = new PointLight('accent', new Vector3(0, 6, 0), scene)
    accent.intensity = 0.6; accent.diffuse = new Color3(0.4, 0.2, 0.8)

    // ---- 创建物体 ----
    const player = createPlayer(scene)
    const usedPositions = []
    const orbs = createOrbs(scene, usedPositions)
    const gems = createGems(scene, usedPositions)
    const stars = createStars(scene, usedPositions)
    const enemies = createEnemies(scene, diffCfg.enemyCount)

    // ---- 键盘 ----
    const keys = keysRef.current
    const onDown = (e) => { keys[e.code] = true }
    const onUp   = (e) => { keys[e.code] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)

    // ---- 鼠标瞄准 ----
    let mouseGroundPos = null
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      const pick = scene.pick(e.clientX - rect.left, e.clientY - rect.top)
      if (pick?.hit && pick.pickedPoint) {
        mouseGroundPos = pick.pickedPoint.clone()
        mouseGroundPos.y = 0
      }
    }
    const onPointerLeave = () => { mouseGroundPos = null }
    canvas.addEventListener('pointermove', onPointer)
    canvas.addEventListener('pointerleave', onPointerLeave)

    // ---- 无敌闪烁 ----
    let invincibleUntil = 0
    let flashTimer = null

    // ---- 状态同步 ----
    let lastReactUpdate = 0
    function sync() {
      onStateChange({
        lives: game.lives, score: game.score,
        time: Math.floor(game.elapsed),
        stats: { orbs: game.orbsCollected, gems: game.gemsCollected, stars: game.starsCollected },
        countdown: game.countdown,
      })
    }

    // ============================================================
    // 游戏主循环
    // ============================================================
    scene.registerBeforeRender(() => {
      if (game.isOver) return
      if (pausedRef.current) {
        updateParticles(scene, particles)
        return
      }
      const now = performance.now()

      // ---- 开始倒计时：冻结所有游戏逻辑 ----
      if (game.countdown > 0) {
        game.countdown -= engine.getDeltaTime() / 1000
        if (game.countdown < 0) game.countdown = 0
        if (now - lastReactUpdate > 200) { lastReactUpdate = now; sync() }
        updateParticles(scene, particles)
        return
      }

      game.elapsed += engine.getDeltaTime() / 1000

      if (now - lastReactUpdate > 200) { lastReactUpdate = now; sync() }

      // ---- 玩家移动 ----
      let dx = 0, dz = 0
      if (keys['ArrowLeft']  || keys['KeyA']) dx -= 1
      if (keys['ArrowRight'] || keys['KeyD']) dx += 1
      if (keys['ArrowUp']    || keys['KeyW']) dz += 1
      if (keys['ArrowDown']  || keys['KeyS']) dz -= 1

      // 瞄准方向：鼠标指向地面 → 玩家到鼠标的向量
      let aimDir = lastDirection
      if (mouseGroundPos) {
        const toMouse = mouseGroundPos.subtract(player.position)
        toMouse.y = 0
        if (toMouse.length() > 0.5) aimDir = toMouse.normalize()
      }

      if (dx !== 0 || dz !== 0) {
        const len = Math.sqrt(dx * dx + dz * dz)
        dx /= len; dz /= len
        lastDirection = new Vector3(dx, 0, dz)
        const nx = player.position.x + dx * PLAYER_SPEED
        const nz = player.position.z + dz * PLAYER_SPEED
        const lim = MAP_SIZE + 0.3
        player.position.x = Math.max(-lim, Math.min(lim, nx))
        player.position.z = Math.max(-lim, Math.min(lim, nz))
        player.rotation.x = dz * 0.12
        player.rotation.z = -dx * 0.12
      } else {
        // 静止时面朝瞄准方向
        player.rotation.x = 0
        player.rotation.z = 0
        player.rotation.y = Math.atan2(aimDir.x, aimDir.z)
      }

      // ---- 发射激光（空格键自动连射） ----
      if (keys['Space'] && now - lastShotTime > LASER_COOLDOWN) {
        lastShotTime = now
        const laser = createLaser(scene, player.position, aimDir)
        lasers.push(laser)
      }

      // ---- 激光飞行 & 碰撞 ----
      for (let li = lasers.length - 1; li >= 0; li--) {
        const L = lasers[li]
        L.meshes.forEach(m => m.position.addInPlace(L.dir.scale(LASER_SPEED)))
        L.travelled += LASER_SPEED

        let hit = false
        for (const e of enemies) {
          if (!e.alive) continue
          const dist = Vector3.Distance(L.meshes[0].position, e.root.position)
          if (dist < 1.0) {
            // 判定暴击：激光极近距离穿过敌人中心
            const isCrit = dist < 0.25
            const damage = isCrit ? 3 : 1
            e.health -= damage
            e.flashFrames = 6  // 闪白持续 6 帧

            if (isCrit) {
              // 暴击：大范围金色粒子爆发
              spawnParticles(scene, particles, e.root.position, new Color3(1, 1, 0.2), 35)
            } else {
              // 普通命中：小范围粒子 + 材质闪白
              e.bMat.emissiveColor = new Color3(1, 1, 1)
              spawnParticles(scene, particles, e.root.position, e.color, 6)
            }

            if (e.health <= 0) {
              e.alive = false
              e.respawnTimer = ENEMY_RESPAWN_DELAY
              e.meshes.forEach(m => m.setEnabled(false))
              spawnParticles(scene, particles, e.root.position, e.color, 25)
            }
            hit = true
            break
          }
        }

        if (hit || L.travelled > LASER_RANGE) {
          L.meshes.forEach(m => scene.removeMesh(m))
          lasers.splice(li, 1)
        }
      }

      // ---- 敌人重生 ----
      for (const e of enemies) {
        if (!e.alive) {
          e.respawnTimer -= engine.getDeltaTime()
          if (e.respawnTimer <= 0) {
            // 在地图内随机选一个位置（避开出生点）
            let newPos = new Vector3(
              (Math.random() - 0.5) * MAP_SIZE * 2, 0.3,
              (Math.random() - 0.5) * MAP_SIZE * 2,
            )
            if (Vector3.Distance(newPos, Vector3.Zero()) < 1.5) {
              newPos = new Vector3(
                Math.max(1.5, Math.abs(newPos.x)) * (newPos.x >= 0 ? 1 : -1),
                0.3,
                Math.max(1.5, Math.abs(newPos.z)) * (newPos.z >= 0 ? 1 : -1),
              )
            }
            e.meshes.forEach(m => {
              m.position = newPos.clone()
              m.setEnabled(true)
            })
            e.root.position = newPos.clone()
            e.alive = true
            e.health = e.maxHealth
            e.bMat.emissiveColor = e.color.scale(0.25)
          }
        }
      }

      // ---- 收集小球 ----
      for (let i = orbs.length - 1; i >= 0; i--) {
        if (Vector3.Distance(player.position, orbs[i].position) < COLLECT_DIST) {
          spawnParticles(scene, particles, orbs[i].position, new Color3(0.2, 0.5, 1), 12)
          scene.removeMesh(orbs[i]); orbs.splice(i, 1)
          game.score += ORB_SCORE; game.orbsCollected++
        }
      }

      // ---- 收集水晶 ----
      for (let i = gems.length - 1; i >= 0; i--) {
        if (Vector3.Distance(player.position, gems[i].position) < COLLECT_DIST) {
          spawnParticles(scene, particles, gems[i].position, new Color3(0.1, 0.9, 0.4), 18)
          scene.removeMesh(gems[i]); gems.splice(i, 1)
          game.score += GEM_SCORE; game.gemsCollected++
        }
      }

      // ---- 收集几何结 ----
      for (let i = stars.length - 1; i >= 0; i--) {
        if (Vector3.Distance(player.position, stars[i].position) < COLLECT_DIST) {
          spawnParticles(scene, particles, stars[i].position, new Color3(1, 0.85, 0), 25)
          scene.removeMesh(stars[i]); stars.splice(i, 1)
          game.score += STAR_SCORE; game.starsCollected++
        }
      }

      // ---- 胜利判定 ----
      if (orbs.length === 0 && gems.length === 0 && stars.length === 0 && !game.isOver) {
        game.isOver = true
        const bonus = Math.max(0, MAX_TIME_BONUS - Math.floor(game.elapsed) * TIME_BONUS_DECAY)
        game.score += bonus; sync()
        onGameEnd({
          result: 'won', score: game.score,
          orbs: game.orbsCollected, gems: game.gemsCollected, stars: game.starsCollected,
          time: Math.floor(game.elapsed), lives: game.lives, bonus,
        })
      }

      // ---- 敌人 AI + 击中闪白消退 + 分离避免重叠 ----
      enemies.forEach((e, i) => {
        // 闪白衰减
        if (e.flashFrames > 0) {
          e.flashFrames--
          if (e.flashFrames === 0 && e.alive) {
            const intensity = 0.15 + (e.health / e.maxHealth) * 0.15
            e.bMat.emissiveColor = e.color.scale(intensity)
          }
        }
        if (!e.alive) return

        // 追击方向（朝向玩家）
        const dir = player.position.subtract(e.root.position); dir.y = 0
        const dist = dir.length()

        if (dist > 0.3) {
          dir.normalize()

          // 分离力：推开附近的其他敌人，防止堆叠
          let sepX = 0, sepZ = 0
          for (let j = 0; j < enemies.length; j++) {
            if (i === j || !enemies[j].alive) continue
            const d = Vector3.Distance(e.root.position, enemies[j].root.position)
            if (d < 1.8 && d > 0.01) {
              const pushDir = e.root.position.subtract(enemies[j].root.position)
              sepX += pushDir.x / d
              sepZ += pushDir.z / d
            }
          }

          // 融合追击方向 + 分离力
          let moveX = dir.x + sepX * 2.0
          let moveZ = dir.z + sepZ * 2.0
          const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ)
          if (moveLen > 0.01) {
            moveX /= moveLen
            moveZ /= moveLen
          }

          const speed = effectiveEnemySpeed * (0.8 + 0.4 * Math.sin(now * 0.002 + e.root.uniqueId))
          e.meshes.forEach(m => {
            m.position.x += moveX * speed
            m.position.z += moveZ * speed
          })
          const lim = MAP_SIZE + 0.3
          e.meshes.forEach(m => {
            m.position.x = Math.max(-lim, Math.min(lim, m.position.x))
            m.position.z = Math.max(-lim, Math.min(lim, m.position.z))
          })
        }
        // 始终面朝玩家
        e.root.rotation.y = Math.atan2(dir.x, dir.z)
      })

      // ---- 敌人碰撞 ----
      if (now > invincibleUntil) {
        enemies.forEach(e => {
          if (!e.alive) return
          if (Vector3.Distance(player.position, e.root.position) < ENEMY_HIT_DIST) {
            game.lives--
            spawnParticles(scene, particles, player.position, new Color3(1, 0.2, 0.2), 20)
            if (game.lives <= 0) {
              game.isOver = true; sync()
              onGameEnd({
                result: 'gameover', score: game.score,
                orbs: game.orbsCollected, gems: game.gemsCollected, stars: game.starsCollected,
                time: Math.floor(game.elapsed), lives: 0,
              })
            } else {
              invincibleUntil = now + INVINCIBLE_MS
              let count = 0
              flashTimer = setInterval(() => {
                player.setEnabled(count % 2 === 0); count++
                if (count > 6) { clearInterval(flashTimer); flashTimer = null; player.setEnabled(true) }
              }, 150)
            }
          }
        })
      }

      updateParticles(scene, particles)
    })

    engine.runRenderLoop(() => scene.render())
    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      if (flashTimer) clearInterval(flashTimer)
      engine.dispose()
    }
  }, [gamePhase])
}
