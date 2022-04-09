export function _VSAT() {

    return `
        varying vec3 vertexNormal;
        void main() {
            
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        }`;

}

export function _FSAT() {

    return `
        varying vec3 vertexNormal;
        
        void main() {
            
            float intensity = pow(0.5 - dot( vertexNormal, vec3(0,0,1.0)),2.0);
            gl_FragColor = vec4(0.3,0.6,1.0,1.0) * intensity;

        }`;
    
}