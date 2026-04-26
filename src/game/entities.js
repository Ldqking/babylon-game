// ============================================================
// 3D 实体创建函数
// 场景中的地面、墙壁、玩家、收集物、敌人和粒子均由这里创建
// ============================================================

import {
  MeshBuilder, StandardMaterial, Vector3, Color3, Color4, Animation,
} from 'babylonjs'
import { MAP_SIZE, ORB_COUNT, GEM_COUNT, STAR_COUNT, ENEMY_COUNT } from './constants'
import { nonOverlapPos, animSpin, animBob } from './helpers'

/** 构建地面、网格辅助线和背景色 */
export function buildScene(scene) {
  scene.clearColor = new Color4(0.04, 0.04, 0.08, 1)  // 深蓝黑背景

  const ground = MeshBuilder.CreateGround('ground', {
    width: MAP_SIZE * 2.5, height: MAP_SIZE * 2.5,
  }, scene)
  const groundMat = new StandardMaterial('gMat', scene)
  groundMat.diffuseColor = new Color3(0.08, 0.08, 0.14)
  groundMat.specularColor = Color3.Black()
  ground.material = groundMat

  // 半透明网格辅助线
  const gridMat = new StandardMaterial('gridMat', scene)
  gridMat.diffuseColor = new Color3(0.18, 0.18, 0.28)
  gridMat.alpha = 0.25
  gridMat.specularColor = Color3.Black()
  for (let i = -MAP_SIZE; i <= MAP_SIZE; i += 2) {
    const h = MeshBuilder.CreatePlane('gh', { size: 0.04 }, scene)
    h.position = new Vector3(i, 0.01, 0)
    h.scaling = new Vector3(1, MAP_SIZE * 2.5, 1)
    h.material = gridMat
    const v = MeshBuilder.CreatePlane('gv', { size: 0.04 }, scene)
    v.position = new Vector3(0, 0.01, i)
    v.scaling = new Vector3(1, MAP_SIZE * 2.5, 1)
    v.material = gridMat
  }
}

/** 构建边界装饰：立柱 + 地面光带，不遮挡视线 */
export function buildWalls(scene) {
  const wp = MAP_SIZE + 1

  // ===== 角落立柱（4根） =====
  const pillarMat = new StandardMaterial('pillarMat', scene)
  pillarMat.diffuseColor = new Color3(0.35, 0.15, 0.55)
  pillarMat.emissiveColor = new Color3(0.12, 0.04, 0.22)
  pillarMat.specularColor = Color3.Black()

  const orbMat = new StandardMaterial('orbMat', scene)
  orbMat.diffuseColor = new Color3(0.5, 0.2, 1)
  orbMat.emissiveColor = new Color3(0.4, 0.15, 0.8)
  orbMat.alpha = 0.85
  orbMat.specularColor = Color3.Black()

  const corners = [
    [-wp, -wp], [wp, -wp], [-wp, wp], [wp, wp],
  ]
  corners.forEach(([x, z], i) => {
    // 立柱
    const pillar = MeshBuilder.CreateCylinder(`pillar${i}`, {
      height: 2.5, diameterTop: 0.12, diameterBottom: 0.18,
    }, scene)
    pillar.position = new Vector3(x, 1.25, z)
    pillar.material = pillarMat

    // 顶部发光球
    const top = MeshBuilder.CreateSphere(`pTop${i}`, {
      diameter: 0.2, segments: 8,
    }, scene)
    top.position = new Vector3(x, 2.6, z)
    top.material = orbMat
  })

  // ===== 边中点小型标记（4个） =====
  const midMat = new StandardMaterial('midMat', scene)
  midMat.diffuseColor = new Color3(0.25, 0.1, 0.4)
  midMat.emissiveColor = new Color3(0.08, 0.03, 0.15)
  midMat.specularColor = Color3.Black()

  const mids = [[0, -wp], [0, wp], [-wp, 0], [wp, 0]]
  mids.forEach(([x, z], i) => {
    const m = MeshBuilder.CreateCylinder(`mid${i}`, {
      height: 1.2, diameterTop: 0.06, diameterBottom: 0.1,
    }, scene)
    m.position = new Vector3(x, 0.6, z)
    m.material = midMat
  })

  // ===== 地面发光边界 =====
  const edgeMat = new StandardMaterial('edgeMat', scene)
  edgeMat.diffuseColor = new Color3(0.35, 0.15, 0.6)
  edgeMat.emissiveColor = new Color3(0.15, 0.05, 0.3)
  edgeMat.alpha = 0.25
  edgeMat.specularColor = Color3.Black()

  const halfLen = wp + 0.2
  const edges = [
    { pos: [0, 0.01, -wp], scale: [halfLen * 2, 0.015, 0.04] },
    { pos: [0, 0.01, wp], scale: [halfLen * 2, 0.015, 0.04] },
    { pos: [-wp, 0.01, 0], scale: [0.04, 0.015, halfLen * 2] },
    { pos: [wp, 0.01, 0], scale: [0.04, 0.015, halfLen * 2] },
  ]
  edges.forEach((e, i) => {
    const strip = MeshBuilder.CreateBox(`edge${i}`, { size: 1 }, scene)
    strip.position = new Vector3(e.pos[0], e.pos[1], e.pos[2])
    strip.scaling = new Vector3(e.scale[0], e.scale[1], e.scale[2])
    strip.material = edgeMat
    strip.isPickable = false
  })
}

