/*
 * File: vertex_buffer.js
 *  
 * defines the module that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gl context
 * 
 */
"use strict";

import * as core from "./core.js";

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;
function get() { return mGLVertexBuffer; }

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// Vertices for a triangle
let mVerticesOfTriangle = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
];

// Circle
// Variable to determine number of vertices in a circle
let mCircleNumVertices = 50;

let mVerticesOfCircle = [];

// Function to calculate the vertices of a circle given num of vertices
function calcVerticesOfCircle(num) {
    let arr = [];
    var delta = (2.0 * Math.PI) / (num - 1);
    for(let i = 0; i <= num; i++)   {
        var angle = (i - 1) * delta;
        arr.push(Math.cos(angle) / 2);
        arr.push(Math.sin(angle) / 2);
        arr.push(0);
    }
    return arr;
}

mVerticesOfCircle = calcVerticesOfCircle(mCircleNumVertices);

// Use this function to find the vertices for shapes with n sides
function calcVerticesUsingSides(n)   {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let x = Math.cos(2 * Math.PI * i / n);
        let y = Math.sin(2 * Math.PI * i / n);
        arr.push(x); arr.push(y); arr.push(0);
    }
    return arr;
}

//  Vertices found using the function
let mVerticesOfHexagon = calcVerticesUsingSides(6);
let mVerticesOfOctagon = calcVerticesUsingSides(8);

function init(vertexArray) {
    let gl = core.getGL();
    
    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();
       
    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
}

 // export these symbols
export {init, get, mVerticesOfSquare, mVerticesOfTriangle, mVerticesOfCircle, mVerticesOfHexagon, mVerticesOfOctagon}