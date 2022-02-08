import BasicAsteroid from "./components/AsteroidMesh.js";
import { Vector3 } from "./three.module.js";

class GameObjectManager{
    constructor(scene) {
      this.entities = [];
      this.scene = scene;
    }

    Add(e) {
      this.entities.push(e);
    }
    
    Delete(e){
      this.entities.forEach(function(item,index,array) {
        if(item.uuid == e.parent.uuid) {
            array.splice(array.indexOf(item), 1);
        }
      });
    }

    Detect_collision() {
      this.scene.children.forEach( e => { 
        if( e.mesh){
          this.scene.children.forEach(e2 => {
            if(e !== e2 &&  e2.mesh && e.mesh){
              let otherBB = new THREE.Box3().copy( e2.mesh.BB ).applyMatrix4( e2.mesh.matrixWorld );
              let otherBS = new THREE.Sphere().copy( e2.mesh.BS ).applyMatrix4( e2.mesh.matrixWorld );
              
              let collisionB = new THREE.Box3().copy( e.mesh.BB ).applyMatrix4( e.mesh.matrixWorld ).intersectsBox( otherBB );
              let collisionS = new THREE.Sphere().copy( e.mesh.BS ).applyMatrix4( e.mesh.matrixWorld ).intersectsBox( otherBS );
              console.log(this.scene.children)
              if (collisionB && collisionS) {
                this.collision_handler(e,e2)
              }
            }
          })
        }
      })
    }

    collision_handler(e,e2){
      //console.log(e.constructor.name,e2.constructor.name)
      switch(e.constructor.name){
        case "BasicAsteroid":
          e.Destroy(e);
          this.Asteroid_Subdivision(e);
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
          e2.Destroy(e2);
          this.Asteroid_Subdivision(e2);
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
      console.log(e.position)
      if(e.nbBreak < 2){
        for (let index = 1; index <= 2; index++) {
          console.log(Math.random() *  (index - index/2) + index/2)
          let rVectorPos = new THREE.Vector3(e.position.x + Math.random() *  0.2, 0 ,
                                             e.position.z + Math.random() *  0.5);
          let rEuleurRot = e.rotation;
          let scale = new Vector3(0.5,0.5,0.5);
          let asteroidProps = new BasicAsteroid(this.scene,e.nbBreak+1,scale);
          asteroidProps.Instantiate(asteroidProps, rVectorPos, rEuleurRot, this.scene);
          
        }
      }
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