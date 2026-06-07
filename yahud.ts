//% icon="\uf2bb" color="#5C4069" weight=75 blockGap=8 block="自定义 HUD"
//% groups='["创建", "数值", "显示"]'
namespace 自定义HUD { }

enum YahudCorner {
    //% block="左上角"
    TopLeft = 0,
    //% block="右上角"
    TopRight = 1,
    //% block="左下角"
    BottomLeft = 2,
    //% block="右下角"
    BottomRight = 3
}

class HudSlot {
    protected _icon: Image;
    protected _value: number;
    protected _visible: boolean;
    protected _padding: number;
    protected _offsetX: number;
    protected _offsetY: number;
    protected _bgColor: number;
    protected _borderColor: number;
    protected _fontColor: number;
    protected _destroyed: boolean;

    constructor(public corner: YahudCorner) {
        this._icon = null;
        this._value = 0;
        this._visible = true;
        this._padding = 2;
        this._offsetX = 0;
        this._offsetY = 0;
        this._bgColor = screen.isMono ? 0 : 2;
        this._borderColor = screen.isMono ? 1 : 3;
        this._fontColor = screen.isMono ? 1 : 3;
        this._destroyed = false;
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示" blockSetVariable="hudSlot"
    //% blockCombine block="图标" callInDebugger
    get icon(): Image {
        return this._icon;
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示" blockSetVariable="hudSlot"
    //% blockCombine block="数值" callInDebugger
    get value(): number {
        return this._value;
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示" blockSetVariable="hudSlot"
    //% blockCombine block="可见" callInDebugger
    get visible(): boolean {
        return this._visible && !this._destroyed;
    }

    setIcon(icon: Image) {
        this._icon = icon;
    }

    setValue(value: number) {
        this._value = value | 0;
    }

    changeValue(delta: number) {
        this._value = (this._value + (delta | 0)) | 0;
    }

    setVisible(on: boolean) {
        this._visible = on;
    }

    setPadding(padding: number) {
        this._padding = Math.max(0, padding | 0);
    }

    setOffset(x: number, y: number) {
        this._offsetX = x | 0;
        this._offsetY = y | 0;
    }

    setColors(bg: number, border: number, font: number) {
        this._bgColor = bg;
        this._borderColor = border;
        this._fontColor = font;
    }

    destroy() {
        if (this._destroyed) return;
        this._destroyed = true;
        yahud._removeSlot(this);
    }

    draw() {
        if (!this._visible || this._destroyed) return;

        const font = image.font5;
        const text = "" + this._value;
        const textWidth = text.length * font.charWidth;
        const iconWidth = this._icon ? this._icon.width : 0;
        const iconHeight = this._icon ? this._icon.height : 0;
        const gap = this._icon ? 1 : 0;
        const innerWidth = iconWidth + gap + textWidth + 2;
        const innerHeight = Math.max(iconHeight, font.charHeight) + 2;
        const width = innerWidth + 2;
        const height = innerHeight + 2;

        let x = 0;
        let y = 0;

        switch (this.corner) {
            case YahudCorner.TopLeft:
                x = this._padding;
                y = this._padding;
                break;
            case YahudCorner.TopRight:
                x = screen.width - width - this._padding;
                y = this._padding;
                break;
            case YahudCorner.BottomLeft:
                x = this._padding;
                y = screen.height - height - this._padding;
                break;
            case YahudCorner.BottomRight:
                x = screen.width - width - this._padding;
                y = screen.height - height - this._padding;
                break;
        }

        x += this._offsetX;
        y += this._offsetY;

        screen.fillRect(x, y, width, height, this._borderColor);
        screen.fillRect(x + 1, y + 1, width - 2, height - 2, this._bgColor);

        const contentY = y + 1 + ((innerHeight - Math.max(iconHeight, font.charHeight)) >> 1);

        if (this._icon) {
            screen.drawTransparentImage(this._icon, x + 2, contentY);
        }

        const textX = x + 2 + iconWidth + gap;
        const textY = contentY + ((Math.max(iconHeight, font.charHeight) - font.charHeight) >> 1);
        screen.print(text, textX, textY, this._fontColor, font);
    }
}

namespace yahud {
    const SLOTS_KEY = "YAHUD_SLOTS";
    const RENDERABLE_KEY = "YAHUD_RENDERABLE";

    //% block
    //% blockNamespace=自定义HUD
    //% group="创建"
    //% blockId=yahud_create
    //% block="在 $corner 创建 HUD 槽位"
    //% blockSetVariable="hudSlot"
    //% corner.defl=YahudCorner.BottomLeft
    //% weight=100
    export function create(corner: YahudCorner): HudSlot {
        const slot = new HudSlot(corner);
        _addSlot(slot);
        return slot;
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_setIcon
    //% block="设置 $hudSlot 图标为 $icon=screen_image_picker"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% weight=90
    export function setIcon(hudSlot: HudSlot, icon: Image) {
        hudSlot.setIcon(icon);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="数值"
    //% blockId=yahud_setValue
    //% block="设置 $hudSlot 数值为 $value"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% value.defl=0
    //% weight=100
    export function setValue(hudSlot: HudSlot, value: number) {
        hudSlot.setValue(value);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="数值"
    //% blockId=yahud_changeValue
    //% block="将 $hudSlot 数值改变 $delta"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% delta.defl=1
    //% weight=99
    export function changeValue(hudSlot: HudSlot, delta: number) {
        hudSlot.changeValue(delta);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_setVisible
    //% block="设置 $hudSlot 可见 $on=toggleOnOff"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% weight=88
    export function setVisible(hudSlot: HudSlot, on: boolean) {
        hudSlot.setVisible(on);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_setPadding
    //% block="设置 $hudSlot 边距为 $padding"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% padding.defl=2
    //% weight=87
    export function setPadding(hudSlot: HudSlot, padding: number) {
        hudSlot.setPadding(padding);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_setOffset
    //% block="设置 $hudSlot 偏移 x $x y $y"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% x.defl=0
    //% y.defl=0
    //% weight=86
    export function setOffset(hudSlot: HudSlot, x: number, y: number) {
        hudSlot.setOffset(x, y);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_setColors
    //% block="设置 $hudSlot 颜色 背景 $bg 边框 $border 文字 $font"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% bg.shadow=colorindexpicker
    //% border.shadow=colorindexpicker
    //% font.shadow=colorindexpicker
    //% weight=85
    export function setColors(hudSlot: HudSlot, bg: number, border: number, font: number) {
        hudSlot.setColors(bg, border, font);
    }

    //% block
    //% blockNamespace=自定义HUD
    //% group="显示"
    //% blockId=yahud_destroy
    //% block="销毁 $hudSlot"
    //% hudSlot.shadow=variables_get(hudSlot)
    //% weight=50
    export function destroy(hudSlot: HudSlot) {
        hudSlot.destroy();
    }

    export function _addSlot(slot: HudSlot) {
        const slots = _getSlots();
        slots.push(slot);
        _ensureRenderer();
    }

    export function _removeSlot(slot: HudSlot) {
        const slots = _getSlots();
        for (let i = slots.length - 1; i >= 0; i--) {
            if (slots[i] === slot) {
                slots.removeAt(i);
            }
        }
    }

    function _getSlots(): HudSlot[] {
        const sc = game.currentScene();
        let slots = sc.data[SLOTS_KEY] as HudSlot[];
        if (!slots) {
            sc.data[SLOTS_KEY] = slots = [];
        }
        return slots;
    }

    function _ensureRenderer() {
        const sc = game.currentScene();
        if (sc.data[RENDERABLE_KEY]) return;

        sc.data[RENDERABLE_KEY] = scene.createRenderable(
            scene.HUD_Z + 1,
            () => {
                const slots = _getSlots();
                for (let i = 0; i < slots.length; i++) {
                    slots[i].draw();
                }
            }
        );
    }
}
