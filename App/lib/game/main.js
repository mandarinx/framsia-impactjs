ig.module( 
    'game.main' 
)
.requires(
    // 'impact.debug.debug',

    'impact.game',
    'impact.font',
    'impact.background-map',

    'game.levels.entrance',
    'game.levels.gameover',
    'game.camera.camera',
    'game.entities.camera-target',
    'game.entities.ufo',
    'plugins.touch-button'
)
.defines(function(){

MyGame = ig.Game.extend({
    
    font: new ig.Font( 'media/04b03.font.png' ),
    gravity: 500, // All entities are affected by this

    player: null,
    camera: null,
    cameraTarget: null,
    isGameOver: false,
    button: null,
    
    init: function() {
        ig.input.bind(ig.KEY.UP_ARROW, 'up');

        this.camera = new Camera(ig.system.width/2, ig.system.height/6, 10);
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

        this.loadLevel(LevelEntrance);

        // if (window.ejecta) {
        //     // Figure out the scaling ratio of internal to hardware pixels
        //     var hwpx = (window.innerWidth / ig.system.width) * ig.ua.pixelRatio;
        //     console.log('Hardware Pixel Scale: ', hwpx);

        //     ig.system.getDrawPos = function(p) {
        //         // Snap draw positions to the closest hardware pixel
        //         return ((p*hwpx)|0)/hwpx;
        //     };
        // }

        // For Mobile Browsers and Ejecta
        if (ig.ua.mobile) {
            this.button = new ig.TouchButton('up', 0, 0, 512, 288);
        }
    },

    loadLevel: function(level) {
        if (!this.isGameOver) {
            var as = new ig.AnimationSheet('media/tilemap-CGA01.png', 8, 8);
            this.backgroundAnims = {
                'media/tilemap-CGA01.png': {
                    78: new ig.Animation( as, 0.1, [79, 80, 81, 78] )
                }
            };

            this.parent(level);

            this.player = this.getEntitiesByType(EntityPlayer)[0];
            this.cameraTarget = this.getEntitiesByType(EntityCameraTarget)[0];
            this.player.setup(this.cameraTarget, this.backgroundMaps[0], this.getEntitiesByType(EntityUfo)[0]);

            // Set camera max and reposition trap
            this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
            this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
            this.camera.set(this.cameraTarget);

        } else {
            this.parent(level);
        }
    },

    restart: function() {
        this.loadLevel(LevelEntrance);
    },

    gameOver: function() {
        this.isGameOver = true;
        this.loadLevel(LevelGameover);
    },
    
    update: function() {
        if (!this.isGameOver) this.camera.follow(this.cameraTarget);
        this.parent();
    },

    draw: function() {
        this.parent();
        this.button.draw();
    }

});

ig.main( '#canvas', MyGame, 60, 256, 144, 2 );

});
