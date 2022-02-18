/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import MultiTextureShader from "../shaders/multi_texture_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";
 
// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let kMultiTextureVS = "src/glsl_shaders/multi_texture_vs.glsl";
let kMultiTextureFS = "src/glsl_shaders/multi_texture_fs.glsl";
let mTextureShader = null;
let mSpriteShader = null;
let mMultiTextureShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
   // mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mMultiTextureShader = new MultiTextureShader(kMultiTextureVS, kMultiTextureFS);
}

function cleanUp() {
    mConstColorShader.cleanUp();
    //mTextureShader.cleanUp();
    mSpriteShader.cleanUp();
    mMultiTextureShader.cleanUp();


    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
    text.unload(kMultiTextureVS);
    text.unload(kMultiTextureFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS),
                text.load(kTextureFS),
                text.load(kTextureVS),
                text.load(kMultiTextureFS),
                text.load(kMultiTextureVS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }
function getSpriteShader() { return mSpriteShader; }
function getMultiTextureShader() { return mMultiTextureShader; }

export {init, cleanUp, 
        getConstColorShader, getTextureShader, getSpriteShader, getMultiTextureShader}