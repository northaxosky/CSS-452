/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!


import { loadDecodeParse } from "../engine/core/resource_map.js";
// Engine stuff
import engine from "../engine/index.js";

// User stuff
import BlueLevel from "./blue_level.js";
import GrayLevel from "./gray_level.js";
import * as Storage from "../engine/storage.js";

class MyGame extends engine.Scene {

    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.mBackgroundAudio = "assets/sounds/bg_clip.mp3";
        this.mCue = "assets/sounds/my_game_cue.wav";

        this.sqSet = [];

        // The camera to view the scene
        this.mCamera = null;
        Storage.init();
    }

    load() {
        // loads the audios
    }

    init() {    
        // Step A: set up the camera
        let firstLevel = new GrayLevel();
        firstLevel.start();
    }


    unload() {

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);

        // Step  B: Activate the drawing Camera
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {}

    next() {      
        super.next();  // this must be called!

        // next scene to run
        let nextLevel = new GrayLevel();  // next level to be loaded
        nextLevel.start();
    }

}
export default MyGame;


window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}