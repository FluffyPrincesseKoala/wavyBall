#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float u_frequency;
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // If distance is less than radius, shade as circle
    float radiusIn = 0.5;
    float radiusOut = 1.0;

    bool isDiscard = false;

    float d2 = sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y);

    // d2 = fract(d2 * sin(u_time * .5));
    // d2 = fract(d2 * -sin(u_frequency * .0025));

    if(d2 > radiusIn && d2 < radiusOut) {
        isDiscard = true;
    }
    float r = u_red;
    float g = u_green;
    float b = u_blue;
    if(isDiscard) {
        // gl_FragColor = vec4(b, r, g, 1.0);
        discard;
    } else {
        gl_FragColor = vec4(r, g, b, 1.0);
    }
    gl_FragColor = vec4(r, g, b, 1.0);
}