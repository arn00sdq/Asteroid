import Component from './component.js';

class AsteroidMovement { 
    constructor(parent) {
      this.parent = parent;
      this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
      this.velocity = new THREE.Vector3(0,0,0);
    }
        
    InitComponent() {}

    Update(timeElapsed) {
      if(this.parent.children[0] !== null){
        this.parent.children[0].rotation.x = (this.parent.children[0].rotation.x + (Math.PI / 180) * timeElapsed * 10 );
        this.parent.children[0].rotation.y = (this.parent.children[0].rotation.y + (Math.PI / 180) * timeElapsed * 10 );
        this.parent.children[0].rotation.z = (this.parent.children[0].rotation.z + (Math.PI / 180) * timeElapsed * 10);
      }
      this.parent.translateZ(0.01 * ((this.parent.nbBreak*2) + 1));

    }
  };

export default AsteroidMovement