scene.setBackgroundColor(7)

let player = sprites.create(img`
    . . . . . . . .
    . . . 7 7 7 . .
    . . 7 7 7 7 7 .
    . 7 7 7 7 7 7 .
    . . 7 7 7 7 7 .
    . . . 7 . 7 . .
    . . 7 . . . 7 .
    . 7 . . . . . 7
`, SpriteKind.Player)
player.setStayInScreen(true)
controller.moveSprite(player)

info.setScore(0)
info.setLife(3)

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
ammo.setValue(5)

game.onUpdate(() => {
    if (controller.A.isPressed()) {
        coins.changeValue(1)
        info.changeScoreBy(1)
    }
    if (controller.B.isPressed()) {
        if (ammo.value > 0) {
            ammo.changeValue(-1)
            let bullet = sprites.createProjectileFromSprite(img`
                . . 1 . .
                . 1 1 1 .
                1 1 1 1 1
                . 1 1 1 .
                . . 1 . .
            `, player, 0, -80)
            bullet.setKind(SpriteKind.Projectile)
            scene.cameraShake(2, 100)
        }
    }
})
