/*
 * This is the logic of our game. 
 */


// Engine Core stuff
import engine from "../engine/index.js";
import GrayLevel from "./gray_level.js";

// Local stuff
import MyGame from "./my_game.js";
import SceneFileParser from "./util/scene_file_parser.js";
import * as Storage from "../engine/storage.js";

class BlueLevel extends engine.Scene {
    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.mBackgroundAudio = "assets/sounds/bg_clip.mp3";
        this.mCue = "assets/sounds/blue_level_cue.wav";

        // scene file name
        this.mSceneFile = "assets/blue_level.xml";
        // all squares
        this.mSQSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.mCamera = null;
        this.mainCamera = null;
        this.smallCamera = null;
    }

    load() {
        engine.xml.load(this.mSceneFile);
        engine.audio.load(this.mBackgroundAudio);
        engine.audio.load(this.mCue);
    }

    init() {
        let sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile));

        if (Storage.empty(2))   {
            // Step A: Read in the camera
            this.mCamera = sceneParser.parseCamera();

            // Step B: Read all the squares
            sceneParser.parseSquares(this.mSQSet);
        }
        else    {
            this.mCamera = Storage.getCam(2);
            this.mSQSet = Storage.getObjs(2);
        }
        this.smallCamera = Storage.getSmallCam();
    }

    unload() {

        // unload the scene flie and loaded resources
        Storage.addCam(2, this.mCamera);
        Storage.addObj(2, this.mSQSet);
        Storage.addSmallCam(this.smallCamera);

        engine.xml.unload(this.mSceneFile);

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]);

        if (this.mCamera)
            this.mCamera.setViewAndCameraMatrix();
        
        let i;
        for (i = 0; i < this.mSQSet.length; i++) {
            this.mSQSet[i].draw(this.mCamera);
        }

        this.mainCamera = this.mCamera;
        this.mCamera = this.smallCamera;

        if (this.mCamera)
            this.mCamera.setViewAndCameraMatrix();
        
        for (i = 0; i < this.mSQSet.length; i++) {
            this.mSQSet[i].draw(this.mCamera);
        }

        this.mCamera = this.mainCamera;
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {

        this.inputViewport();
        // For this very simple game, let's move the first square
        let xform = this.mSQSet[1].getXform();
        let deltaX = 0.05;

        // Move right and swap over
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // Step A: test for white square movement
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                this.next(); // go back to my game
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game

        if (engine.input.isKeyClicked(engine.input.keys.N))
            this.next();
    }

    next() {
        super.next();
        let nextLevel = new GrayLevel();  // load the next level
        nextLevel.start();
    }

    inputViewport() {
        let currVP = this.smallCamera.getViewport();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            currVP[1] += 5;
            this.smallCamera.setViewport(currVP);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            currVP[1] -= 5;
            this.smallCamera.setViewport(currVP);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            currVP[0] += 5;
            this.smallCamera.setViewport(currVP);
        }
        if (engine.input.isKeyReleased(engine.input.keys.A))    {
            currVP[0] -= 10;
            this.smallCamera.setViewport(currVP);
        }
    }
}

export default BlueLevel;