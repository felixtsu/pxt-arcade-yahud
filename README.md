# Custom HUD (yahud)

在 MakeCode Arcade 默认 HUD（分数、生命等）之上，添加自定义角标显示：图标 + 数字。

## 用作扩展

此仓库可以作为 **插件** 添加到 MakeCode Arcade 中。

* 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
* 点击 **新项目**
* 点击齿轮图标菜单下的 **扩展**
* 搜索并导入：`https://github.com/felixtsu/pxt-arcade-yahud`

## 示例项目

* **在线试玩**：https://makecode.com/_4R2aY30EMR2z
* **查看/编辑代码**：https://arcade.makecode.com/#pub:github:felixtsu/pxt-arcade-yahud-demo
* **插件库介绍页**：https://works.cubicbird.com/plugins-library/

## 积木块

导入扩展后，工具箱会出现 **自定义 HUD** 分类（通过 `yahud.ts` 顶部的 `//% block="自定义 HUD"` 注释注册）。

### 创建

* **在 [角落] 创建 HUD 槽位** — 角落可选：左上角 / 右上角 / 左下角 / 右下角

### 数值

* **设置 [槽位] 数值为** — 设置显示的数字
* **将 [槽位] 数值改变** — 增减数字

### 显示

* **设置 [槽位] 图标为** — 设置图标图片
* **设置 [槽位] 可见** — 显示或隐藏
* **设置 [槽位] 边距为** — 距离屏幕边缘的像素间距
* **设置 [槽位] 偏移 x y** — 微调位置
* **设置 [槽位] 颜色** — 设置背景、边框、文字颜色
* **销毁 [槽位]** — 销毁该 HUD 槽位

## 示例

```blocks
let coins = yahud.create(YahudCorner.BottomLeft)
coins.setIcon(img`
    . . e e e . .
    . e e e e e .
    e e e e e e e
    e e e e e e e
    . e e e e e .
    . . e e e . .
`)
coins.setValue(0)

let ammo = yahud.create(YahudCorner.BottomRight)
ammo.setIcon(img`
    . . . 1 . . .
    . . 1 1 1 . .
    . 1 1 1 1 1 .
    . . 1 1 1 . .
    . . . 1 . . .
`)
ammo.setValue(10)
```

## 项目结构

与 [arcade-drawing-utils](https://github.com/riknoll/arcade-drawing-utils) 等成熟插件一致：

* `main.ts` — 仅保留空的 namespace 声明，不含任何游戏逻辑
* `yahud.ts` — 插件核心实现与所有 blocks 注释
* `test.ts` — 本地测试用，作为插件导入时不会编译

## 编辑此项目

* 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
* 点击 **导入** → **导入 URL**
* 粘贴本仓库地址并导入

#### 元数据（用于搜索、渲染）

* for PXT/arcade
