//% icon="\uf2bb" color="#5C4069" weight=75 blockGap=12 block="自定义 HUD"
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

//% blockNamespace=自定义HUD
//% blockGap=8
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

    //% group="数值" blockSetVariable="hudSlot"
    //% blockCombine block="数值" callInDebugger
    get value(): number {
        return this._value;
    }

    //% group="显示" blockSetVariable="hudSlot"
    //% blockCombine block="可见" callInDebugger
    get visible(): boolean {
        return this._visible && !this._destroyed;
    }

    //% block="设置 $this(hudSlot) 图标为 $icon=screen_image_picker"
    //% blockId=yahud_setIcon
    //% group="显示"
    //% weight=80
    //% blockGap=8
    setIcon(icon: Image) {
        this._icon = icon;
    }

    //% block="设置 $this(hudSlot) 数值为 $value"
    //% blockId=yahud_setValue
    //% value.defl=0
    //% group="数值"
    //% weight=90
    setValue(value: number) {
        this._value = value | 0;
    }

    //% block="将 $this(hudSlot) 数值改变 $delta"
    //% blockId=yahud_changeValue
    //% delta.defl=1
    //% group="数值"
    //% weight=89
    //% blockGap=8
    changeValue(delta: number) {
        this._value = (this._value + (delta | 0)) | 0;
    }

    //% block="设置 $this(hudSlot) 可见 $on=toggleOnOff"
    //% blockId=yahud_setVisible
    //% group="显示"
    //% weight=70
    setVisible(on: boolean) {
        this._visible = on;
    }

    //% block="设置 $this(hudSlot) 边距为 $padding"
    //% blockId=yahud_setPadding
    //% padding.defl=2
    //% group="显示"
    //% weight=69
    setPadding(padding: number) {
        this._padding = Math.max(0, padding | 0);
    }

    //% block="设置 $this(hudSlot) 偏移||x $x y $y"
    //% blockId=yahud_setOffset
    //% x.defl=0
    //% y.defl=0
    //% group="显示"
    //% weight=68
    setOffset(x: number, y: number) {
        this._offsetX = x | 0;
        this._offsetY = y | 0;
    }

    //% block="设置 $this(hudSlot) 颜色||背景 $bg 边框 $border 文字 $font"
    //% blockId=yahud_setColors
    //% bg.shadow=colorindexpicker
    //% border.shadow=colorindexpicker
    //% font.shadow=colorindexpicker
    //% group="显示"
    //% weight=67
    setColors(bg: number, border: number, font: number) {
        this._bgColor = bg;
        this._borderColor = border;
        this._fontColor = font;
    }

    //% block="销毁 $this(hudSlot)"
    //% blockId=yahud_destroy
    //% group="显示"
    //% weight=50
    //% blockGap=8
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

    //% block="在 $corner 创建 HUD 槽位"
    //% blockId=yahud_create
    //% blockNamespace=自定义HUD
    //% blockSetVariable="hudSlot"
    //% corner.defl=YahudCorner.BottomLeft
    //% group="创建"
    //% weight=100
    //% blockGap=8
    export function create(corner: YahudCorner): HudSlot {
        const slot = new HudSlot(corner);
        _addSlot(slot);
        return slot;
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
