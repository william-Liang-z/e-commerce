import zh from './zh'
import en from './en'

// 多语言映射配置
const translations: Record<string, Record<string, string>> = {
  zh,
  en,
}

// 当前语言，可以根据需求从 localStorage 或其他地方获取
let currentLocale = 'zh'

export function setLocale(locale: string) {
  currentLocale = locale
}

export function getLocale() {
  return currentLocale
}

/**
 * 翻译函数
 * @param key 翻译键
 * @param params 替换参数
 * @returns 翻译后的文本
 */
export function ts(key: string, params?: Record<string, string | number>): string {
  const localeTranslations = translations[currentLocale] || translations.zh
  let text = localeTranslations[key] || key

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value))
    })
  }

  return text
}

export default translations
