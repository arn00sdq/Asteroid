import * as THREE from 'three';

class ShieldShader { 

    constructor(parent) {

      this.parent = parent;
      this.speedRotation = 10;

    }
        
    InitComponent() {}

    Update(timeElapsed) {

        let mesh = this.parent.children.find(e => e.constructor.name == "Mesh");
        // shield.material.uniforms.time.value = performance.now();
        mesh.material.uniforms.time.value = window.performance.now() * 0.5;

    }

  };

export default ShieldShader