/** 创建玩家角色（发光球体 + 底部光环） */
export function createPlayer(scene) {
  const player = MeshBuilder.CreateSphere('player', {
    diameter: 0.7, segments: 16,
  }, scene)
  player.position = new Vector3(0, 0.35, 0)

  const mat = new StandardMaterial('pMat', scene)
  mat.diffuseColor = new Color3(0.15, 0.6, 1)
  mat.emissiveColor = new Color3(0.05, 0.15, 0.3)
  mat.specularColor = new Color3(0.4, 0.7, 1)
  mat.specularPower = 48
  player.material = mat

  const glow = MeshBuilder.CreateTorus('glow', {
    diameter: 0.9, thickness: 0.04,
  }, scene)
  glow.position = new Vector3(0, 0.04, 0)
  glow.rotation.x = Math.PI / 2
  const glowMat = new StandardMaterial('glowMat', scene)
  glowMat.diffuseColor = new Color3(0.15, 0.6, 1)
  glowMat.alpha = 0.35
  glowMat.specularColor = Color3.Black()
  glow.material = glowMat
  glow.parent = player

  return player
}

/** 生成普通收集物：蓝色小球 */
export function createOrbs(scene, positions) {
  const orbs = []
  for (let i = 0; i < ORB_COUNT; i++) {
    const pos = nonOverlapPos(positions)
    positions.push(pos)
    const orb = MeshBuilder.CreateSphere(`orb${i}`, {
      diameter: 0.4, segments: 12,
    }, scene)
    orb.position = pos
    const mat = new StandardMaterial(`oMat${i}`, scene)
    mat.diffuseColor = new Color3(0.2, 0.5, 1)
    mat.emissiveColor = new Color3(0, 0.2, 0.6)
    mat.specularColor = Color3.Black()
    orb.material = mat
    animSpin(scene, orb, 0.8)
    animBob(scene, orb, pos.y, 0.2, 0.6)
    orbs.push(orb)
  }
  return orbs
}

