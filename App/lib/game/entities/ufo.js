ig.module(
    'game.entities.ufo'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityUfo = ig.Entity.extend({

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    animSheet: new ig.AnimationSheet( 'media/ufo-01.png', 16, 16),

    size: {x: 16, y: 16},

    wait: -1,
    waitTimer: null,

    maxVel: {x:0, y:50},
    pilot: false,
    hoverSpeed: 50,

    init: function( x, y, settings ) {
        this.addAnim('idle', 1, [0]);
        this.addAnim('pilot', 1, [1]);
        this.addAnim('hover', .2, [2,3]);

        this.parent( x, y, settings ); // Super
        this.waitTimer = new ig.Timer();
    },

    addPilot: function() {
        this.pilot = true;
        this.waitTimer.set(1);
        this.currentAnim = this.anims.pilot;
    },

    update: function() {

        if (this.pilot) {
            if (this.waitTimer.delta() >= 0) {
                this.currentAnim = this.anims.hover;
                this.vel.y = -this.hoverSpeed;
            }
        }

        if ((this.pos.y + this.size.y) < 0) {
            ig.game.gameOver();
        }

        if (this.standing) {
            if (this.pilot) this.currentAnim = this.anims.pilot;
            else this.currentAnim = this.anims.idle;
        }

        this.parent();
    }
});

});

