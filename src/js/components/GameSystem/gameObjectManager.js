class GameObjectManager{

    constructor(parent) {
      
      this.parent = parent;
      this.edge_limit = parent.limit;

      this.level_sys_comp = this.parent.GetComponent("LevelSystem");
      this.sound_sys = this.parent.GetComponent("SoundSystem");
      this.joker_sys = this.parent.GetComponent("JokerSystem");
      
    }

    Detect_collision() {

      this.parent.scene.children.forEach( e =>  { 
        
        if( (e.userData.box3 !== null) && (e.children[0])){

          this.parent.scene.children.forEach(e2 => {

          if((e !== e2) &&  (e2.userData.box3 && e.userData.box3) && e2.children[0] && e.children[0]){

            if ( e.userData.box3.intersectsBox(e2.userData.box3)) this.collision_handler(e,e2);

            }

          })

        }

      })

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
        case "EnnemyBullet":
          this.CollisionEnnemyBulletHandler(e, e2);
          break;

        case "Heart":
          this.CollisionJokerHandler(e, e2);
          break;

        case "Coin":
          this.CollisionJokerHandler(e, e2);
          break;

        case "Arrow":
          this.CollisionJokerHandler(e, e2);
          break;

        case "Shield":
          this.CollisionJokerHandler(e, e2);
            break;
        case "EnnemySpaceship":
          this.CollisionEnnemySSHandler(e, e2);
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
            this.CollisionJokerHandler(e2, e);
            break;

        case "Coin":
            this.CollisionJokerHandler(e2, e);
            break;

        case "Arrow":
            this.CollisionJokerHandler(e2, e);
            break;
        case "Shield":
            this.CollisionJokerHandler(e2, e);
            break;
        case "EnnemySpaceship":
          this.CollisionEnnemySSHandler(e2, e);
          break;
        case "EnnemyBullet":
          this.CollisionEnnemyBulletHandler(e2, e);
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
      
      if ((object.name == "Asteroid" || object.name == "EnnemyBullet") && !player.immune){

        let playerHealth = player.GetComponent("PlayerHealthSystem");

        let playerHitSound = new THREE.Audio( this.parent.audio.listener );
        this.sound_sys.PlayShipDamageTaken(playerHitSound, 0,0.2);

        playerHealth.Damage(1);
        player.SetInvulnerability(2000);

        this.parent.playerLife =player.life
        this.parent.GetComponent("DisplaySystem").PrintLife(player.life);
        
        if(player.life == 0){

          player.Destroy(player);
          this.parent.OnPlayerEnd();
          
        }

      }

    }

    CollisionAsteroidHandler(asteroid, object){

      if(object.name == "Heart" || object.name == "Shield"|| object.name ==  "Coin"|| object.name == "Arrow" ||  object.name ==  "Asteroid" ) return;

      let asteroidHealth = asteroid.GetComponent("AsteroidHealthSystem");

      if (object.name == "Player" && object.immune == false) asteroidHealth.Damage("max");

      if(object.name == "BasicBullet"){

        let bullet = object.GetComponent("BulletDamageSystem");
        asteroidHealth.Damage(bullet.damageAmount);

      }

      

      if(asteroid.life == 0) {

       // this.level_sys_comp.InstantiateParticule(this.parent.particuleExplosion,asteroid.position)
       
        asteroid.nbBreak += 1;

        if (asteroid.nbBreak < 2){

          this.Asteroid_Subdivision(asteroid,object);
          this.parent.score += 4;
          this.parent.GetComponent("DisplaySystem").printScore(this.parent.score, 2,2);

        }else{
          this.parent.score += 5;
          this.parent.GetComponent("DisplaySystem").printScore(this.parent.score, 1,10);
        } 

        asteroid.Destroy(asteroid);

      }

    }

    Asteroid_Subdivision(e,object){

      let dir = new THREE.Vector3();
      if (object.name == "Player"){

        dir.set(1,0,0.5);

      }else{

        dir = object.GetComponent("BulletMouvement").forward;

      }

      for (let index = 1; index <= 2; index++) {
        
        let signe = index == 1 ? 1 : -1;
        let position = new THREE.Vector3(e.position.x + Math.random() *0.3, 0 ,
                                             e.position.z + Math.random() *0.3 );
        let rotation = new THREE.Euler(0,0 ,0);
        let scale = 0.75*e.scale.x;

        let velocity = new THREE.Vector3(Math.random()* 1,0,(dir.x/dir.z)*signe).normalize().multiplyScalar(10)
        this.level_sys_comp.InstantiateGameObject(e , position,rotation, scale, velocity)

      }

    }
    
    CollisionBulletHandler(bullet, object){

      if(object.name == "Asteroid" || object.name == "EnnemySpaceship" ){

        bullet.Destroy(bullet)
        let bulletDamage = bullet.GetComponent("BulletDamageSystem").damageAmount;
        if (bulletDamage > 0){

          let playerHitSound = new THREE.Audio( this.parent.audio.listener );
          this.sound_sys.PlayHitBullet(playerHitSound, 0,0.2);

        }   

      } 

    }

    CollisionEnnemyBulletHandler(bullet, object){

      if(object.name == "Asteroid" || object.name == "Player" ){

        bullet.Destroy(bullet)

        let playerHitSound = new THREE.Audio( this.parent.audio.listener );
        this.sound_sys.PlayHitBullet(playerHitSound, 0,0.2);

      } 

    }

    CollisionJokerHandler(joker, object){

      if(object.name == "Player" ){

        joker.Destroy(joker);

        switch(joker.constructor.name){

          case "Coin":
            this.parent.coin.nb -= 1
            this.joker_sys.PlayerAddCoin(this.parent.score, 1);
            this.sound_sys.PlayCoinPickUp();
            break;
          case "Heart":
            this.parent.heart.nb -= 1
            this.joker_sys.PlayerAddLife(object, 1);
            this.sound_sys.PlayHeartPickUp();
            break;
          case "Arrow":
            this.parent.arrow.nb -= 1
            this.parent.player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
            break;
          case "Shield":
            this.parent.shield.nb -= 1
            this.sound_sys.PlayCoinPickUp();
            if(!this.joker_sys.hasShield) this.joker_sys.PlayerProtection(object,this.parent.shield, 3000);
            
            break;

        }  

      }

    }

    CollisionEnnemySSHandler(ennemy_ss, object){

      if (object.name == "BasicBullet" || object.name == "Asteroid"){

        let ennemy_ss_health = ennemy_ss.GetComponent("EnnemySSHealthSystem");

        if (object.name == "BasicBullet"){

          let bullet = object.GetComponent("BulletDamageSystem");
          ennemy_ss_health.Damage(bullet.damageAmount);

        } 

        if (object.name == "Asteroid") ennemy_ss_health.Damage(2);

        if(ennemy_ss_health.life == 0) {

          ennemy_ss.Destroy(ennemy_ss);

        }

      }

    }

    CheckBullet(nbBullet){

      let objectsToRemove = [];
      let bulletToRemove = 2;
      
      if (nbBullet >40){

          this.parent.scene.traverse( function(child ) {
              
              if(child.name == "BasicBullet" && bulletToRemove > 0){
                  
                  objectsToRemove.push(child)
                  bulletToRemove--;

              }

          })

      }

      objectsToRemove.forEach(node => {
        this.parent.scene.remove( node );
      });

  }


    Update(timeElapsed) {

      let nbEnnemyFrame = 0;let playerLife; let countBullet = 0;

      this.parent.scene.children.forEach(e => {

        if(e.type == "Object3D"){ 

          if(e.name == "Asteroid") nbEnnemyFrame++ ;

          if(e.name == "EnnemySpaceship") nbEnnemyFrame++ ;

          if(e.name == "Player") playerLife = e.life ;

          if(e.name == "BasicBullet") countBullet++;
      
          
          this.DetectEdge(e);

          e.Update(timeElapsed);

        }

      }); 
      
      this.Detect_collision()
      this.CheckBullet(countBullet);

      this.parent.ennemy = nbEnnemyFrame;
      this.parent.GetComponent("DisplaySystem").PrintEnnemy(nbEnnemyFrame);

      if(nbEnnemyFrame == 0) this.parent.StageCompleted();
     
    }

  }

  export default GameObjectManager