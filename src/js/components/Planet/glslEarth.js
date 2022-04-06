export function _VS() {

    return `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main() {
            vertexUV = uv;
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
        }`;

}

export function _FS() {

    return `
        uniform sampler2D globeTexture;

        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        
        void main() {
            
            float intensity = 1.05 - dot( vertexNormal, vec3(1.0,0.0,0.0));
            vec3 atmosphere = vec3(0.1,0.2 ,0.4) * pow(intensity,1.0);
            gl_FragColor = vec4(texture2D(globeTexture,vertexUV).xyz, 1.0 );

        }`;
    
}