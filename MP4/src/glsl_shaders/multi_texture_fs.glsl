precision mediump float;

uniform sampler2D uSampler;

uniform bool uHasSecondTexture;
uniform sampler2D uSecondTexture;

uniform bool uHasThirdTexture;
uniform sampler2D uThirdTexture;

uniform vec4 uPixelColor;

varying vec2 vTexCoord;
varying vec2 vTexCoord2;
varying vec2 vTexCoord3;

uniform float rWeight;
uniform float rWeight2;

void main(void) {
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));

    vec3 r = vec3(c) * (1.0 - uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    float a = c.a;

    if (uHasSecondTexture &&
        (vTexCoord2.s >= 0.0) &&
        (vTexCoord2.s <= 1.0) &&
        (vTexCoord2.t >= 0.0) &&
        (vTexCoord2.t <= 1.0)
    )   {
        vec4 c2 = texture2D(uSecondTexture, vec2(vTexCoord2.s, vTexCoord2.t));

        if (c2.a > 0.8) {
            vec3 blendColor = ((1.0 - rWeight) * vec3(c2));
            r = r * rWeight + blendColor;
            a = length(blendColor) + ((1.0 - rWeight)) * a;
        }
    }

    if (uHasThirdTexture &&
        (vTexCoord3.s >= 0.0) &&
        (vTexCoord3.s <= 1.0) &&
        (vTexCoord3.t >= 0.0) &&
        (vTexCoord3.t <= 1.0)
    )   {

        vec4 c3 = texture2D(uThirdTexture, vec2(vTexCoord3.s, vTexCoord3.t));

        if (c3.a > 0.8) {
            vec3 blendColor = ((1.0 - rWeight2) * vec3(c3));
            r = r * rWeight2 + blendColor;
            a = length(blendColor) + ((1.0 - rWeight2)) * a;
        }
    }
    vec4 result = vec4(r, a);
    gl_FragColor = result;
}