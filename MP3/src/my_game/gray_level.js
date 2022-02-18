/*
 * This is the logic of our game. 
 */


// Engine Core stuff
import engine from "../engine/index.js";
import BlueLevel from "./blue_level.js";

// Local stuff
import MyGame from "./my_game.js";
import SceneFileParser from "./util/scene_file_parser.js";
import * as Storage from "../engine/storage.js";
import Camera from "../engine/camera.js";

class GrayLevel extends engine.Scene {
    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats

        // scene file name
        this.mSceneFile = "assets/gray_level.json";
        // all squares
        this.mSQSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.mCamera = null;
        this.smallCamera = null;
        this.mainCamera = null;
    }

    load() {
        engine.json.load(this.mSceneFile);
    }

    init() {
        let sceneParser = new SceneFileParser(engine.json.get(this.mSceneFile));


        if (Storage.empty(1))    {
            // Step A: Read in the camera
            this.mCamera = sceneParser.parseCameraJSON();

            // Step B: Read all the squares
            sceneParser.parseSquaresJSON(this.mSQSet);

            this.smallCamera = new engine.Camera(
                vec2.fromValues(20, 60),   // position of the camera
                20,                        // width of camera
                [300, 300, 100, 100]         // viewport (orgX, orgY, width, height)
            );
            this.smallCamera.setBackgroundColor([0.2, 0.3, 0.2, 1]);
        }
        else    {
            this.mCamera = Storage.getCam(1);
            
            this.mSQSet = Storage.getObjs(1);

            this.smallCamera = Storage.getSmallCam();
        }
    }

    unload() {
        // stop the background audio
        Storage.addCam(1, this.mCamera);
        Storage.addObj(1, this.mSQSet);
        Storage.addSmallCam(this.smallCamera);

        // unload the scene flie and loaded resources
        engine.json.unload(this.mSceneFile);
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
        this.sceneOrQuit();
        this.rotateSquare();
        this.moveSquare();
        this.controlWC();
        this.zoomWC();
    }

    sceneOrQuit()   {
        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game
        if (engine.input.isKeyClicked(engine.input.keys.N))
            this.next();
    }

    rotateSquare()  {
        let rSquare = this.mSQSet[1];
        let rSpeed = 72/60;
        rSquare.getXform().incRotationByDegree(rSpeed);
    }

    moveSquare()    {
        let wSquare = this.mSQSet[0];
        let mSpeed = 1/9;
        wSquare.getXform().incXPosBy(-mSpeed);

        if (wSquare.getXform().getXPos() < 10) wSquare.getXform().setXPos(30);
    }

    controlWC()    {
        let currWC = this.mCamera.getWCCenter();
        let cSpeed = 0.3;
        if (engine.input.isKeyPressed(engine.input.keys.F)) {
            this.mCamera.setWCCenter(currWC[0], currWC[1] + cSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            this.mCamera.setWCCenter(currWC[0], currWC[1] - cSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.B)) {
            this.mCamera.setWCCenter(currWC[0] + cSpeed, currWC[1]);
        }
        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            this.mCamera.setWCCenter(currWC[0] - cSpeed, currWC[1]);
        }
    }

    zoomWC()    {
        let width = this.mCamera.getWCWidth();
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            this.mCamera.setWCWidth(width + 1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            this.mCamera.setWCWidth(width - 1);
        }
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

    next() {
        super.next();
        let nextLevel = new BlueLevel();  // load the next level
        nextLevel.start();
    }
}

export default GrayLevel;