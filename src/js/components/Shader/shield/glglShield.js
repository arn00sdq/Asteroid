import { voronoise3d } from "../Noise/VoronoiNoise.js";

const vs_shader = `

uniform vec2 resolution;

varying vec2 vUv;
varying float vRim;
varying float vDepth;
varying float vY;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vec3 n = normalMatrix * normal;
  vec4 viewPosition = modelViewMatrix * vec4( position, 1. );
  vec3 eye = normalize(-viewPosition.xyz);
  vRim = 1.0 - abs(dot(eye,n));
  vRim = pow(vRim, 5.);
  vY = position.y;
  vPosition = position;
  vec3 worldPosition = (modelMatrix * vec4(position, 1.)).xyz;  
  gl_Position = projectionMatrix * viewPosition;
  vDepth = gl_Position.z;
}
`;

export { vs_shader };

const fs_shader = `

#include <packing>

uniform sampler2D depthBuffer;
uniform vec2 resolution;
uniform float time;

varying vec2 vUv;
varying float vRim;
varying float vDepth;
varying float vY;
varying vec3 vPosition;

${voronoise3d}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 packedDepth = texture(depthBuffer, uv);
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    float depth = (vDepth - .1) / ( 10.0 -.1);
    float diff = abs(depth - sceneDepth);
    float contact = diff * 20.;
    contact = 1. - contact;
    contact = max(contact, 0.);
    contact = pow(contact, 20.);
    contact *= diff*1000.;
    float a = max(contact, vRim);
    float stripe = 1. * (.5 + .5 * cos(20.*vY - 0.02 * time ));
    float noise = VoronoiseN3(vPosition * 5. + vec3(0., -.005 * time, 0.), vec3(4.));
    float noise2 = VoronoiseN3(vPosition * 10. + vec3(0., -.0025 * time, 0.), vec3(4.));
    noise = noise + noise2 + stripe;
    a = (.9 *a * noise + .1 * noise) + a;// + a;
    float fade = 1. - pow(vRim, 10.);
    gl_FragColor = vec4(uv*2., 1., a * fade);
}
`;

export { fs_shader };