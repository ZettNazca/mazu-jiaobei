# 妈祖灵筊

纯 HTML/CSS/JavaScript 小游戏，无需安装依赖。妈祖神像、双手托筊、抛掷动画，支持圣筊/笑筊/阴筊结果、可选音效和手机体感。

## 本地运行

在仓库根目录执行：

```sh
python3 -m http.server 8080 --directory mazu-game/dist
```

打开 http://localhost:8080 。手机体感需要 HTTPS、支持传感器的设备和用户授权；桌面可点击掷筊。

## GitHub Pages 部署

1. 将本仓库（包括根目录 `.github/workflows/deploy-pages.yml`）推送到 GitHub 的 `main` 分支。
2. GitHub 仓库 → Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
3. Actions → Deploy Mazu game to GitHub Pages → Run workflow，或再次推送 `main`。
4. 部署完成后，在 Pages 设置或工作流详情中打开站点链接。

工作流上传 `mazu-game/dist`，使用相对资源路径，兼容 `用户名.github.io/仓库名/`。如果使用其他主分支名，请修改工作流中的 `branches`。

每片筊杯独立随机选取平/凸两面：圣筊约 50%，笑筊/阴筊各约 25%。仅作民俗娱乐体验。

## 美术

内置图像生成工具制作 `dist/assets/temple.png`。提示词：竖屏写实妈祖庙，正前方红金袍妈祖神像、凤凰冠、烛光和香烟，石板地面，前景两只空手掌向上、黑色袖口，暖金和深红色，无文字、无界面、无筊杯。
