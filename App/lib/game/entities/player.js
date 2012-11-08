ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'game.entities.camera-target'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/astronaut-8px-01.png', 8, 8),

    size: {x: 8, y: 8},

    cameraTarget: null,
    screenHeight: null,
    moving: false,
    maxVel: {x:0, y:180},
    walkSpeed: 0,
    jumpSpeed: 80,
    jump: 800,
    dead: false,
    teleport: false,
    ufo: null,

    init: function( x, y, settings ) {
        this.addAnim('idle',        1,  [0]);
        this.addAnim('walk',        .2, [1,2]);
        this.addAnim('jump',        1,  [3], true);
        this.addAnim('lookup',      1,  [4], true);
        this.addAnim('teleport',    .1, [5,6,7,5,6,7,5,6,7,5,6,7,5,6,7], true);

        this.parent( x, y, settings ); // Super
    },

    setup: function(ct, bm, ufo) {
        this.cameraTarget = ct;
        this.walkSpeed = this.cameraTarget.walkSpeed + 10;
        this.ufo = ufo;
        this.maxVel.x = this.cameraTarget.maxVel.x;
        this.screenHeight = bm.height * bm.tilesize;
    },

    handleMovementTrace: function(res) {
        if (this.dead) {
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        } else {
            this.parent(res);
        }
    },
    
    // other: object that triggered the trigger
    // trigger: the trigger itself
    triggeredBy: function(other, trigger) {
        this.currentAnim = this.anims.teleport;
        this.accel.x = 0;
        this.vel.x = 0;
        this.vel.y = 0;
    },

    receiveDamage: function(damage, trigger) {
        this.cameraTarget.stop();
        this.moving = false;
        this.accel.x = 0;
        this.vel.x = 10;
        this.vel.y = -this.jump;
        this.dead = true;
    },

    update: function() {

        if (this.currentAnim == this.anims.teleport) {
            if (!this.teleport) {
                this.currentAnim.rewind();
                this.teleport = true;
            }
            this.currentAnim.update();
            if (this.currentAnim.loopCount) {
                this.ufo.addPilot();
                this.kill();
            }
        } else {

            if (ig.game.screen.x > (this.pos.x + this.size.x) ||
                (this.pos.y + this.size.y) > this.screenHeight) {
                ig.game.restart();
            }

            if (this.standing) this.moving = true;

            if (this.moving) {
                this.cameraTarget.move(this.vel.x);
                this.accel.x = this.walkSpeed;

                if (this.standing && ig.input.state('up')) {
                    this.vel.y = -this.jump;
                    this.accel.x = this.jumpSpeed;
                }
            }

            this.currentAnim = this.vel.x != 0 ? this.anims.walk : this.anims.idle;

            if (this.vel.y != 0 && !this.standing) {
                this.currentAnim = this.anims.jump;
            }

            if (this.dead) {
                this.currentAnim = this.anims.idle;
                this.currentAnim.flip.y = true;
            }
        }

        this.parent();
    }
});

});

