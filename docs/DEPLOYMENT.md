# 部署指南 (Deployment Guide)

## 概述 (Overview)

本文档描述了如何将让·普鲁维研究网站部署到Vercel平台。

This document describes how to deploy the Jean Prouvé Research Website to Vercel.

## 前置要求 (Prerequisites)

1. **Node.js 18+** - 确保安装了Node.js 18或更高版本
2. **Vercel账户** - 在 [vercel.com](https://vercel.com) 注册账户
3. **Vercel CLI** - 安装Vercel命令行工具
   ```bash
   npm install -g vercel
   ```

## 快速部署 (Quick Deployment)

### 方法1：使用部署脚本 (Using Deployment Script)

```bash
# 预览部署 (Preview deployment)
npm run deploy

# 生产部署 (Production deployment)
npm run deploy:prod
```

### 方法2：手动部署 (Manual Deployment)

```bash
# 1. 安装依赖 (Install dependencies)
npm ci

# 2. 运行测试 (Run tests)
npm test

# 3. 构建项目 (Build project)
npm run build

# 4. 部署到Vercel (Deploy to Vercel)
vercel --prod
```

## 环境变量配置 (Environment Variables)

### 必需的环境变量 (Required Environment Variables)

在Vercel仪表板中设置以下环境变量：

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 可选的环境变量 (Optional Environment Variables)

```bash
# 分析和监控 (Analytics and Monitoring)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=prj_xxxxxxxxxx

# 性能监控 (Performance Monitoring)
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_WEB_VITALS_ATTRIBUTION=true

# 国际化 (Internationalization)
NEXT_PUBLIC_DEFAULT_LOCALE=zh
NEXT_PUBLIC_SUPPORTED_LOCALES=zh,fr,en
```

## 自动部署 (Automated Deployment)

项目配置了GitHub Actions自动部署：

- **Pull Request**: 自动创建预览部署
- **Main分支推送**: 自动部署到生产环境

### 设置GitHub Secrets

在GitHub仓库设置中添加以下secrets：

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 域名配置 (Domain Configuration)

### 1. 添加自定义域名 (Add Custom Domain)

```bash
vercel domains add your-domain.com
```

### 2. 配置DNS记录 (Configure DNS Records)

将域名的DNS记录指向Vercel：

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3. SSL证书 (SSL Certificate)

Vercel自动为所有域名提供免费的SSL证书。

## 性能优化 (Performance Optimization)

### 1. 图像优化 (Image Optimization)

- 使用Next.js Image组件自动优化
- 支持WebP和AVIF格式
- 自动响应式图像

### 2. 缓存策略 (Caching Strategy)

```javascript
// 静态资源缓存1年
/_next/static/* -> Cache-Control: public, max-age=31536000, immutable

// 图像缓存1年
/images/* -> Cache-Control: public, max-age=31536000, immutable

// HTML页面缓存1天
/*.html -> Cache-Control: public, max-age=86400
```

### 3. 代码分割 (Code Splitting)

- 页面级别自动代码分割
- 动态导入优化
- 第三方库分离

## 监控和分析 (Monitoring and Analytics)

### 1. Vercel Analytics

```bash
# 启用Vercel Analytics
vercel env add NEXT_PUBLIC_VERCEL_ANALYTICS_ID production
```

### 2. 性能监控 (Performance Monitoring)

- Core Web Vitals监控
- 实时性能指标
- 错误追踪

### 3. 日志查看 (Log Viewing)

```bash
# 查看部署日志
vercel logs

# 查看函数日志
vercel logs --follow
```

## 故障排除 (Troubleshooting)

### 常见问题 (Common Issues)

1. **构建失败 (Build Failure)**
   ```bash
   # 检查本地构建
   npm run build
   
   # 查看详细错误
   vercel logs
   ```

2. **环境变量问题 (Environment Variable Issues)**
   ```bash
   # 查看环境变量
   vercel env ls
   
   # 添加环境变量
   vercel env add VARIABLE_NAME
   ```

3. **域名配置问题 (Domain Configuration Issues)**
   ```bash
   # 检查域名状态
   vercel domains ls
   
   # 验证域名
   vercel domains verify your-domain.com
   ```

## 回滚部署 (Rollback Deployment)

```bash
# 查看部署历史
vercel ls

# 回滚到特定部署
vercel rollback [deployment-url]
```

## 安全配置 (Security Configuration)

### 1. 安全头部 (Security Headers)

项目已配置以下安全头部：

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 2. 内容安全策略 (Content Security Policy)

```javascript
// 在next.config.js中配置CSP
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
```

## 支持和帮助 (Support and Help)

- [Vercel文档](https://vercel.com/docs)
- [Next.js部署指南](https://nextjs.org/docs/deployment)
- [项目GitHub仓库](https://github.com/your-username/jean-prouve-website)

## 更新日志 (Changelog)

- **v1.0.0** - 初始部署配置
- **v1.1.0** - 添加自动部署和监控
- **v1.2.0** - 优化性能和缓存策略