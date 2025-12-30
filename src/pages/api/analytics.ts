/**
 * 分析数据收集API端点
 * Analytics data collection API endpoint
 */

import { NextApiRequest, NextApiResponse } from 'next';

interface AnalyticsPayload {
  type: 'web_vitals' | 'error' | 'user_event';
  data: any;
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: AnalyticsPayload = req.body;
    
    // 验证payload结构
    if (!payload.type || !payload.data || !payload.timestamp) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // 获取客户端信息
    const clientInfo = {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      timestamp: new Date().toISOString(),
    };

    // 处理不同类型的分析数据
    switch (payload.type) {
      case 'web_vitals':
        await handleWebVitals(payload.data, clientInfo);
        break;
      case 'error':
        await handleError(payload.data, clientInfo);
        break;
      case 'user_event':
        await handleUserEvent(payload.data, clientInfo);
        break;
      default:
        return res.status(400).json({ error: 'Unknown analytics type' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleWebVitals(data: any, clientInfo: any) {
  // 在生产环境中，这里会将数据发送到分析服务
  // 例如：Google Analytics, Vercel Analytics, 或自定义分析服务
  
  console.log('Web Vitals Data:', {
    metric: data.name,
    value: data.value,
    rating: data.rating,
    page: data.page,
    ...clientInfo,
  });

  // 示例：发送到Google Analytics 4
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    await sendToGoogleAnalytics('web_vitals', data, clientInfo);
  }

  // 示例：发送到Vercel Analytics
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
    await sendToVercelAnalytics('web_vitals', data, clientInfo);
  }

  // 示例：存储到数据库或日志服务
  await logToService('web_vitals', data, clientInfo);
}

async function handleError(data: any, clientInfo: any) {
  console.error('Client Error:', {
    message: data.message,
    stack: data.stack,
    url: data.url,
    ...clientInfo,
  });

  // 发送错误到错误追踪服务（如Sentry）
  if (process.env.SENTRY_DSN) {
    await sendToSentry(data, clientInfo);
  }

  // 记录到日志服务
  await logToService('error', data, clientInfo);
}

async function handleUserEvent(data: any, clientInfo: any) {
  console.log('User Event:', {
    event: data.event,
    category: data.category,
    label: data.label,
    page: data.page,
    ...clientInfo,
  });

  // 发送到分析服务
  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    await sendToGoogleAnalytics('event', data, clientInfo);
  }

  // 记录到日志服务
  await logToService('user_event', data, clientInfo);
}

async function sendToGoogleAnalytics(type: string, data: any, clientInfo: any) {
  // Google Analytics 4 Measurement Protocol
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const GA_API_SECRET = process.env.GA_API_SECRET;

  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    return;
  }

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: data.sessionId || 'anonymous',
          events: [{
            name: type === 'web_vitals' ? 'web_vitals' : data.event,
            params: {
              ...data,
              client_info: clientInfo,
            },
          }],
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send to Google Analytics:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending to Google Analytics:', error);
  }
}

async function sendToVercelAnalytics(type: string, data: any, clientInfo: any) {
  // Vercel Analytics API集成
  const VERCEL_ANALYTICS_ID = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID;

  if (!VERCEL_ANALYTICS_ID) {
    return;
  }

  try {
    // 这里实现Vercel Analytics的数据发送逻辑
    console.log('Sending to Vercel Analytics:', { type, data, clientInfo });
  } catch (error) {
    console.error('Error sending to Vercel Analytics:', error);
  }
}

async function sendToSentry(data: any, clientInfo: any) {
  // Sentry错误追踪集成
  const SENTRY_DSN = process.env.SENTRY_DSN;

  if (!SENTRY_DSN) {
    return;
  }

  try {
    // 这里实现Sentry的错误发送逻辑
    console.log('Sending to Sentry:', { data, clientInfo });
  } catch (error) {
    console.error('Error sending to Sentry:', error);
  }
}

async function logToService(type: string, data: any, clientInfo: any) {
  // 记录到日志服务或数据库
  const logEntry = {
    type,
    data,
    clientInfo,
    timestamp: new Date().toISOString(),
  };

  // 在生产环境中，这里会将日志发送到日志服务
  // 例如：CloudWatch, Datadog, LogRocket等
  console.log('Analytics Log:', logEntry);

  // 示例：写入到文件或数据库
  // await writeToDatabase(logEntry);
  // await writeToLogFile(logEntry);
}