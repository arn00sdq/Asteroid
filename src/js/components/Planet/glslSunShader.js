export function _VSSunShader() {

    return `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main(){   
            vertexUV = uv;
            vertexNormal = normalize( normalMatrix * normal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9 );
        }`;

}

export function _FSSunShader() {

    return `
        uniform sampler2D sunTexture;

        varying vec2 vertexUV;
        varying vec3 vertexNormal;
    
        void main(){
            float intensity = 1.05 - dot( vertexNormal, vec3(1.0,0.0,0.0));
            vec3 atmosphere = vec3(1.0,0.3 ,0.0) * pow(intensity,0.5);
            gl_FragColor = vec4(atmosphere + texture2D(sunTexture,vertexUV).xyz, 0.7 );
        }`;
    
}