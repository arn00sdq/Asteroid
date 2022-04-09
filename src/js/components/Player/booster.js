import {_noise} from "../Shader/AshimaNoise.js"

export function _VSBooster() {
    
    return `
    ${_noise()}

    varying vec3 vertexNormal;

    varying vec2 vUv;
    varying float noise;
    uniform float time;
    uniform float uniformZ;
    uniform float uniformX;
    uniform float boostPower;

    float turbulence( vec3 p ) {

    float w = 100.0;
    float t = -.5;

    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, boostPower ) ) / power );
    }

    return t;

    }

    void main() {
            
        vec3 scale = vec3(uniformX,0.01,uniformZ);
        vertexNormal = normalize(normalMatrix * normal );
        noise = 10.0 *  -.10 * turbulence( .5 * normal );
        float b = 5.0 * pnoise( 0.05 * position+ vec3( 2.0 * time ), vec3( 100.0 ) );
        float displacement = - noise + b;

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition * scale, 1.0);

    }`;

}

export function _FSBooster() {

    return `
        varying vec3 vertexNormal;
        
        void main() {
            
            float intensity = pow(0.5 - dot( vertexNormal, vec3(0,0,1.0)),2.0);
            gl_FragColor = vec4(0.3,0.6,1.0,1.0) * intensity;

        }`;
    
}