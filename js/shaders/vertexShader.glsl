precision mediump float;

varying vec2 vUv;
uniform float time;
float PI = 3.14159;

void main(){
    vUv = (uv - vec2(0.5)) * 0.9 + vec2(0.5);
    vec3 pos = position;
    pos.y += sin(time * 0.5) * 5.0;

    pos.y += sin(PI * uv.x)* 5.0;
    pos.x += sin(PI * uv.x)* 5.0;
    vUv.y -= sin(time  * 0.5) * 0.005;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}