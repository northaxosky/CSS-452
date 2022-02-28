"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";    
import Oscillate from "../../engine/utils/oscillate.js";
import Shake from "../../engine/utils/shake.js";

let UPS = 120;
let FPS = 60;                             

class DyePack extends engine.GameObject {
    // DyePack Shake
    constructor(spriteTexture, x, y, creationTime) {
        super(null);

        // field values
        this.speed = UPS/FPS;
        this.dyeLifespan = 5000;
        this.shake = null;
        this.isOscillating = false;
        this.creationTime = creationTime;  
        this.mBounce2 = new engine.Oscillate(2, 20, 300);

        // idk how to destroy lmao
       
        this.valid = true;
       
        //  Renderable 
        if(spriteTexture==="assets/Stellar_Striker.png"){
            this.mRenderComponent = new engine.TextureRenderable(spriteTexture);
            this.mRenderComponent.setColor([1, 1, 1, 0.1]);
            this.mRenderComponent.getXform().setSize(5, 7.5);
            this.mRenderComponent.getXform().setRotationInDegree(-55);
            this.mRenderComponent.getXform().setPosition(x, y);  

        }else{
            this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
            this.mRenderComponent.setColor([1, 1, 1, 0.1]);
            this.mRenderComponent.getXform().setSize(2, 3.25);
            this.mRenderComponent.getXform().setRotationInDegree(90);
            this.mRenderComponent.getXform().setPosition(x, y);  
            this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
        }
        
        this.setSpeed(120);  
    }

    update(camera) {
        this.lifespanMove();
        this.checkBounds(camera);
        if (performance.now() - this.creationTime > this.dyeLifespan || this.speed === 0 || (this.mRenderComponent.getXform().getXPos() >= 
        (camera.getWCWidth() / 2 + camera.getWCCenter()[0]))) {
            this.valid = false; 
        } 

        if (this.isOscillating) {
            if (!this.mBounce2.done()) {
                let d = this.mBounce2.getNext();
                this.mRenderComponent.getXform().incXPosBy(d);
            }

            if (this.mBounce2.done()) {
                this.dyePacks[i].isOscillating = false;
                this.dyePacks[i].valid = false;
            }
        }
    }

    lifespanMove()  {
        // Decrease Lifespan and move the dye if it isnt tweaking
        if (!this.isOscillating)    {  
            this.mRenderComponent.getXform().incXPosBy(this.speed);
        }
    }

    checkBounds(camera)   {
        if ((this.mRenderComponent.getXform().getXPos() >= 
        (camera.getWCWidth() / 2 + camera.getWCCenter()[0])) ) {
            this.valid = false;
        }
    }

    // For shaking the dye when it comes in contact
    shakeDye()  {
        let x = 4;
        let freq = 20;
        let dur = 300;   

        this.shake = new Shake(x, freq, dur);
    }

    reShake() {
        if (this.shake !== null) {
            this.shake.reStart(); 
        }
    }

    decelerate() {
        if (this.speed > 0) {
            this.speed -= 0.1;
        }else{
            this.valid = false;
        }
    }
}

export default DyePack;