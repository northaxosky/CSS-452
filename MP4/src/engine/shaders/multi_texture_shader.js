"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import SimpleShader from "./simple_shader.js";

class MultiTextureShader extends SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        super(vertexShaderPath, fragmentShaderPath);
        this.mTexMat = mat3.create();
        this.mDiffMat = mat3.create();

        this.mTextureCoordinateRef = null;
        this.mHasSecondTexture = false;
        this.mHasThirdTexture = false;

        let gl = glSys.get();
        this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");

        this.mTextureCoordinateRef2 = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate2");
        this.mSecondTextureRef = gl.getUniformLocation(this.mCompiledShader, "uSecondTexture");
        this.mHasSecondTextureRef = gl.getUniformLocation(this.mCompiledShader, "uHasSecondTexture");
        this.Blendref = gl.getUniformLocation(this.mCompiledShader, "rWeight");
        this.blendNum = 0.5;

        this.mTextureCoordinateRef3 = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate3");
        this.mThirdTextureRef = gl.getUniformLocation(this.mCompiledShader, "uThirdTexture");
        this.mHasThirdTextureRef = gl.getUniformLocation(this.mCompiledShader, "uHasThirdTexture");
        this.Blendref2 = gl.getUniformLocation(this.mCompiledShader, "rWeight2");
        this.blendNum2 = 0.5;

        let initTexCoord = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        let initTexCoord3 = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        this.mSecondTextureCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);

        this.mThirdTextureCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord3), gl.DYNAMIC_DRAW);
    }

    activate(pixelColor, trsMatrix, cameraMatrix) {
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.vertexAttribPointer(this.mTextureCoordinateRef2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.mTextureCoordinateRef2);
        gl.uniformMatrix3fv(gl.getUniformLocation(this.mCompiledShader, "uMyTexXfromMat"), false, this.mTexMat);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.vertexAttribPointer(this.mTextureCoordinateRef3, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.mTextureCoordinateRef3);
        gl.uniformMatrix3fv(gl.getUniformLocation(this.mCompiledShader, "uMyTexXfromMat2"), false, this.mDiffMat);


        gl.uniform1i(this.mSamplerRef, 0);
        gl.uniform1i(this.mSecondTextureRef, 1);
        gl.uniform1i(this.mThirdTextureRef, 2);
        gl.uniform1i(this.mHasSecondTextureRef, this.mHasSecondTexture);
        gl.uniform1i(this.mHasThirdTextureRef, this.mHasThirdTexture);
        gl.uniform1f(this.Blendref, this.blendNum);
        gl.uniform1f(this.Blendref2, this.blendNum2);

    }

    enableSecondTexture(en) {
        this.mHasSecondTexture = en;
    }

    enableThirdTexture(en) {
        this.mHasThirdTexture = en;
    }

    placeAtWithSize(placement, ratio) {
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];
        let t = placement[4];
        this.blendNum = placement[5];

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft, useTop,
            useRight, useBot,
            useLeft, useBot]));

        this.mTexMat = mat3.create();

        mat3.identity(this.mTexMat);
        mat3.scale(this.mTexMat, this.mTexMat, [1.0 / w, 1.0 / h]); // scale such that top-right is (1, 1)
        mat3.translate(this.mTexMat, this.mTexMat, [-left, -bottom]); // bottom-left is now (0, 0)
        mat3.translate(this.mTexMat, this.mTexMat, [u, v]); // return to original position
        mat3.rotate(this.mTexMat, this.mTexMat, -t);  // rotation wrt to center of u,v
        mat3.translate(this.mTexMat, this.mTexMat, [-u, -v]);
    }

    placeAtWithSize3(placement, ratio) {
        // How to use aspectRatio?
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];
        let t = placement[4];
        this.blendNum2 = placement[5];

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft, useTop,
            useRight, useBot,
            useLeft, useBot]));

        this.mDiffMat = mat3.create();

        mat3.identity(this.mDiffMat);
        mat3.scale(this.mDiffMat, this.mDiffMat, [1.0 / w, 1.0 / h]); // scale such that top-right is (1, 1)
        mat3.translate(this.mDiffMat, this.mDiffMat, [-left, -bottom]); // bottom-left is now (0, 0)
        mat3.translate(this.mDiffMat, this.mDiffMat, [u, v]); // return to original position
        mat3.rotate(this.mDiffMat, this.mDiffMat, -t);  // rotation wrt to center of u,v
        mat3.translate(this.mDiffMat, this.mDiffMat, [-u, -v]);
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default MultiTextureShader;