module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'fr', 'en'],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};