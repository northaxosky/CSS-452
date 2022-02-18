/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "./core/gl.js";
import * as shaderResources from "./core/shader_resources.js";
import Transform from "./transform.js";
import * as vertexBuffer from "./core/vertex_buffer.js";

class Renderable {
    constructor() {
        this.mShader = shaderResources.getConstColorShader();   // the shader for shading this object
        this.mColor = [1, 1, 1, 1];     // color of pixel
        this.mXform = new Transform();  // the transform object 
    }

    drawSquare(camera) {
        let gl = glSys.get();
        this.mShader.activate(vertexBuffer.get(), this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    drawTriangle(camera)    {
        let gl = glSys.get();
        this.mShader.activate(vertexBuffer.getTriangle(), this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }

    getXform() { return this.mXform; }
    
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }
}

export default Renderable;