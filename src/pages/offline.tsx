/**
 * 离线页面
 * Offline page for when the user is offline and content is not cached
 */

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useServiceWorker } from '@/utils/serviceWorker';

export default function OfflinePage() {
  const { t } = useTranslation('common');
  const { isOnline } = useServiceWorker();

  return (
    <>
      <Head>
        <title>{t('offline.title')} | Jean Prouvé Research</title>
        <meta name="description" content={t('offline.description')} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          {/* 离线图标 */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v6m0 8v6m8-10h-6m-8 0H2"
              />
            </svg>
          </div>

          {/* 标题和描述 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isOnline ? t('offline.title') : t('offline.noConnection')}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {isOnline 
              ? t('offline.pageNotCached')
              : t('offline.checkConnection')
            }
          </p>

          {/* 网络状态指示器 */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {isOnline ? t('offline.online') : t('offline.offline')}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('offline.retry')}
            </button>
            
            <Link
              href="/"
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              {t('offline.goHome')}
            </Link>
          </div>

          {/* 缓存的页面链接 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t('offline.availablePages')}
            </h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t('navigation.home')}
              </Link>
              <Link
                href="/biography"
                className="block text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t('navigation.biography')}
              </Link>
              <Link
                href="/works"
                className="block text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t('navigation.works')}
              </Link>
              <Link
                href="/scholars"
                className="block text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t('navigation.scholars')}
              </Link>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              {t('offline.tip')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};