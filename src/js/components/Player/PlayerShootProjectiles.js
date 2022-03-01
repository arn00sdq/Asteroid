class PlayerShootProjectiles{

    constructor(parent,audio){

      this.parent = parent;
      this.audio = audio;

      this.weaponParams = null;

      this.canShoot = true;
      this.nbCannon = 0;
      this.cannon = [];

      this.spawnDistance = -0.3;
      this.spawnRot = new THREE.Euler;
      this.temp = new THREE.Vector3;

      this.indexMissile = 1;

    }

    Shoot(){

      for (let i = 0; i < this.cannon.length; i++) {

        let bulletClone = this.weaponParams.clone();

        bulletClone.spaceShip = this.parent;
        bulletClone.scene = this.weaponParams.scene;
        bulletClone.index = this.indexMissile;

        this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
        this.temp.y = -0.2;
        this.spawnRot =  this.parent.rotation;
        
        this.weaponParams.GetComponent("BulletDamageSystem").Start(this.temp);

        bulletClone.SetRigidBody(bulletClone);
        
        bulletClone.Instantiate(bulletClone,this.temp, this.spawnRot, 0.0009);
       
        this.parent.audio_syst.PlayBulletShoot(this.audio.listener, Math.random() * 0.2, 0.2);

        this.indexMissile ++;

      }
      
    }

    AddProjectile(nbCannon){ //Composant ?

      this.nbCannon += nbCannon;
      this.cannon = [];

      let zPos = new THREE.Vector3(0,0,0.5); // changez z ou x pour futur
      let r = zPos.distanceTo(new THREE.Vector3(0,0,0));
      
      for(let i = 0; i < this.nbCannon ; i++){

          this.cannon.push(new THREE.Object3D);

          let x = r * Math.cos( 360 / ( i + 2 ) );
          let z = r * Math.sin( 360 / ( i + 2 ) );

          let posCannon = new THREE.Vector3( x, 0, z )
          this.cannon[i].position.copy( posCannon );
          this.parent.add(this.cannon[i]);

      }

    }

    Update(timeElapsed){
      
      const input = this.parent.GetComponent('CharacterControllerInput');

        if ( input.keys.shoot && this.canShoot ){ 
        
          this.Shoot()
          this.canShoot = false

          setTimeout(() => {

            this.canShoot = true;
  
          }, 500);   
          
        }

        input.keys.shoot = false;
  }
}

export default PlayerShootProjectiles