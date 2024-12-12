precision mediump float;

varying vec2 vUv;
uniform float time;
uniform float dist;
float PI = 3.14159;

uniform sampler2D uTexture; // Renamed from 'texture' to 'uTexture'

void main() {
    vec4 color = texture2D(uTexture, vUv);
    float bw = (color.r + color.g + color.b) / 3.0;
    vec4 color2 = vec4(bw, bw, bw, 1.0);
    gl_FragColor = mix(color2, color, dist);
    gl_FragColor.a = clamp(dist, 0.4, 1.0);
}