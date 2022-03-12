import GameObject from "../GameObject.js";

class Explosion extends GameObject { 

    constructor(scene) {;
        
        super(scene);

        const _VS = `
        attribute float size;
        attribute float angle;

        varying vec3 vColor;
        varying vec2 vAngle;

        void main() {

            vColor = color;

            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size / gl_Position.w;

            vAngle = vec2(cos(angle), sin(angle));

           
        }`;

        const _FS = `
        uniform sampler2D pointTexture;

        varying vec3 vColor;
        varying vec2 vAngle;

        void main() {

            vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;

            gl_FragColor = vec4( vColor, 1.0 );

            gl_FragColor = gl_FragColor * texture2D( pointTexture, coords );

        
        }`;

        const uniforms = {

            pointTexture: { value: new THREE.TextureLoader().load('../medias/images/explosion.jpg') }

        };

        this.shaderMaterial = new THREE.ShaderMaterial({

            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true

        });

        this.particles = []

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3));
        this.geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
        this.geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

        this.particleSystem = new THREE.Points(this.geometry, this.shaderMaterial);

        this.add(this.particleSystem)

        this.AddParticles()
        this.UpdateGeometry();
    }

    AddParticles(timeElapsed) { 
        for (let i = 0; i < 10; i++) {
          const life = (Math.random() * 0.75 + 0.25) * 10.0;
          this.particles.push({
              position: new THREE.Vector3(
                (Math.random() * 0.5 - 0.25) * 0.2,
                (Math.random() * 0.5 - 0.25) * 0.2,
                (Math.random() * 0.5 - 0.25) * 0.2),
              size: (Math.random() * 10 + 5) * 4.0,
              colour: new THREE.Color(),
              alpha: 1.0,
              life: life,
              maxLife: life,
              rotation: Math.random() * 2.0 * Math.PI,
              velocity: new THREE.Vector3(0, -15, 0),
          });
        }
    }

    UpdateGeometry(){

        const positions = [];
        const colours = [];
        const sizes = [];
        const angles = [];

        for (let p of this.particles) {

            positions.push(p.position.x, p.position.y, p.position.z);
            colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
            sizes.push(p.size);
            angles.push(p.rotation);
            
          }
    
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colours, 3));
        this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))/*.setUsage(THREE.DynamicDrawUsage));*/
        this.geometry.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1));


    }

    UpdateParticles(timeElapsed) {
      /*  for (let p of this.particles) {
          p.life -= timeElapsed;
        }
    
        this.particles = this.particles.filter(p => {
          return p.life > 0.0;
        });
    
        for (let p of this.particles) {
          const t = 1.0 - p.life / p.maxLife;*/
    
          //p.rotation += timeElapsed * 0.5;
         // p.alpha = this._alphaSpline.Get(t);
         // p.currentSize = p.size * this._sizeSpline.Get(t);
          //p.colour.copy(this._colourSpline.Get(t));
    
       /* this.particles.sort((a, b) => {
          const d1 = this._camera.position.distanceTo(a.position);
          const d2 = this._camera.position.distanceTo(b.position);
    
          if (d1 > d2) {
            return -1;
          }
    
          if (d1 < d2) {
            return 1;
          }
    
          return 0;
        });
      }*/

    }

    Instantiate(o,p,r,s){
        
        console.log(o)
        super.Instantiate(o,p,r,s);

        o.position.copy(p);

        this.scene.add(o);
        
    }


    Update(timeElapsed){

        this.UpdateParticles(0.016);
        this.UpdateGeometry();

    }

}

export default Explosion