/** 生成中级收集物：绿色水晶（锥体） */
export function createGems(scene, positions) {
  const gems = []
  for (let i = 0; i < GEM_COUNT; i++) {
    const pos = nonOverlapPos(positions)
    positions.push(pos)

    // 水晶主体：用圆柱体顶端收拢成尖
    const body = MeshBuilder.CreateCylinder(`gemBody${i}`, {
      height: 0.5, diameterTop: 0.02, diameterBottom: 0.35,
      tessellation: 8,
    }, scene)
    body.position = pos.clone()
    body.position.y = 0.25

    // 材质：绿色发光晶体
    const mat = new StandardMaterial(`gMat${i}`, scene)
    mat.diffuseColor = new Color3(0.1, 0.9, 0.4)
    mat.emissiveColor = new Color3(0, 0.35, 0.15)
    mat.specularColor = new Color3(0.3, 1, 0.5)
    mat.specularPower = 64
    body.material = mat

    // 旋转动画（绕 Y 轴）
    animSpin(scene, body, 1.0)

    // 自定义浮动：比小球跳得更高
    const bob = new Animation('gb', 'position.y', 60,
      Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
    bob.setKeys([
      { frame: 0, value: 0.25 },
      { frame: 50, value: 0.6 },
      { frame: 100, value: 0.25 },
    ])
    body.animations.push(bob)
    scene.beginAnimation(body, Math.random() * 100, 100, true)

    gems.push(body)
  }
  return gems
}

/** 生成稀有收集物：彩色几何结 */
export function createStars(scene, positions) {
  const colors = [
    new Color3(1, 0.8, 0),     // 金色
    new Color3(1, 0.4, 0.8),   // 粉紫
    new Color3(0.2, 1, 0.6),   // 青绿
  ]
  const stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const pos = nonOverlapPos(positions)
    positions.push(pos)
    const s = MeshBuilder.CreateTorusKnot(`star${i}`, {
      radius: 0.3, tube: 0.08, radialSegments: 24, tubularSegments: 12,
    }, scene)
    s.position = pos
    const c = colors[i % colors.length]
    const mat = new StandardMaterial(`sMat${i}`, scene)
    mat.diffuseColor = c
    mat.emissiveColor = c.scale(0.3)
    mat.specularColor = c
    mat.specularPower = 24
    s.material = mat
    animSpin(scene, s, 1.5)
    animBob(scene, s, pos.y, 0.35, 1.2)
    stars.push(s)
  }
  return stars
}

/**
 * 生成追击敌人
 * 造型：20面体为主体，带旋转圆环，看起来像无人机
 * @param {number} count - 敌人数量
 */
