class PlayerShootProjectiles{

    constructor(parent,weapon,audio){

      this.parent = parent;

      this.weaponParams = weapon;
      this.canShoot = true;
      this.audio = audio;

      this.nbCannon = 0;
      this.cannon = [];

      this.spawnDistance = -0.3;

      this.spawnPos = new THREE.Vector3;
      this.spawnRot = new THREE.Euler;
      this.playerDirection = new THREE.Vector3;

      this.temp = new THREE.Vector3;

      this.indexMissile = 1

    }

    Shoot(){
      
      this.weaponParams.InitMesh();

      for (let i = 0; i < this.cannon.length; i++) {


        let bulletClone = this.weaponParams.clone();

        bulletClone.spaceShip = this.parent;
        bulletClone.scene = this.weaponParams.scene;
        bulletClone.index = this.indexMissile;

        this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
        this.spawnPos.copy(this.cannon[i].position);

        this.playerDirection = this.parent.getWorldPosition(new THREE.Vector3());
        this.spawnRot =  this.parent.rotation;
        
        bulletClone.GetComponent("BulletDamageSystem").Start(this.temp);

        let bulletSound = new THREE.Audio( this.audio.listener );
        this.parent.audio_syst.PlayBulletShoot(bulletSound, Math.random() * 0.2, 0.2);

        bulletClone.Instantiate(bulletClone,this.temp, this.spawnRot);

        this.indexMissile ++;

      }
      
    }

    AddProjectile(nbCannon){

      this.nbCannon += nbCannon;
      this.cannon = [];

      let zPos = new THREE.Vector3(0,0,0.1); // changez z ou x pour futur
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