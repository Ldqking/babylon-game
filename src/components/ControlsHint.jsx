// ============================================================
// ControlsHint — 操作提示弹窗（科技风）
// ============================================================

import { useI18n } from '../i18n/index.jsx'

export default function ControlsHint({ visible, onClose }) {
  const { t } = useI18n()
  if (!visible) return null

  const keys = [
    { keys: ['W', 'A', 'S', 'D'], desc: t('controls.move') },
    { keys: ['Mouse'], desc: t('controls.aim') },
    { keys: ['Space'], desc: t('controls.shoot') },
  ]

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* 磨砂背景 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      {/* 扫描线装饰 */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.3) 2px, rgba(0,200,255,0.3) 3px)' }}
      />

      <div
        className="relative w-full max-w-sm mx-4
                   bg-[#0a121f]/80 backdrop-blur-lg
                   border border-[#1a3050]/60 rounded-xl p-6
                   shadow-[0_0_60px_rgba(0,100,200,0.15),0_0_120px_rgba(0,50,100,0.08),inset_0_0_60px_rgba(0,150,255,0.03)]"
      >
        {/* 顶部发光横线 */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* 标题栏 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,200,255,0.7)]" />
            <span className="w-0.5 h-4 bg-cyan-400/40 rounded-full" />
          </div>
          <h2 className="text-cyan-300 text-xs font-semibold tracking-[0.25em] uppercase flex-1">
            {t('controls.title')}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>

        {/* 按键绑定列表 */}
        <div className="space-y-3 mb-6">
          {keys.map(({ keys: kList, desc }) => (
            <div key={desc} className="flex items-center gap-3 bg-[#050a14]/50 rounded-lg px-3 py-2.5 border border-[#1a3050]/30">
              <div className="flex gap-1 w-28 shrink-0">
                {kList.map(k => (
                  <span
                    key={k}
                    className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5
                               bg-[#0a1628] border border-cyan-500/30 rounded text-cyan-400 text-[11px]
                               font-bold shadow-[0_0_8px_rgba(0,150,255,0.12)]"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <span className="text-slate-400 text-xs tracking-wide">{desc}</span>
            </div>
          ))}
        </div>

        {/* 收集物图例 */}
        <div className="bg-[#050a14]/60 border border-[#1a3050]/30 rounded-lg p-3.5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-0.5 h-3 bg-cyan-500/40 rounded-full" />
            <span className="text-slate-500 text-[10px] tracking-[0.2em]">{t('controls.collectTitle')}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <LegendItem color="bg-blue-400" glow="0,100,255" label={t('controls.orbs')} />
            <LegendItem color="bg-green-400" glow="0,200,100" label={t('controls.gems')} />
            <LegendItem color="bg-yellow-400" glow="255,200,0" label={t('controls.stars')} />
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1a3050]/20">
            <p className="text-slate-600 text-[10px] leading-relaxed tracking-wide">{t('controls.tip')}</p>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="group relative w-full py-2.5 rounded-lg text-sm font-semibold tracking-[0.2em]
                     border border-cyan-500/30 bg-gradient-to-b from-cyan-500/15 to-cyan-500/5
                     text-cyan-300 cursor-pointer overflow-hidden
                     transition-all duration-200
                     hover:shadow-[0_0_25px_rgba(0,200,255,0.2)] hover:border-cyan-500/50"
        >
          <span className="relative z-10">{t('controls.gotIt')}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>

        {/* 底部发光横线 */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>
    </div>
  )
}

function LegendItem({ color, glow, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} style={{ boxShadow: `0 0 8px rgba(${glow},0.5)` }} />
      <span className="text-slate-400 text-[10px] tracking-wide">{label}</span>
    </div>
  )
}
