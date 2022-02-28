"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import ShakeVec2 from "../../engine/utils/shake_vec2.js";
import LerpVec2 from "../../engine/utils/lerp_vec2.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);

        // field values
        this.kDelta = 0.3;
        this.bbox = null;
        this.shake = null;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(35, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
        // this.mCenter = new LerpVec2([35, 50], 120, 0.05);
    }

    update(cam) {
        // this.mCenter.update();

        this.bbox = this.getBBox();


        

    }

    shakeDye() {
        let x = 4.5;
        let y = 6;
        let freq = 4;
        let dur = 60;

        this.shake = new ShakeVec2([x, y], [freq, freq], dur);
    }

    reShake() {
        if (this.shake !== null) {
            this.shake.reStart();
        }
    }

}

export default Hero;