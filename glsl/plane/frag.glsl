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

void main() {
  gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.);
}