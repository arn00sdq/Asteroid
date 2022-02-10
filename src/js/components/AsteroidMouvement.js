import Component from './component.js';

class AsteroidMovement { 
    constructor(parent) {
      this.parent = parent;
      this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
      this.velocity = new THREE.Vector3(0,0,0);
    }
        
    InitComponent() {}

    Update(timeElapsed) {
      /*if(this.parent.mesh !== null){
        this.parent.rotation.x = (this.parent.rotation.x + (Math.PI / 180) * timeElapsed * 10 );
        this.parent.rotation.y = (this.parent.rotation.y + (Math.PI / 180) * timeElapsed * 10 );
        this.parent.rotation.z = (this.parent.rotation.z + (Math.PI / 180) * timeElapsed * 10);
      }*/

      this.parent.translateZ(0.01 * this.parent.nbBreak);

    }
  };

export default AsteroidMovement