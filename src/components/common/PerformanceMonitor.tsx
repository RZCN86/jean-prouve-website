import { useEffect } from 'react';
import { trackWebVitals, monitorMemoryUsage } from '@/utils/performance';

interface PerformanceMonitorProps {
  enableWebVitals?: boolean;
  enableMemoryMonitoring?: boolean;
  memoryCheckInterval?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enableWebVitals = true,
  enableMemoryMonitoring = false,
  memoryCheckInterval = 30000, // 30 seconds
}) => {
  useEffect(() => {
    if (enableWebVitals && process.env.NODE_ENV === 'production') {
      trackWebVitals();
    }
  }, [enableWebVitals]);

  useEffect(() => {
    if (enableMemoryMonitoring && process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        monitorMemoryUsage();
      }, memoryCheckInterval);

      return () => clearInterval(interval);
    }
  }, [enableMemoryMonitoring, memoryCheckInterval]);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;