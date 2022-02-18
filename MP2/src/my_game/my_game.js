/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Accessing engine internal is not ideal, 
//      this must be resolved! (later)
import * as loop from "../engine/core/loop.js";

// Engine stuff
import engine from "../engine/index.js";
import Renderable from "../engine/renderable.js";
import SimpleShader from "../engine/simple_shader.js";

class MyGame  {
    constructor() {

        // Timing for delete
        this.timer = 0;
        this.initialTime = null;

        // The camera to view the scene
        this.mCamera = null;

        // For MP2
        this.deleteMode = false;
        this.deleteTimer = 0.0;
        this.squareArray = [];
        this.timeArray = [];
        this.numSquaresInGroup = [];
        this.mCursor = null;

        // Extra Credit
        this.numTriangles = 0;
        this.isTriangle = [];
        this.triangleChance = 0.05;

        this.intervalMode = false;
        this.interval = 1000;
    }

    init() {    
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0),   // position of the camera
            100,                        // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Step  B: Create the Renderable objects:
        this.mCursor = new engine.Renderable();
        this.mCursor.setColor([1, 0, 0, 1]);

        // Step  C: Finish the cursor
        this.mCursor.getXform().setPosition(0, 0);
        this.mCursor.getXform().setSize(.5, .5);

    }


    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();
  
        // Step C: Draw Cursor
        this.mCursor.drawSquare(this.mCamera);

        // Draw the squares
        let index = 0;
        for (let i = 0; i < this.squareArray.length; i++) {
            if (this.isTriangle[i]) {
                this.squareArray[i].drawTriangle(this.mCamera);
            }
            else    {
                this.squareArray[i].drawSquare(this.mCamera);
            }
        }     
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.cursorMovement();
        this.checkIntervalSpawn();
        this.spawnSquares();
        this.checkSquares();
        this.changeInterval();
        this.checkDeleteMode();

        //update the text
        gUpdateObject(this.squareArray.length, this.deleteMode);
        gUpdateControls(this.intervalMode, this.interval);
        gUpdateTriangle(this.triangleChance, this.numTriangles);
    }

    cursorMovement()    {
        let speed = .5;
        let Xform = this.mCursor.getXform();

        //  Do x dependent on key pressed
        if (engine.input.isKeyPressed(engine.input.keys.Up)) Xform.incYPosBy(speed);
        if (engine.input.isKeyPressed(engine.input.keys.Down)) Xform.incYPosBy(-speed);
        if (engine.input.isKeyPressed(engine.input.keys.Right)) Xform.incXPosBy(speed);
        if (engine.input.isKeyPressed(engine.input.keys.Left)) Xform.incXPosBy(-speed);
    }

    checkIntervalSpawn()    {
        if (engine.input.isKeyClicked(engine.input.keys.I))
            if (this.intervalMode)
                this.intervalMode = false;
            else    {
                this.intervalMode = true;
                this.intervalStart = performance.now();
            }
    }

    changeInterval()    {
        if (engine.input.isKeyClicked(engine.input.keys.Q)) this.interval /= 2;
        if (engine.input.isKeyClicked(engine.input.keys.E)) this.interval *= 2;
    }

    spawnSquares()  {
        this.intervalCheck = performance.now();

        if (engine.input.isKeyClicked(engine.input.keys.Space) || 
            (this.intervalMode && this.intervalCheck - this.intervalStart >= this.interval)) {
            
            // Generate rand number of squares between 10 - 20
            let numSquares = Math.floor(10 + (10 * Math.random()));
            this.numSquaresInGroup.push(numSquares);
            
            let toPush = null;
            
            if (Math.random() < this.triangleChance)    {
                this.triangleChance = 0.05;
                toPush = true;
                this.numTriangles += numSquares;
            }
            else {
                this.triangleChance *= 1.5
                toPush = false;
            }

            for (let i = 0; i < numSquares; i++)    {

                // Get Position of cursor
                let position = this.mCursor.getXform().getPosition();

                // Initialize square and random rolls            
                let square = null;
                let randXPos = -5 + (10 * Math.random()) + position[0];
                let randYPos = -5 + (10 * Math.random()) + position[1];
                let randRotation = 180 * Math.random();
                let randXScale = 1 + (5 * Math.random());
                let randYScale = 1 + (5 * Math.random());

                // Create Square
                square = new engine.Renderable();
                square.setColor([Math.random(), Math.random(), Math.random(), 1]);
                square.getXform().setPosition(randXPos, randYPos);
                square.getXform().setSize(randXScale, randYScale);
                square.getXform().setRotationInDegree(randRotation);
                
                // Push square to the square array
                this.squareArray.push(square);
                this.isTriangle.push(toPush);
            }

            //  Timing
            if (this.timeArray.length === 0)   {
                this.timeArray.push(0);
                this.initialTime = performance.now();
            }
            else    {
                this.timer = performance.now() - this.initialTime;
                this.timeArray.push(this.timer);
            }
            console.log(this.isTriangle);
            console.log(this.squareArray);
            this.intervalStart = performance.now();

        }
    }

    checkDeleteMode()   {
        if (engine.input.isKeyClicked(engine.input.keys.D)) {
            if (this.deleteMode)    {
                this.deleteMode = false;
                this.deleteTimer = 0.0;
            }   
            else if (this.squareArray.length !== 0)  {
                this.deleteMode = true;
                this.initialDelete = performance.now();
            }
        }
    }

    checkSquares() {
        if (this.deleteMode)    {
            if (this.squareArray.length !== 0)  {
                this.deleteTimer = performance.now();
                if ((this.deleteTimer - this.initialDelete) >= this.timeArray[0])   {
                    this.squareArray.splice(0, (this.numSquaresInGroup[0] + 1));
                    if (this.isTriangle[0])  {
                        this.numTriangles -= this.numSquaresInGroup[0];
                    }
                    this.isTriangle.splice(0, (this.numSquaresInGroup[0] + 1));
                    this.timeArray.splice(0, 1);
                    this.numSquaresInGroup.splice(0, 1);
                }
            }
            else    {
                this.deleteMode = false;
            }
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();    
    
    // new begins the game 
    loop.start(myGame);
}