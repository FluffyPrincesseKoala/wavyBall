#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform float u_frequency;

#include ../utils/pnoise.glsl
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // calculate the uv coordinates
    vUv = vec2(uv.x, uv.y);
    vPosition = position;
    float noise = 3.0 * pnoise(position + u_time, vec3(1.0));
    // float noise2 = 3.0 * pnoise(position + u_time, vec3(10.0));
    float noise2 = 3.0 * noised(position).z;
    float displacement = (u_frequency / 40.) * ((noise / 10.) + (noise2 / 10.) / 2.0);
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}