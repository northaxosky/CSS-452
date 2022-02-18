"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

import Hero from "./hero.js";
import MultiTextureTest from "./MultiTextureTest.js";
import MultiTextureRenderable from "../engine/renderables/multi_texture_renderable.js";

// Spot texture from: https://www.pngall.com/spot-light-png/download/68214

/*
MUST: 
    Scale main Object, what is the effect?
    Change the API so that texture_placement remembers the UV/WH settings?
    Two instances of MultiTexture_Renderables
*/

class MyGame extends engine.Scene {
    constructor() {
        super();

        this.kMinionSprite = "assets/minion_sprite.png";
        this.kUp = "assets/up.png";
        this.kF = "assets/f_walk.png";
        this.kPete = "assets/pete.png";
        this.kPeteMenu = "assets/pete_menu.png"
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;
        this.mHero = null;

        this.mObjPete = null;
        this.mObjMenu = null;
        this.mObjSprite = null;
        this.mCurrentObj = null;  // reference to either objPete. objMenu, or objSprite
        this.mObjMsg = "Pete";

        this.mMsg = null;


        this.mIndex = 1;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kUp);
        engine.texture.load(this.kF);
        engine.texture.load(this.kPete);
        engine.texture.load(this.kPeteMenu);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kUp);
        engine.texture.unload(this.kF);
        engine.texture.unload(this.kPete);
        engine.texture.unload(this.kPeteMenu);
        engine.texture.unload(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(5, 4), // position of the camera
            10,                   // width of camera
            [0, 0, 1000, 800]      // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(15, 15);
        this.mBg.getXform().setPosition(5, 4);

        this.mObjPete = new MultiTextureTest(3, 2, 4, 2.5, this.kPete, this.kUp, this.kF);
        this.mObjMenu = new MultiTextureTest(7, 6, 4, 2.5, this.kPeteMenu, this.kUp, this.kF);
        this.mObjSprite = new MultiTextureTest(2.5, 6, 4, 2.5, this.kMinionSprite, this.kUp, this.kF);
        this.mCurrentObj = this.mObjPete;
        this.mObjMsg = "Pete";
        

        this.mHero = new Hero(this.kMinionSprite, 5, 4);
    
        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(0.2, 0.3);
        this.mMsg.setTextHeight(0.2);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();
        
        this.mBg.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mObjPete.draw(this.mCamera);
        this.mObjMenu.draw(this.mCamera);
        this.mObjSprite.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        if (engine.input.isKeyClicked(engine.input.keys.Z)) {
            this.mCurrentObj = this.mObjPete;    
            this.mObjMsg = "Pete";
        }
        if (engine.input.isKeyClicked(engine.input.keys.X)) {
            this.mCurrentObj = this.mObjMenu;    
            this.mObjMsg = "Menu";
        }
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.mCurrentObj = this.mObjSprite;    
            this.mObjMsg = "Sprite";
        }

        this.mHero.update();
        this.mMsg.setText("Obj:" + this.mObjMsg + " " + this.mCurrentObj.update());
            // only update either objPete or objMenu
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}