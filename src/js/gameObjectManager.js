import BasicAsteroid from "./components/AsteroidMesh.js";
import { Euler, Vector3 } from '../js/three/three.module.js';

class GameObjectManager{
    constructor(scene, model) {
      this.scene = scene;
      this.modelManager = model;
    }

    Detect_collision() {
      this.scene.children.forEach( e => { 
        if( e.BB && e.children[0]){
          this.scene.children.forEach(e2 => {
            if((e !== e2) &&  (e2.BB && e.BB) && e2.children[0] && e.children[0]){
              let otherBB = new THREE.Box3().copy( e2.BB ).applyMatrix4( e2.children[0].matrixWorld );
              let otherBS = new THREE.Sphere().copy( e2.BS ).applyMatrix4( e2.children[0].matrixWorld );
              let collisionB = new THREE.Box3().copy( e.BB ).applyMatrix4( e.children[0].matrixWorld ).intersectsBox( otherBB );
              let collisionS = new THREE.Sphere().copy( e.BS ).applyMatrix4( e.children[0].matrixWorld ).intersectsBox( otherBS );
              if (collisionB && collisionS) {
                this.collision_handler(e,e2)
              }
            }
          })
        }
      })
    }

    collision_handler(e,e2){
      switch(e.constructor.name){
        case "BasicAsteroid":
          
          this.Asteroid_Subdivision(e);
          console.log(this.scene)
          e.Destroy(e);
          break;
        case "Player":
          e.Destroy(e);
          break;
        case "BasicBullet":
          e.Destroy(e);
          break;
      }

      switch(e2.constructor.name){
        case "BasicAsteroid":
          this.Asteroid_Subdivision(e2);
          e2.Destroy(e2);
          break;
        case "Player":
          e2.Destroy(e2);
          break;
        case "BasicBullet":
          e2.Destroy(e2);
          break;
      }
    }

    Asteroid_Subdivision(e){
      if(e.nbBreak < 2){
        for (let index = 1; index <= 2; index++) {
          let rVectorPos = new THREE.Vector3(e.position.x + Math.random() *  0.2, 0 ,
                                             e.position.z + Math.random() *  0.5);
          let rEuleurRot = new Euler(0, Math.random() *  ((Math.PI / 180) * 180) ,0);
          let scale = new Vector3(0.5,0.5,0.5);

          let asteroidProps = e.clone();
          this.SetCloneValue(asteroidProps,e);
          asteroidProps.Instantiate(asteroidProps, rVectorPos, rEuleurRot, this.scene);
        }
      }
    }

    SetCloneValue(clone, original){
      clone.scene = this.scene;
      clone.nbBreak = original.nbBreak + 1;
    }

    Update(timeElapsed) {
      this.scene.children.forEach(e => {
        if(e.type == "Group"){
          e.Update(timeElapsed)
        }
      }); 
      this.Detect_collision()
    }
  }

  export default GameObjectManager