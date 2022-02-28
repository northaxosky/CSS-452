 // Create Patrol Class

import engine from "../../engine/index.js";
import Head from "./head.js";
import Wing from "./Wing.js";

class Patrol extends engine.GameObject  {
    constructor(texture, wingTexture, camera)    {
        super(null);
        //set for bounding boxes?
        this.mRenderComponent = new engine.SpriteRenderable(texture);
        // used later for reflecting
        this.mCamera = camera;
        let x = (Math.random()*41.25+50)/100 * camera.getWCWidth();
        let y = (Math.random()*50+25)/100 * camera.getWCHeight();

        // Components of patrol
        this.head = new Head(texture,x,y);
        this.topWing = new Wing(wingTexture, x + 10, y + 6, x, y);
        this.bottomWing = new Wing(wingTexture, x + 10, y - 6, x, y);

        // field values
        this.valid = true;
        this.boundingBox = this.getBoundingBox();
        
    }

    draw(cam)  {
        this.head.draw(cam);
        this.topWing.draw(cam);
        this.bottomWing.draw(cam);
    }

    update(){

      this.boundingBox = this.getBoundingBox();

      // bounce off the top
      if(this.boundingBox.centerPosition[1]+this.boundingBox.mHeight/2> this.mCamera.getWCHeight()){
        let norm = vec2.fromValues(0, -1)
        this.head.setCurrentFrontDir(this.reflect(this.head.getCurrentFrontDir(),norm, "top"));
      }
      //bounce off left
      if(this.boundingBox.centerPosition[0]-this.boundingBox.mWidth/2<=0){
      
        let norm = vec2.fromValues(1, 0)
        this.head.setCurrentFrontDir(this.reflect(this.head.mCurrentFrontDir,norm, "left"));
      }//bounce off bottom
      if(this.boundingBox.centerPosition[1]-this.boundingBox.mHeight/2<0){
        let norm = vec2.fromValues(0, 1)
        this.head.setCurrentFrontDir(this.reflect(this.head.getCurrentFrontDir(),norm, "bottom"));
      }

      this.topWing.interpolateValue(this.head.getXform().getPosition(), "top");
      this.bottomWing.interpolateValue(this.head.getXform().getPosition(), "bottom");
      this.head.update();
      this.topWing.update();
      this.bottomWing.update();
      
      this.checkDeath()

    }
    // we didn't actually have to vector math
    // but we did it anyways. Please give some extra credit or mercy points to us. We beg. :))))))
    reflect(vector, normal, direction) {
      let reflect = vec2.clone(vector);
      reflect = vec2.scale(reflect, normal, -2 * vec2.dot(vector, normal));
      reflect = vec2.add(reflect, reflect, vector);
      if (direction === "bottom") {
        reflect[1] = Math.abs(reflect[1])
      } else if (direction === "top") {
        if (reflect[1] > 0) {
          reflect[1] = -reflect[1];
        }
      }
      return reflect;
    }


    checkDeath(){
   
      if(this.boundingBox.mLL[0]>this.mCamera.getWCWidth()){
        this.valid=false
      }

      if(this.bottomWing.getAlpha()>=1||this.topWing.getAlpha()>=1){
        this.valid=false
      }
      
    }

    getBoundingBox()    {
        // Position and sizes for all components
        let tWPos = this.topWing.getXform().getPosition();
        let tWSize = this.topWing.getXform().getSize();

        let bWPos = this.bottomWing.getXform().getPosition();
        let bWSize = this.bottomWing.getXform().getSize();

        let hPos = this.head.getXform().getPosition();
        let hSize = this.head.getXform().getSize();

        let cornerBR = [bWPos[0] + bWSize[0] / 2, bWPos[1] - bWSize[1] / 2]; //bottom right cornerz
        let headLL = [hPos[0] - hSize[0] / 2, hPos[1] - hSize[1] / 2]; // lower left corner of head
        let topWingTR = [tWPos[0] - tWSize[0] / 2, tWPos[1] + tWSize[1] / 2]; // top right corner of up wing

        let BoxLL = [headLL[0], cornerBR[1]]; // lower left corner of the BBox

        let boxHeight = (topWingTR[1] - cornerBR[1]) * 1.5;
        let boxWidth = cornerBR[0] - BoxLL[0];
        let centerPosition = [BoxLL[0] + boxWidth / 2, cornerBR[1] + boxHeight / 2];
        this.boundingBox = new engine.BoundingBox(centerPosition, boxWidth, boxHeight);
        return this.boundingBox;
    }

}

export default Patrol;