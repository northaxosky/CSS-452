attribute vec3 aVertexPosition;
attribute vec2 aTextureCoordinate;
attribute vec2 aTextureCoordinate2;
attribute vec2 aTextureCoordinate3;

varying vec2 vTexCoord;
varying vec2 vTexCoord2;
varying vec2 vTexCoord3;

uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

uniform mat3 uMyTexXfromMat;
uniform mat3 uMyTexXfromMat2;

void main(void) {
    gl_Position = uCameraXformMatrix * uModelXformMatrix * vec4(aVertexPosition, 1.0);


    vTexCoord = aTextureCoordinate;
    vTexCoord2 = (uMyTexXfromMat * vec3(aTextureCoordinate2, 1.0)).xy;
    vTexCoord3 = (uMyTexXfromMat2 * vec3(aTextureCoordinate3, 1.0)).xy;
}