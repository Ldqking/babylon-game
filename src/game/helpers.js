// ============================================================
// 工具函数
// 位置生成、动画辅助等通用逻辑
// ============================================================

import { Vector3, Animation } from 'babylonjs'
import { MAP_SIZE } from './constants'

/**
 * 在地图范围内生成一个随机位置（y=0.5 表示在地面之上）
 */
export function randomPos() {
  return new Vector3(
    (Math.random() - 0.5) * MAP_SIZE * 2,
    0.5,
    (Math.random() - 0.5) * MAP_SIZE * 2,
  )
}

/**
 * 生成不与其他物体重叠的随机位置
 * @param {Vector3[]} existing - 已有的位置列表，新位置会避开它们
 * @param {number} minDist - 最小间距
 */
export function nonOverlapPos(existing, minDist = 1.5) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const p = randomPos()
    if (
      Vector3.Distance(p, Vector3.Zero()) > 1.2 &&           // 避开玩家出生点
      !existing.some(e => Vector3.Distance(p, e) < minDist)  // 避开已有物体
    ) return p
  }
  return randomPos() // 实在找不到就用随机位置兜底
}

/**
 * 给网格添加绕 Y 轴的自旋动画
 * @param {number} speed - 旋转速度倍率，1=标准
 */
export function animSpin(scene, mesh, speed = 1) {
  const a = new Animation(
    's', 'rotation.y', 60,
    Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE,
  )
  a.setKeys([
    { frame: 0, value: 0 },
    { frame: 120 / speed, value: Math.PI * 2 },
  ])
  mesh.animations.push(a)
  scene.beginAnimation(mesh, 0, 120 / speed, true)
}

/**
 * 给网格添加上下浮动动画
 * @param {number} yBase - 基准高度
 * @param {number} amp - 浮动幅度
 * @param {number} speed - 速度倍率
 */
export function animBob(scene, mesh, yBase, amp = 0.3, speed = 1) {
  const a = new Animation(
    'b', 'position.y', 60,
    Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE,
  )
  a.setKeys([
    { frame: 0, value: yBase },
    { frame: 60 / speed, value: yBase + amp },
    { frame: 120 / speed, value: yBase },
  ])
  mesh.animations.push(a)
  scene.beginAnimation(mesh, Math.random() * 120, 120 / speed, true)
}
