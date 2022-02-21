class GameObjectManager{

    constructor(parent) {
      
      this.parent = parent;
      this.edge_limit = 15;

      this.level_sys_comp = this.parent.GetComponent("LevelSystem");
      
    }

    Detect_collision() {

      this.parent.scene.children.forEach( e => { 

        if( e.BB && e.children[0]){

          this.parent.scene.children.forEach(e2 => {

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

          let position = new THREE.Vector3(e.position.x + Math.random() *  0.2, 0 ,
                                             e.position.z + Math.random() *  0.5);
          let rotation = new THREE.Euler(0, Math.random() *  ( ((Math.PI / 180) * 360) - ((Math.PI / 180) * 20) + 1) + ((Math.PI / 180) * 20) ,0);
          let scale = Math.pow(0.75 , e.nbBreak);

          this.level_sys_comp.InstantiateAsteroid(e , position,rotation, scale)

        }

      }

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
          this.CollisionBulletHandler(e, e2);
          break;

        case "Heart":
          this.CollisionHeartHandler(e, e2);
          break;

        case "Coin":
          this.CollisionCoinHandler(e, e2);
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
          this.CollisionBulletHandler(e2, e);
          break;

        case "Heart":
            this.CollisionHeartHandler(e2, e);
            break;

        case "Coin":
            this.CollisionCoinHandler(e, e2);
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

        if(player.life > 0){

          player.Instantiate(player,new THREE.Vector3(0,0.2,0), new THREE.Euler(0,0,0),this.parent.scene);
  
        }else{

          this.parent.OnPlayerEnd();

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

      if(asteroid.life == 0) {

          this.Asteroid_Subdivision(asteroid);
          asteroid.Destroy(asteroid);

      }

    }

    CollisionBulletHandler(bullet, object){

      if(bullet.name == object.name) return;

      if(object.name == "Player"){

        bullet.Destroy(bullet)

      };

      if(object.name == "Asteroid"){

        bullet.Destroy(bullet)

      };

    }

    CollisionCoinHandler(coin, object){

      if(coin.name == "Coin" && coin.mesh !== null){

        coin.Destroy(coin);
        this.parent.PlayerAddCoin(1);

      }

    }

    CollisionHeartHandler(heart, object){
      
      if(heart.name == "Heart" && heart.mesh !== null){

        heart.Destroy(heart);
        this.parent.PlayerAddLife(1);

      }

    }


    Update(timeElapsed) {

      let nbEnnemyFrame = 0; let playerLife; let countBullet = 0;

      let displayComponent = this.parent.GetComponent("DisplaySystem")

      this.parent.scene.children.forEach(e => {

        if(e.type == "Group"){

          if(e.name == "Asteroid") nbEnnemyFrame++ ;

          if(e.name == "Player") playerLife = e.life ;

          if(e.name == "BasicBullet") countBullet++;
      
          this.Detect_collision()
          this.DetectEdge(e);

          e.Update(timeElapsed)

        }

      }); 

      displayComponent.PrintEnnemy(nbEnnemyFrame);

      this.parent.CheckBullet(countBullet);
     // this.parent.JokerSystem(timeElapsed);

    }

  }

  export default GameObjectManager