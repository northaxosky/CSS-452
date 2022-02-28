// Create Head Class

import GameObject from "../../engine/game_objects/game_object.js";
import engine from "../../engine/index.js";

class Head extends engine.GameObject {
    constructor(texture, x, y) {
        super(null);
        this.mRenderComponent = new engine.SpriteRenderable(texture);

        // different sprite textures
        if (texture === "assets/minion_sprite.png") {
            this.mRenderComponent.setElementPixelPositions(600, 700, 0, 180);
        } else {
            this.mRenderComponent.setElementPixelPositions(120, 310, 0, 180); 
        }
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.getXform().setPosition(x, y);
        

        
        // divide by 60 to get into units/second
        this.setSpeed((Math.random() * 5 + 5) / 60);


        let fdir = this.getCurrentFrontDir();
        vec2.rotate(fdir, fdir, Math.random() * 2 * Math.PI);
        this.setCurrentFrontDir(fdir);

        this.boundingBox = this.getBBox();
       



    }

    update() {
        super.update();
        this.boundingBox = this.getBBox();
    }

    heroHit() {
    }

    dyeHit() {
        this.mRenderComponent.getXform().incXPosBy(5);
    }

}

export default Head;