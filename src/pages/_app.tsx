import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { initWebVitals, analytics } from '@/utils/monitoring';
import { initServiceWorker } from '@/utils/serviceWorker';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 初始化Web Vitals监控
    initWebVitals();

    // 初始化Service Worker
    initServiceWorker();

    // 追踪初始页面浏览
    analytics.pageView(router.asPath);

    // 监听路由变化
    const handleRouteChange = (url: string) => {
      analytics.pageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default appWithTranslation(App);