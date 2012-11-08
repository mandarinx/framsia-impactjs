ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    'impact.background-map',

    'game.levels.entrance',
    'game.camera'
)
.defines(function(){

MyGame = ig.Game.extend({
    
    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),
    player: null,
    camera: null,
    gravity: 500, // All entities are affected by this
    
    init: function() {
        ig.input.bind(ig.KEY.UP_ARROW, 'up');

        this.camera = new Camera(ig.system.width/2, ig.system.height/6, 10);
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

        this.loadLevel(LevelEntrance);
    },

    loadLevel: function(level) {

        var as = new ig.AnimationSheet('media/tilemap-CGA01.png', 8, 8);
        this.backgroundAnims = {
            'media/tilemap-CGA01.png': {
                78: new ig.Animation( as, 0.1, [79, 80, 81, 78] )
            }
        };

        this.parent(level);
        this.player = this.getEntitiesByType(EntityPlayer)[0];

        // Set camera max and reposition trap
        this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
        this.camera.set(this.player);
    },
    
    update: function() {
        this.camera.follow(this.player);
        this.parent();
    },
    
    draw: function() {
        this.parent();
    }
});

ig.main( '#canvas', MyGame, 60, 256, 144, 2 );

});
