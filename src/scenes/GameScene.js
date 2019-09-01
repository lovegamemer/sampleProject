let width
let height
let x
let y
let player1
let player2
let platfroms
let warp
let cursors
let keyA
let keyW
let keyD
let spacebar
let score = 0
let scoreText
let bullets
let bullet
let Bullet

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {

        this.load.image('bg', '../../image/bg.jpg')
        this.load.image('ground', '../../image/ground.png')
        this.load.image('platfrom', '../../image/long path2.png')
        this.load.image('bullet', '../../image/bomb.png')
        this.load.spritesheet('player1', '../../image/beaver-Sheet.png', { frameWidth: 68, frameHeight: 68 })
        this.load.spritesheet('player2', '../../image/character.png', { frameWidth: 416, frameHeight: 454 })
        this.load.spritesheet('warp', '../../image/checkpoint.png', { frameWidth: 164, frameHeight: 414 })
        this.load.audio('bgm', '../../image/bgm.mp3')

    }

    create() {

        width = this.scene.scene.physics.world.bounds.width
        height = this.scene.scene.physics.world.bounds.height

        x = width * 0.5
        y = height * 0.5

        this.add.image(x, y, 'bg')

        platfroms = this.physics.add.staticGroup()

        platfroms.create(x, 600, 'ground').refreshBody()
        platfroms.create(200, 450, 'platfrom')
        platfroms.create(400, 200, 'platfrom')
        platfroms.create(600, 375, 'platfrom')

        warp = this.physics.add.image(x, 100, 'warp').setScale(0.3)

        player1 = this.physics.add.sprite(150, 475, 'player1')
            // player2 = this.physics.add.sprite(600, 475, 'player2').setScale(0.2)

        player1.setCollideWorldBounds(true)
            // player2.setCollideWorldBounds(true)

        this.anims.create({
            key: 'LeftP1',
            frames: this.anims.generateFrameNumbers('player1', { start: 0, end: 3 }),
            framerate: 20,
            repeat: -1
        })
        this.anims.create({
            key: 'RightP1',
            frames: this.anims.generateFrameNumbers('player1', { start: 5, end: 8 }),
            framerate: 20,
            repeat: -1
        })
        this.anims.create({
                key: 'IdleP1',
                frames: [{ key: 'player1', frame: 4 }],
                framerate: 10,
                repeat: -1
            })
            // this.anims.create({
            //     key: 'WalkP2',
            //     frames: this.anims.generateFrameNumbers('player2', { start: 0, end: 3 }),
            //     framerate: 20,
            //     repeat: -1
            // })
            // this.anims.create({
            //     key: 'IdleP2',
            //     frames: [{ key: 'player2', frame: 3 }],
            //     framerate: 20,
            //     repeat: -1
            // })

        Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
                this.velocity = new Phaser.Geom.Point(0, 0);
                this.speed = Phaser.Math.GetSpeed(600, 1);
            },

            fire: function(x, y) {
                this.setPosition(x, y);

                this.setActive(true);
                this.setVisible(true);

            },

            update: function(time, delta) {
                this.x += this.speed * delta;
                this.y += this.velocity.y * delta;

                if (this.y < -50) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }

        });

        bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        })

        scoreText = this.add.text(16, 16, 'Score : 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(platfroms, warp)
        this.physics.add.collider(platfroms, player1)
        this.physics.add.collider(bullets, warp, hits)
            // this.physics.add.collider(platfroms, player2)

        // this.physics.add.overlap(warp, player1)

        // cursors = this.input.keyboard.createCursorKeys();
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    }

    update() {


        if (keyA.isDown) {
            player1.setVelocityX(-160)
            player1.anims.play('LeftP1', true)
        } else if (keyD.isDown) {
            player1.setVelocityX(160)
            player1.anims.play('RightP1', true)
        } else {
            player1.setVelocityX(0)
            player1.anims.play('IdleP1', true)
        }

        if (keyW.isDown && player1.body.touching.down) {
            player1.setVelocityY(-330)
        }
        if (Phaser.Input.Keyboard.JustDown(spacebar)) {
            bullet = bullets.get();
            if (bullet) {
                bullet.fire(player1.x, player1.y);
            }

        }

        // if (cursors.left.isDown) {
        //     player2.setVelocityX(-160)
        //     player2.anims.play('WalkP2', true)
        //     player2.flipX = true
        // } else if (cursors.right.isDown) {
        //     player2.setVelocityX(160)
        //     player2.anims.play('WalkP2', true)
        //     player2.flipX = false
        // } else {
        //     player2.setVelocityX(0)
        //     player2.anims.play('IdleP2', true)
        // }

        // if (cursors.up.isDown && player2.body.touching.down) {
        //     player2.setVelocityY(-330)
        // }

    }

}

function hits(player, warp, bullets) {

    score += 100;
    scoreText.setText('Score: ' + score);
}

export default GameScene;