export function createEnemies(scene, count = ENEMY_COUNT) {
  const palette = [
    new Color3(1, 0.15, 0.15),   // 红
    new Color3(1, 0.4, 0),       // 橙
    new Color3(0.9, 0, 0.6),     // 紫红
    new Color3(0.8, 0.2, 1),     // 紫
    new Color3(0, 0.9, 0.8),     // 青
    new Color3(1, 0.8, 0),       // 金
  ]
  // 在地图范围内用环形生成出生点
  const spawns = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const r = 3 + Math.random() * 2
    return new Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r)
  })

  return Array.from({ length: count }, (_, i) => {
    const group = []
    const pos = spawns[i]
    const color = palette[i % palette.length]

    // 主体：二十面体
    const body = MeshBuilder.CreatePolyhedron(`enemyBody${i}`, {
      type: 3, size: 0.35,
    }, scene)
    body.position = pos.clone()
    body.position.y = 0.3
    const bMat = new StandardMaterial(`ebMat${i}`, scene)
    bMat.diffuseColor = color
    bMat.emissiveColor = color.scale(0.25)
    bMat.specularColor = color
    bMat.specularPower = 32
    body.material = bMat
    group.push(body)

    // 环绕旋转环
    const ring = MeshBuilder.CreateTorus(`enemyRing${i}`, {
      diameter: 0.7, thickness: 0.03, tessellation: 24,
    }, scene)
    ring.position = pos.clone()
    ring.position.y = 0.3
    ring.rotation.x = Math.PI / 3
    const rMat = new StandardMaterial(`erMat${i}`, scene)
    rMat.diffuseColor = color
    rMat.emissiveColor = color.scale(0.5)
    rMat.alpha = 0.6
    rMat.specularColor = Color3.Black()
    ring.material = rMat
    group.push(ring)

    // 环的自旋动画
    const ringSpin = new Animation('rs', 'rotation.y', 60,
      Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
    ringSpin.setKeys([
      { frame: 0, value: 0 },
      { frame: 90, value: Math.PI * 2 },
    ])
    ring.animations.push(ringSpin)
    scene.beginAnimation(ring, 0, 90, true)

    // 主体自旋（缓慢）
    const bodySpin = new Animation('bs', 'rotation.y', 60,
      Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
    bodySpin.setKeys([
      { frame: 0, value: 0 },
      { frame: 120, value: Math.PI * 2 },
    ])
    body.animations.push(bodySpin)
    scene.beginAnimation(body, 0, 120, true)

    // 呼吸脉冲
    const pulse = new Animation('bp', 'scaling', 60,
      Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE)
    pulse.setKeys([
      { frame: 0, value: new Vector3(1, 1, 1) },
      { frame: 30, value: new Vector3(1.1, 0.9, 1.1) },
      { frame: 60, value: new Vector3(1, 1, 1) },
    ])
    body.animations.push(pulse)
    scene.beginAnimation(body, Math.random() * 60, 60, true)

    return {
      meshes: group,   // 敌人由多个 mesh 组成
      root: body,      // 以 body 为位置参考
      color,
      bMat,            // 主体材质（击中闪烁用）
      alive: true,     // 存活状态
      health: 3,       // 剩余生命，归零则消灭
      maxHealth: 3,
      flashFrames: 0,  // 击中闪白倒计时（帧）
      respawnTimer: 0,
    }
  })
}

/** 创建激光发射物（发光球体） */
export function createLaser(scene, position, direction) {
  const bolt = MeshBuilder.CreateSphere('laser', {
    diameter: 0.2, segments: 8,
  }, scene)
  bolt.position = position.clone()
  bolt.position.y = 0.3

  // 发光材质：白炽核心 + 青色光晕
  const mat = new StandardMaterial('laserMat', scene)
  mat.diffuseColor = new Color3(1, 1, 1)
  mat.emissiveColor = new Color3(0.2, 1, 1)
  mat.specularColor = Color3.Black()
  bolt.material = mat

  // 外围光晕（半透明大球）
  const glow = MeshBuilder.CreateSphere('laserGlow', {
    diameter: 0.35, segments: 8,
  }, scene)
  glow.position = bolt.position.clone()
  const gMat = new StandardMaterial('lgMat', scene)
  gMat.diffuseColor = new Color3(0, 0.6, 0.8)
  gMat.emissiveColor = new Color3(0, 0.4, 0.6)
  gMat.alpha = 0.35
  gMat.specularColor = Color3.Black()
  glow.material = gMat

  return {
    meshes: [bolt, glow],
    dir: direction.clone(),
    travelled: 0,
  }
}
export function spawnParticles(scene, particles, position, color, count = 15) {
  for (let i = 0; i < count; i++) {
    const size = 0.04 + Math.random() * 0.06
    const p = MeshBuilder.CreateBox('p', { size }, scene)
    p.position = position.clone()
    const m = new StandardMaterial('pm', scene)
    m.diffuseColor = color
    m.emissiveColor = color
    p.material = m
    particles.push({
      mesh: p,
      vel: new Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 3,
        (Math.random() - 0.5) * 3,
      ),
      life: 40 + Math.random() * 20,
    })
  }
}

/** 每帧更新粒子物理 */
export function updateParticles(scene, particles) {
  for (let j = particles.length - 1; j >= 0; j--) {
    const p = particles[j]
    p.mesh.position.addInPlace(p.vel.scale(0.06))
    p.vel.y -= 0.015
    p.vel.x *= 0.98
    p.vel.z *= 0.98
    p.life--
    if (p.life <= 0) {
      scene.removeMesh(p.mesh)
      particles.splice(j, 1)
    }
  }
}
