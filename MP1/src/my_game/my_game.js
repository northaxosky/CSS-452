/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as engine from "../engine/core.js";

class MyGame {
    constructor(htmlCanvasID) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Clear the canvas
        engine.clearCanvas([0.65, 0.67, 0.7, 1]);

        // Step C: Draw all of it dear lord
        // Squares
        engine.drawSquare([1, 0, 0, 1], [-0.9, 0.77], [0.1, 0.3]);
        engine.drawSquare([1, 1, 0, 1], [-0.6, 0.77], [0.4, 0.1]);
        engine.drawSquare([1, 0, 1, 1], [-0.2, 0.77], [0.3, 0.2]);
        engine.drawSquare([0.5, 1, 0.5, 1], [0.2, 0.77], [0.4, 0.3]);
        engine.drawSquare([1, 0.5, 0.5, 1], [0.7, 0.77], [0.5, 0.4]);

        // Triangles
        engine.drawTriangle([1, 0, 0, 1], [-0.9, 0.35], [0.1, 0.3]);
        engine.drawTriangle([1, 1, 0, 1], [-0.6, 0.35], [0.4, 0.1]);
        engine.drawTriangle([1, 0, 1, 1], [-0.2, 0.35], [0.3, 0.2]);
        engine.drawTriangle([0.5, 1, 0.5, 1], [0.2, 0.35], [0.4, 0.3]);
        engine.drawTriangle([1, 0.5, 0.5, 1], [0.7, 0.35], [0.5, 0.4]);

        //  Circles
        engine.drawCircle([1, 0, 0, 1], [-0.9, -0.1], [0.1, 0.3]);
        engine.drawCircle([1, 1, 0, 1], [-0.6, -0.1], [0.4, 0.1]);
        engine.drawCircle([1, 0, 1, 1], [-0.2, -0.1], [0.3, 0.2]);
        engine.drawCircle([0.5, 1, 0.5, 1], [0.2, -0.1], [0.4, 0.3]);
        engine.drawCircle([1, 0.5, 0.5, 1], [0.7, -0.1], [0.5, 0.4]);

        //Pentagon
        engine.drawHexagon([1, 0, 0, 1], [-0.88, -0.5], [0.1, 0.18]);
        engine.drawHexagon([1, 1, 0, 1], [-0.5, -0.5], [0.15, 0.05]);
        engine.drawHexagon([1, 0, 1, 1], [-0.15, -0.5], [0.1, 0.05]);
        engine.drawHexagon([0.5, 1, 0.5, 1], [0.2, -0.5], [0.15, 0.1]);
        engine.drawHexagon([1, 0.5, 0.5, 1], [0.7, -0.5], [0.2, 0.15]);

        engine.drawOctagon([1, 0, 0, 1], [-0.88, -0.83], [0.1, 0.15]);
        engine.drawOctagon([1, 1, 0, 1], [-0.5, -0.83], [0.15, 0.05]);
        engine.drawOctagon([1, 0, 1, 1], [-0.15, -0.83], [0.1, 0.05]);
        engine.drawOctagon([0.5, 1, 0.5, 1], [0.2, -0.83], [0.15, 0.1]);
        engine.drawOctagon([1, 0.5, 0.5, 1], [0.7, -0.83], [0.2, 0.15]);
    }
}

window.onload = function() {
    new MyGame('GLCanvas');
}