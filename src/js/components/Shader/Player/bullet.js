import {_noise} from "../Noise/AshimaNoise.js"

export function _VSBullet() {
    
    return `
    ${_noise()}

    varying vec2 vUv;
    varying float noise;
    uniform float time;

    varying vec3 vertexNormal;

    float turbulence( vec3 p ) {

    float w = 100.0;
    float t = -.5;

    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }

    return t;

    }

    void main() {

        vUv = uv;
        vertexNormal = normalize(normalMatrix * normal );
        // add time to the noise parameters so it's animated
        noise = 10.0 *  -.10 * turbulence( .2 * normal + time * 10. );
    // float b = 5.0 * pnoise( 0.05 * position + vec3( 3.0 ), vec3( 5.) );
        float displacement = - noise + 0.1 ;

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    }`;

}

export function _FSBullet() {
    
    return `

    varying vec3 vertexNormal;
    varying vec2 vUv;
    varying float noise;

    void main() {

        float intensity = pow(0.5 - dot( vertexNormal, vec3(1.,1.,1.0)),2.0);
        gl_FragColor = vec4(0.3,0.6,1.0,0.5) * intensity;

    }`;
    
}