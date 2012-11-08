// Disable bilinear filtering - good for pixel style games
canvas.imageSmoothingEnabled = false; 
canvas.scalingMode = 'none';

// Load the game
ejecta.require('lib/impact/impact.js');
ejecta.require('lib/game/main.js');

var height = 144;
var scale = window.innerHeight / height;
var width = window.innerWidth / scale;
ig.main('#canvas', MyGame, 60, width, height, 1);