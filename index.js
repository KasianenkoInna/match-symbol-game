'use strict';

const Game = require('./Game');

let game = new Game(4, 4);

console.log(game);

game.onCellPressed(0, 1);
