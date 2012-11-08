ig.module(
    'game.entities.camera-target'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityCameraTarget = ig.Entity.extend({
    
    _wmScalable: false,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 255, 0, 0.7)',

    size: {x: 8, y: 8},
    gravityFactor: 0,

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    
    maxVel: {x: 70, y:0},
    moving: false,
    walkSpeed: 10,

    init: function( x, y, settings ) {
        this.parent( x, y, settings ); // Super
    },

    move: function(xvel) {
        this.accel.x = this.walkSpeed;
        if (this.vel.x < xvel) this.vel.x = xvel;
    },

    stop: function() {
        this.accel.x = 0;
        this.vel.x = 0;
    },

    handleMovementTrace: function( res ) {
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
    },

    // other: object that triggered the trigger
    // trigger: the trigger itself
    triggeredBy: function(other, trigger) {
        this.kill();
    }

});

});

