import GameManager from "./GameManager.js";

class GameObjectManager extends GameManager{

    constructor(scene,model) {

      super(scene);
      
      this.modelManager = model;
      this.edge_limit = 15;
      
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

    Asteroid_Subdivision(e){

      if(e.nbBreak < 2){

        for (let index = 1; index <= 2; index++) {

          let rVectorPos = new THREE.Vector3(e.position.x + Math.random() *  0.2, 0 ,
                                             e.position.z + Math.random() *  0.5);
          let rEuleurRot = new THREE.Euler(0, Math.random() *  ( ((Math.PI / 180) * 360) - ((Math.PI / 180) * 20) + 1) + ((Math.PI / 180) * 20) ,0);
          let scale = new THREE.Vector3(0.5,0.5,0.5);

          let asteroidProps = e.clone();
          asteroidProps.children[0].material = e.children[0].material.clone();
          this.SetCloneValue(asteroidProps,e);
          asteroidProps.Instantiate(asteroidProps, rVectorPos, rEuleurRot);

        }

      }

    }

    SetCloneValue(clone, original){

      clone.scene = this.scene;
      clone.nbBreak = original.nbBreak + 1;

    }

    collision_handler(e,e2){

      switch(e.constructor.name){

        case "BasicAsteroid":
          this.CollisionAsteroidHandler(e, e2);
          break;
          
        case "Player":
          this.CollisionPlayerHandler(e, e2);
          break;

        case "BasicBullet":
          e.Destroy(e);
          break;

      }

      switch(e2.constructor.name){

        case "BasicAsteroid":
          this.CollisionAsteroidHandler(e2, e);
          
          break;

        case "Player":
          this.CollisionPlayerHandler(e2, e);
          break;

        case "BasicBullet":
          e2.Destroy(e2);
          break;

      }

    }

    DetectEdge(object){  
      
      if(object.position.distanceTo(new THREE.Vector3(0,0,0) ) > this.edge_limit){

        object.position.x = - object.position.x
        object.position.y =   object.position.y
        object.position.z = - object.position.z

      }

    }

    CollisionPlayerHandler(player, object){
      
      let playerHealth = player.GetComponent("PlayerHealthSystem");

      if (object.name == "Asteroid"){

        playerHealth.Damage(1);
        player.Destroy(player);

        if(playerHealth.life > 0){

          player.Instantiate(player,new THREE.Vector3(0,0.2,0), new THREE.Euler(0,0,0),this.scene);
  
        }else{

          this.OnPlayerEnd();

        }

      }

    }

    CollisionAsteroidHandler(asteroid, object){

      let asteroidHealth = asteroid.GetComponent("AsteroidHealthSystem");

      if (object.name == "Player"){
          asteroidHealth.Damage("max")

      }

      if(object.name == "BasicBullet"){

        let bullet = object.GetComponent("BulletDamageSystem");
        asteroidHealth.Damage(bullet.damageAmount);

      }

      if(asteroidHealth.life == 0) {


          this.Asteroid_Subdivision(asteroid);
          asteroid.Destroy(asteroid);

      }

    }

    Update(timeElapsed) {

      let nbEnnemyFrame = 0;

      this.scene.children.forEach(e => {

        if(e.type == "Group"){

          if(e.name == "Asteroid"){

            nbEnnemyFrame++ ;

          } 
      
          this.Detect_collision()
          this.DetectEdge(e);

          e.Update(timeElapsed)

        }

      }); 

      this.CountEnnemy(nbEnnemyFrame);

    }

  }

  export default GameObjectManager