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
  // vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
  vec2 uv = (gl_FragCoord.xy) / u_resolution.xy;
  vec3 color = vec3(0.0, 0.0, 0.0);
  float d = distance(uv, vec2(0.5));
  float freq = u_frequency > 0. ? normalize(u_frequency) : 0.5;
  float time = u_time * .2;
  float red = sin(abs(time * freq + d + u_red));
  float green = (cos(abs(time * freq + d + u_green)));
  float blue = (sin(abs(time * freq + d + u_blue)));
  color = vec3(red, green, blue) * 0.5 + 0.5;
  gl_FragColor = vec4(color, 1.0);
}