"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Made by Myles, Kuzey, and Aman

import engine from "../engine/index.js";

// user stuff
import DyePack from "./objects/dye_pack.js";
import Hero from "./objects/hero.js";
import Patrol from "./objects/patrol.js";
import Lerp from "../engine/utils/lerp.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kBg = "assets/bg.png";
        this.kSS = "assets/Stellar_Striker.png"
        this.kAltSprite = "assets/alternate_sprite.png";


        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;
        this.mCollisionCam1 = null;
        this.mCollisionCam2 = null;
        this.mCollisionCam3 = null;
        this.mBg = null;

        this.mMsg = null;
        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;

        // Auto Spawn Patrol
        this.autospawn = false;
        this.prevSpawnTime = null;
        this.nextSpawnTime = null;

        // other
        this.showBB = false;
        this.time = 0;
        this.isPanning = [];

        // zoom camera checks
        this.heroCamCheck = false;

        // Dye and Patrol sets
        this.dyePacks = [];
        this.patrolSet = [];

        this.mChoice = 'D';
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kSS);
        engine.texture.load(this.kAltSprite);

    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kSS);
        engine.texture.unload(this.kAltSprite);

    }

    init() {

        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 75), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setPosition(0, 0);
        this.mBg.getXform().setSize(400, 350);

        this.mHeroCam = new engine.Camera(
            vec2.fromValues(50, 30),
            15,
            [0, 600, 200, 200],
            2                           // viewport bounds
        );
        this.mHeroCam.setBackgroundColor([0.8, 0.8, 0.85, 1]);
        this.mHeroCam.configLerp(0.7, 10);
        // Large background image

        this.mCollisionCam1 = new engine.Camera(
            vec2.fromValues(50, 30),
            6,
            [200, 600, 200, 200],
            2
        );
        this.mCollisionCam1.setBackgroundColor([0.8, 0.8, 0.85, 1]);
        this.mCollisionCam1.configLerp(0.7, 10)

        this.mCollisionCam2 = new engine.Camera(
            vec2.fromValues(50, 30),
            6,
            [400, 600, 200, 200],
            2
        );
        this.mCollisionCam2.setBackgroundColor([0.8, 0.8, 0.85, 1]);
        this.mCollisionCam2.configLerp(0.7, 10)

        this.mCollisionCam3 = new engine.Camera(
            vec2.fromValues(50, 30),
            6,
            [600, 600, 200, 200],
            2
        );
        this.mCollisionCam3.setBackgroundColor([0.8, 0.8, 0.85, 1]);
        this.mCollisionCam3.configLerp(0.7, 10)

        // Objects in the scene
        this.mHero = new Hero(this.kMinionSprite);

        this.mMsg = new engine.FontRenderable("Status: DyePacks(" + this.dyePacks.length + ")");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(3, 4);
        this.mMsg.setTextHeight(3);

        // create an Oscillate object to simulate motion
        this.mBounce = new engine.Oscillate(1.5, 6, 120); // delta, freq, duration

        this.heroInterpolateX = new Lerp(this.mHero.getXform().getXPos(), 120, 0.05);
        this.heroInterpolateY = new Lerp(this.mHero.getXform().getYPos(), 120, 0.05);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);
        this.mHero.draw(camera);

        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].draw(camera);
        }


        for (let i = 0; i < this.patrolSet.length; i++) {
            (this.patrolSet[i]).draw(camera);
        }

        if (this.showBB && camera === this.mCamera) {
            this.drawBoundingBoxes();
        }
    }

    // This is the draw function, make sure to se tup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        if (this.heroCamCheck) {
            this._drawCamera(this.mHeroCam);
        }
        if (this.isPanning[0]) {
            this._drawCamera(this.mCollisionCam1);
        }
        if (this.isPanning[1]) {
            this._drawCamera(this.mCollisionCam2);
        }
        if (this.isPanning[2]) {
            this._drawCamera(this.mCollisionCam3);
        }

    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // remove invalid patrols and dyes
        let patrolTemp = [];
        for (let i = 0; i < this.patrolSet.length; i++) {
            if (this.patrolSet[i].valid) {
                patrolTemp.push(this.patrolSet[i]);
            }
        }
        this.patrolSet = patrolTemp;


        let temp = [];
        for (let i = 0; i < this.dyePacks.length; i++) {
            if (this.dyePacks[i].valid) {
                temp.push(this.dyePacks[i]);
            }
        }
        this.dyePacks = temp;

        this.mCamera.update();  // for smoother camera movements
        this.mHeroCam.update();
        this.mCollisionCam1.update();
        this.mCamera.setViewport([0, 0, 800, 600], 0);
        this.mCamera.setWCWidth(200);
        this.mCamera.setWCCenter(100, 75);
        this.mHero.getXform().setSize(9, 12);
        this.mCollisionCam2.update();
        this.mCollisionCam3.update();
        this.mHero.update(this.mCamera); 
        


       
        // update all the dye packs
        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].update(this.mCamera);
        }
        // updates all the patrols
        for (let i = 0; i < this.patrolSet.length; i++) {
            this.patrolSet[i].update();
        }

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.spawnPatrol()
        }

        let h = [];
        let w = [];
        let d = [];
        let u = [];
        for (let i = 0; i < this.patrolSet.length; i++) {
            if (this.mHero.pixelTouches(this.patrolSet[i].head, h)) {
                if (!this.mHero.reShake()) {
                    this.heroCamCheck = true;
                    this.mHero.shakeDye();
                }

                // also re-start bouncing effect
                this.mBounce.reStart();
            }
            for (let j = 0; j < this.dyePacks.length; j++) {
                // let ch = false;
                if (this.dyePacks[j].pixelTouches(this.patrolSet[i].head, w) && !this.dyePacks[j].isOscillating) {
                    this.patrolSet[i].head.dyeHit();
                    this.dyePacks[j].isOscillating = true;
                    // ch = true;
                }
                if (this.dyePacks[j].pixelTouches(this.patrolSet[i].topWing, d) && !this.dyePacks[j].isOscillating) {
                    this.patrolSet[i].topWing.dyeHit();
                    this.dyePacks[j].isOscillating = true;
                    // ch = true;
                }
                if (this.dyePacks[j].pixelTouches(this.patrolSet[i].bottomWing, u) && !this.dyePacks[j].isOscillating) {
                    this.patrolSet[i].bottomWing.dyeHit();
                    this.dyePacks[j].isOscillating = true;
                    // ch = true;
                }
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            for (let i = 0; i < this.patrolSet.length; i++) {
                this.patrolSet[i].head.dyeHit(this.mHero);
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.dyePacks = [];
            this.patrolSet = [];
            this.autospawn = false;
            this.showBB = false;
        }
        // spawn 1 of 2 different dye pack objects
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            let int = Math.random();
            if (int < 0.5) {
                this.dyePacks.push(new DyePack(this.kMinionSprite, this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos(), performance.now()));
            } else {
                this.dyePacks.push(new DyePack(this.kSS, this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos(), performance.now()));
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            for (let i = 0; i < this.dyePacks.length; i++) {
                this.dyePacks[i].decelerate()
            }
        }
        // trigger the on hit oscillation for dye pack
        if (engine.input.isKeyClicked(engine.input.keys.S)) {
            for (let i = 0; i < this.dyePacks.length; i++) {
                this.dyePacks[i].isOscillating = true;
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            if (!this.mHero.reShake()) {
                this.mHero.shakeDye();
                this.heroCamCheck = true;
            }

            // also re-start bouncing effect
            this.mBounce.reStart();
        }

        if (!this.mBounce.done()) {
            let d = this.mBounce.getNext();
            this.mHero.getXform().incHeightBy(d);
            this.mHero.getXform().incWidthBy(d);
        }
        if (this.mBounce.done()) {
            this.heroCamCheck = false;
        }

        // set the hero and brain cams    
        this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());

        // testing the mouse input
        if (this.mCamera.isMouseInViewport()) {
            let x = this.mCamera.mouseWCX();
            let y = this.mCamera.mouseWCY();
            // right  bound
            if (x > this.mCamera.getWCWidth() - this.mHero.bbox.mWidth/2) {
                this.heroInterpolateX.setFinal(this.mCamera.getWCWidth() - this.mHero.bbox.mWidth/2);
            } // left bound
            else if (x < this.mHero.bbox.mWidth/2) {
                this.heroInterpolateX.setFinal(this.mHero.bbox.mWidth/2);
            }else{
                this.heroInterpolateX.setFinal(x);
            }
            this.heroInterpolateX.update();
            this.mHero.getXform().setXPos(this.heroInterpolateX.get());
            // top bound
            if (y > this.mCamera.getWCHeight() - this.mHero.bbox.mHeight/2) {
                this.heroInterpolateY.setFinal(this.mCamera.getWCHeight() - this.mHero.bbox.mHeight/2);
            }// bottom bound
             else if (y < this.mHero.bbox.mHeight/2) {
                this.heroInterpolateY.setFinal(this.mHero.bbox.mHeight/2);
            } else {
                this.heroInterpolateY.setFinal(y);
            }
            this.heroInterpolateY.update();
            this.mHero.getXform().setYPos(this.heroInterpolateY.get());
        }
       
        this.checkAutoSpawn();
        this.inputBoundingBoxes();
        this.decelerateDyePack();

        this.isPanning = [false, false, false];

        if (engine.input.isKeyPressed(engine.input.keys.Zero)) {
            this.heroCamCheck = !this.heroCamCheck;
        }

        if (engine.input.isKeyPressed(engine.input.keys.One)) {
            this.isPanning[0] = !this.isPanning[0];
        }

        if (engine.input.isKeyPressed(engine.input.keys.Two)) {
            this.isPanning[1] = !this.isPanning[1];
        }

        if (engine.input.isKeyPressed(engine.input.keys.Three)) {
            this.isPanning[2] = !this.isPanning[2];
        }

        this.mMsg.setText("Status: DyePacks(" + this.dyePacks.length + ") Patrols (" + this.patrolSet.length + ") AutoSpawn(" + this.autospawn + ")");

        // close up dye pack camera panning
        this.panTo = []
        for (let i = 0; i < this.dyePacks.length; i++) {
            if (this.dyePacks[i].isOscillating && !this.isPanning[0]) {

                // Cam 1 Pan
                this.mCollisionCam1.panTo(this.dyePacks[i].getXform().getXPos(), this.dyePacks[i].getXform().getYPos());
                this.isPanning[0] = true
            } else if (this.dyePacks[i].isOscillating && !this.isPanning[1]) {

                // Cam 2 Pan
                this.mCollisionCam2.setWCCenter(this.dyePacks[i].getXform().getXPos(), this.dyePacks[i].getXform().getYPos());
                this.isPanning[1] = true

            } else if (this.dyePacks[i].isOscillating && !this.isPanning[2]) {

                // Cam 3 Pan
                this.mCollisionCam3.setWCCenter(this.dyePacks[i].getXform().getXPos(), this.dyePacks[i].getXform().getYPos());

                this.isPanning[2] = true
            }
        }

    }

    decelerateDyePack() {
        for (let i = 0; i < this.dyePacks.length; i++) {
            for (let j = 0; j < this.patrolSet.length; j++) {
                let dyepack = this.dyePacks[i].getBBox();
                let patrolBox = this.patrolSet[j].getBoundingBox();
                if (dyepack.intersectsBound(patrolBox)) {
                    this.dyePacks[i].decelerate();
                }
            }
        }
    }

    checkAutoSpawn() {
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.autospawn = !this.autospawn;
            this.autospawnTimer = performance.now();
            this.tempAS = Math.random() * (3 - 2) + 2;
        }
        if (this.autospawn && this.autospawnTimer >= this.tempAS) {
            this.time += this.getRandomTime();
            setTimeout(() => {
                if (this.autospawn) {
                    this.spawnPatrol();
                }
            }, this.time);
            this.tempAS = Math.random() * (3 - 2) + 2;
        }
    }

    getRandomTime() {
        return 1000 * (Math.random() + 2);
    }

    spawnPatrol() {
        if (Math.random() > 0.5) {
            this.patrolSet.push(new Patrol(this.kMinionSprite, this.kMinionSprite, this.mCamera));
        } else {
            this.patrolSet.push(new Patrol(this.kAltSprite, this.kAltSprite, this.mCamera));
        }
    }

    checkObjectLifespan() {
        let size = 0;

        // find larger size 
        if (this.dyePacks.length >= this.patrolSet.length)
            size = this.dyePacks.length;
        else
            size = this.patrolSet.length;

        // loop through to check
        for (let i = 0; i < size; i++) {
            if (this.dyePacks[i].valid) {
                this.dyePacks.splice(i, 1);
            }
            if (this.patrolSet[i].kill) {
                this.patrolSet.splice(i, 1);
            }
        }
    }

    inputBoundingBoxes() {
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.showBB = !this.showBB;
        }
    }

    drawBoundingBoxes() {
        if (this.showBB) {
            for (let i = 0; i < this.patrolSet.length; i++) {
                let patrol = this.patrolSet[i];
                patrol.boundingBox.drawBB(this.mCamera);
                patrol.head.boundingBox.drawBB(this.mCamera);
                patrol.bottomWing.wingBoundingBox.drawBB(this.mCamera);
                patrol.topWing.wingBoundingBox.drawBB(this.mCamera);
            }
        }

    }

} // end of class

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}