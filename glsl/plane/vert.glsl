#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;

#include ../utils/pnoise.glsl

uniform float u_frequency;

void main() {
    float noise = 3.0 * pnoise(position + u_time, vec3(10.0));
    float displacement = (u_frequency / 30.) * (noise / 10.);
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}