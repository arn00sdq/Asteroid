import {_noise} from "./AshimaNoise.js"

export function _VSExplosion() {
    
    return `
    ${_noise()}

    varying vec2 vUv;
    varying float noise;
    uniform float time;
    uniform float growTime;

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

    // add time to the noise parameters so it's animated
    noise = 10.0 *  -.10 * turbulence( .2 * normal + time * 10. );
   // float b = 5.0 * pnoise( 0.05 * position + vec3( 3.0 ), vec3( 5.) );
    float displacement = - noise + growTime ;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    }`;

}

export function _FSExplosion() {
    
    return `

   

    varying vec2 vUv;
    varying float noise;
    uniform sampler2D tExplosion;
    uniform float opacity;

    float random( vec3 scale, float seed ){
        return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
      }




    void main() {

        float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
        
        vec2 tPos = vec2( 0, 1.3  * noise + r  );
        vec4 color = texture2D( tExplosion, tPos );
        gl_FragColor = vec4( color.rgb, opacity );

    }`;
    
}