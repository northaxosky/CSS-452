"use strict";

import * as glSys from "../core/gl.js";
import Renderable from "./renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";
import TextureRenderable from "./texture_renderable.js";

class MultiTextureRenderable extends Renderable {
    constructor(texture, secondTexture, thirdTexture = null) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getMultiTextureShader());
        this.mTexture = texture;  // texture for this object, cannot be a "null"
        this.mSecondTexture = secondTexture;
        this.mSecondTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0, 0.1];  // u, v, w, h, theta
        this.mThirdTexture = thirdTexture;
        this.mThirdTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0, 0.1];
        this.isDisabled = [false, false];
    }

    draw(camera) {
        let enSecond = false;
        let enThird = false;

        texture.activate(this.mTexture, glSys.get().TEXTURE0);

        if (this.mSecondTexture != null && !(this.isDisabled[0])) {
            texture.activate(this.mSecondTexture, glSys.get().TEXTURE1);
            this.mShader.placeAtWithSize(this.mSecondTexturePlacement,
                this.getXform().getWidth() / this.getXform().getHeight());
            enSecond = true;
        }
        if (this.mThirdTexture != null && !(this.isDisabled[1])) {
            texture.activate(this.mThirdTexture, glSys.get().TEXTURE2);
            this.mShader.placeAtWithSize3(this.mThirdTexturePlacement,
                this.getXform().getWidth() / this.getXform().getHeight());
            enThird = true;
        }
        this.mShader.enableSecondTexture(enSecond);
        this.mShader.enableThirdTexture(enThird);
        super.draw(camera);

    }

    // TO DO vvvvvvvvvvvv

    setTexEffectMode(index, mode) {
        if (mode === "None")    {
            if (index === 1)    {
                this.mShader.enableSecondTexture(false);
            }
            else    {
                this.mShader.enableThirdTexture(false);
            }
            this.isDisabled[index - 1] = true;
        }
        if (mode === "Transparent") {
            this.setBlendFactor(index, 1);
            this.isDisabled[index - 1] = false;

        }
        if (mode === "Override")    {
            this.setBlendFactor(index, 0.0);
            this.isDisabled[index - 1] = false;
        }

        if (mode === "Blend")   {
            this.setBlendFactor(index, 0.3)
            this.isDisabled[index - 1] = false;
        }
    }

    setTexAtSize(index, parm) {
        let u = parm[0];
        let v = parm[1];
        let w = parm[2];
        let h = parm[3];
        let t = parm[4];
        if (index === 1) {
            this.setSecondTexture(u, v, w, h, t);
        } else {
            this.setThirdTexture(u, v, w, h, t);
        }
    }

    setBlendFactor(index, f) {
        if (index === 1)
            this.mSecondTexturePlacement[5] = f;
        if (index === 2)
            this.mThirdTexturePlacement[5] = f;
    }

    getTexAtSize(index, parm) { return true; }

    // TO DO ^^^^^^^^^^^^^^

    getBlendFactor(index) { return this.mBlendFactor[index]; }

    getTexMode(index) { return this.mEffectMode[index]; }

    setSecondTexture(u, v, w, h, t) {
        this.mSecondTexturePlacement[0] = u;
        this.mSecondTexturePlacement[1] = v;
        this.mSecondTexturePlacement[2] = w;
        this.mSecondTexturePlacement[3] = h;
        this.mSecondTexturePlacement[4] = t;
    }

    setThirdTexture(u, v, w, h, t) {
        this.mThirdTexturePlacement[0] = u
        this.mThirdTexturePlacement[1] = v
        this.mThirdTexturePlacement[2] = w
        this.mThirdTexturePlacement[3] = h
        this.mThirdTexturePlacement[4] = t
    }

    getTexture() { return this.mTexture; }
    setTexture(newTexture) {
        this.mTexture = newTexture;
    }
}

export default MultiTextureRenderable;