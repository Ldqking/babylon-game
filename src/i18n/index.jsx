// ============================================================
// 国际化上下文（i18n）
// 提供语言切换能力和 t() 翻译函数
// 默认中文，支持中英文切换
// ============================================================

import { createContext, useContext, useState, useCallback } from 'react'
import zh from './zh'
import en from './en'

const LOCALES = { zh, en }

const I18nContext = createContext()

/**
 * i18n Provider — 包裹在应用根组件外部
 * 提供 { t, locale, toggleLang } 给所有子组件
 */
export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('zh')

  const toggleLang = useCallback(() => {
    setLocale(prev => (prev === 'zh' ? 'en' : 'zh'))
  }, [])

  // t() 函数：通过点号路径获取翻译文本，如 t('hud.score')
  function t(path) {
    const keys = path.split('.')
    let result = LOCALES[locale]
    for (const key of keys) {
      result = result?.[key]
    }
    return result ?? path
  }

  return (
    <I18nContext.Provider value={{ t, locale, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

/** 在组件中获取 i18n 工具 */
export function useI18n() {
  return useContext(I18nContext)
}
