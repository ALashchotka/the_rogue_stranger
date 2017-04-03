var map, layer, player, Background, cursors, jumpKey, actionKeys, jumpTimer = 0;
var Game = {
    preload: function () {
        game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
        game.load.tilemap('level', 'assets/images/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('knight', 'assets/images/knight/knight_atlas.png', 'assets/images/knight/knight_atlas.json');
    },
    create: function () {
        Background = game.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, game.world.width + 500, game.world.height + 500);
        Background.endFill();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('level');
        map.addTilesetImage('tiles');
        map.setCollisionBetween(1, 25);
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        player = game.add.sprite(32, game.world.height - 150, 'knight');
        player.animations.add('knight_walk', Phaser.Animation.generateFrameNames('knight_walk', 0, 7), 8, true);
        player.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
        player.animations.add('knight_slash', Phaser.Animation.generateFrameNames('knight_slash', 0, 9), 10, true);
        player.animations.add('knight_block', Phaser.Animation.generateFrameNames('knight_block', 0, 6), 10, true);
        player.animations.add('knight_death', Phaser.Animation.generateFrameNames('knight_death', 0, 8), 10, true);
        game.physics.enable(player);
        player.body.gravity.y = 250;
        player.body.bounce.y = 0.1;
        player.anchor.setTo(0.5, 0.5);
        player.x = 50;
        player.y = 50;
        cursors = game.input.keyboard.createCursorKeys();
        jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        actionKeys = game.input.keyboard.addKeys({ 'slash': Phaser.KeyCode.A, 'block': Phaser.KeyCode.D, 'death': Phaser.KeyCode.K })
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    },
    update: function () {
        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -100;
            player.scale.setTo(-1, 1);
            player.animations.play('knight_walk');
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 100;
            player.scale.setTo(1, 1);
            player.animations.play('knight_walk');
        } else if (actionKeys.slash.isDown) {
            player.animations.play('knight_slash');
        } else if (actionKeys.block.isDown) {
            player.animations.play('knight_block');
        } else if (actionKeys.death.isDown) {
            player.animations.play('knight_death');
        } else {
            player.animations.play('knight_idle');
        }
        if (jumpKey.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
            player.body.velocity.y = -200;
            jumpTimer = game.time.now + 650;
        }
    }
};
