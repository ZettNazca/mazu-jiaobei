# 灵筊 · 一念虔诚

纯 HTML/CSS/JavaScript 小游戏，无需安装依赖。六个神明场景、双手托筊、真实红木筊杯素材与抛掷动画，支持圣筊/笑筊/阴筊结果、可选音效和手机体感。

[在线体验](https://zettnazca.github.io/mazu-jiaobei/) · [源码仓库](https://github.com/ZettNazca/mazu-jiaobei)

## 功能

- 神明场景：妈祖、文昌帝君、观音、关帝、财神、月老。
- 记录模式保存当前神明、问题与结果；体验模式不新增记录。
- 本机累计三种结果计数，历史记录保留最近 100 次，可导出 JSON。
- 支持填写最多 120 字的问题、确认后重置记录、刷新恢复神明与模式。
- 浏览器禁用本地存储时，记录仍可在本次打开期间使用。
- 纯前端运行，记录不会同步到其他设备。

## 本地运行

在仓库根目录执行：

```sh
python3 -m http.server 8080 --directory mazu-game/dist
```

打开 http://localhost:8080 。手机体感需要 HTTPS、支持传感器的设备和用户授权；桌面可点击掷筊。

## 功能检查

```sh
node mazu-game/tests/game-state.cjs
```

覆盖四种落面组合、抛掷锁定、记录模式、持久化、场景加载和失败恢复、清空确认、历史上限、输入转义与存储异常。页面布局及真机体感需在浏览器与手机中检查。

## GitHub Pages 部署

1. 将本仓库（包括根目录 `.github/workflows/deploy-pages.yml`）推送到 GitHub 的 `main` 分支。
2. GitHub 仓库 → Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
3. Actions → Deploy Mazu game to GitHub Pages → Run workflow，或再次推送 `main`。
4. 部署完成后，在 Pages 设置或工作流详情中打开站点链接。

工作流上传 `mazu-game/dist`，使用相对资源路径，兼容 `用户名.github.io/仓库名/`。如果使用其他主分支名，请修改工作流中的 `branches`。

每片筊杯独立随机选取平/凸两面：圣筊约 50%，笑筊/阴筊各约 25%。仅作民俗娱乐体验。

## 美术

内置图像生成工具制作 `dist/assets/temple.png`。提示词：竖屏写实妈祖庙，正前方红金袍妈祖神像、凤凰冠、烛光和香烟，石板地面，前景两只空手掌向上、黑色袖口，暖金和深红色，无文字、无界面、无筊杯。


新增筊杯素材位于 `dist/assets/jiaobei-flat.webp` 与 `dist/assets/jiaobei-convex.webp`，五个新增神明画面位于 `dist/assets/{wenchang,guanyin,guandi,caishen,yuelao}.webp`。均使用内置图像生成工具制作，完整提示词保存在 [art-assets.json](art-assets.json)。神像画面沿用同一庙堂、双手与光线，修改中央神像；筊杯采用参考图中的厚实半月形、红木纹理、柔和反光与真实透明背景。
