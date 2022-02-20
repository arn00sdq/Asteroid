class JokerMovement { 

    constructor(parent) {

      this.parent = parent;
      this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
      this.velocity = new THREE.Vector3(0,0,0);

    }
        
    InitComponent() {}

    Update(timeElapsed) {

      if(this.parent.children[0] !== null){

        this.parent.children[0].rotation.y = (this.parent.children[0].rotation.y + (Math.PI / 180) * 0.05 * 10 );

      }

    }

  };

export default JokerMovement