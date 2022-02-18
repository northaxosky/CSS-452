"use strict";

import engine from "../engine/index.js";

class Hero {
    constructor(spriteTexture, atX, atY)    {
        this.kDelta = 0.03;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(0.45, 0.6);
    }

    update()    {
        let xform = this.mRenderComponent.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incXPosBy(this.kDelta);
        }
    }

    draw(cam)   {
        this.mRenderComponent.draw(cam);
    }
}

export default Hero;