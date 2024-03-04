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
    // gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1.);
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);
    vec3 p = vec3(st - 0.5, 0.0);
    p.x *= st.x / st.y;
    float r = length(p);
    color = vec3(1.0, 0.2, sin(r * 10.0 + u_time * 2.0) * 0.1 + 0.1);
    gl_FragColor = vec4(color, 1.0);
}