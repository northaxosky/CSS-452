// This is the vertex shader 
//

attribute vec3 aVertexPosition;  // Vertex shader expects one vertex position
uniform vec2 uOffset;
uniform vec2 uScale;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = vec4(aVertexPosition, 1.0);
    gl_Position.x = gl_Position.x * uScale.x + uOffset.x;
    gl_Position.y = gl_Position.y * uScale.y + uOffset.y; 
}
