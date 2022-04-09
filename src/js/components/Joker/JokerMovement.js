import * as THREE from 'three';

class JokerMovement { 

    constructor(parent) {

      this.parent = parent;
      this.speedRotation = 10;

    }
        
    InitComponent() {}

    Update(timeElapsed) {

      if(this.parent.children[0] !== null){

          this.parent.children[0].rotateY((Math.PI / 180) * timeElapsed * this.speedRotation);
        } 
        

    }

  };

export default JokerMovement