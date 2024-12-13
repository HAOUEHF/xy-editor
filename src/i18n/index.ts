// 导入i18next库
import i18next from 'i18next'
// 导入中文翻译文件
import zh from './locales/zh'
// 导入英文翻译文件
import en from './locales/en'

// 初始化i18next，设置语言为中文，备用语言为中文，资源为中文和英文翻译文件
i18next.init({
  lng: 'zh',
  fallbackLng: 'zh',
  resources: {
    zh: {
      translation: zh
    },
    en: {
      translation: en
    }
  }
})

// 将i18next的t方法绑定到$t变量上，方便使用
export const $t = i18next.t.bind(i18next)
// 导出i18next
export default i18next
