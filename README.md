# Artisan Partners 官网复刻

基于 React + Vite + Framer Motion 一比一还原 [Artisan Partners](https://www.artisanpartners.com/) 首页。

## 技术栈

- React 19
- Vite 8
- Framer Motion
- 纯 CSS 响应式布局

## 项目结构

```
src/
  components/
    Header/          # 顶部栏 + 导航
    Hero/            # 主视觉与介绍文案
    Channels/        # 三类投资者入口
    Promo/           # Artisan Canvas 推广区
    Footer/          # 页脚法律信息
    InvestorModal/   # 投资者类型选择弹窗
  data/siteData.js   # 写死的站点数据
public/
  images/            # 从官网下载的图片资源
  fonts/             # 站点字体
scripts/
  download-assets.js # 自动下载图片脚本
```

## 快速开始

```bash
npm install
npm run download-assets
npm run dev
```

浏览器访问 `http://localhost:5173`

## 构建

```bash
npm run build
npm run preview
```

## 说明

- 国家列表按需求仅保留最近 10 条
- 图片可通过 `npm run download-assets` 重新从官网拉取
- 各 section 均为独立 React 组件
- 弹窗、导航、频道列表等交互使用 Framer Motion 动画
