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

    AddProjectile(nbCannon){ 

      this.nbCannon += nbCannon;
      this.cannon = [];

      switch (this.nbCannon){
        case 1:
          this.cannon.push(new THREE.Object3D);
          this.cannon[0].position.copy(  new THREE.Vector3(0,0,0.2) );
          this.parent.add(this.cannon[0]);
          break;
        case 2:

          for( let i = 0; i<this.nbCannon; i++) this.cannon.push(new THREE.Object3D);

          this.cannon[0].position.copy(  new THREE.Vector3(-0.1,0,0.2) );
          this.cannon[1].position.copy(  new THREE.Vector3(0.1,0,0.2) );

          for( let i = 0; i<this.nbCannon; i++) this.parent.add(this.cannon[i]);

          break;
        case 3:

          for( let i = 0; i<this.nbCannon; i++) this.cannon.push(new THREE.Object3D);

          this.cannon[0].position.copy(  new THREE.Vector3(-0.1,0,0.2) );
          this.cannon[1].position.copy(  new THREE.Vector3(0,0,0.2) );
          this.cannon[2].position.copy(  new THREE.Vector3(0.1,0,0.2) );
          
          for( let i = 0; i<this.nbCannon; i++) this.parent.add(this.cannon[i]);

          break;
        case 4:

          for( let i = 0; i<this.nbCannon; i++) this.cannon.push(new THREE.Object3D);

          this.cannon[0].position.copy(  new THREE.Vector3(-0.1,0,0.2) );
          this.cannon[1].position.copy(  new THREE.Vector3(-0.05,0,0.2) );
          this.cannon[2].position.copy(  new THREE.Vector3(0.1,0,0.2) );
          this.cannon[3].position.copy(  new THREE.Vector3(0.05,0,0.2) );
          
          for( let i = 0; i<this.nbCannon; i++) this.parent.add(this.cannon[i]);

          break;

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