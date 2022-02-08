import Component from './component.js';

    class AsteroidMovement { // composant script
        constructor(parent) {
          this.parent = parent;
          this.acceleration = new THREE.Vector3(1, 0.125, 2.0);
          this.velocity = new THREE.Vector3(0,0,0);
          this.speed = 0.0
        }
    
        InitComponent() {}
    
        Update(timeInSeconds) {
          const velocity = this.velocity;

          velocity.add(frameDecceleration);  
          const controlObject = this.parent;

        }
      };

      export default AsteroidMovement