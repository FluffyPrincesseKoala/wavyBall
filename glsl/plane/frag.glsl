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
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(0.0);
  float d = distance(st, vec2(0.5));
  float freq = u_frequency > 0. ? normalize(u_frequency) : 1.0;
  color = vec3(sin(u_time * freq + d * 10.0), cos(u_time * freq + d * 10.0), fract(u_time * freq + d * 10.0)) * 0.5 + 0.5;
  gl_FragColor = vec4(color, 1.0);
    //
  // gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.);
}