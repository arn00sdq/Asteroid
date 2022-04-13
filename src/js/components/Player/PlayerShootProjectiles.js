import * as THREE from 'three';

class PlayerShootProjectiles{

    constructor(parent,audio){

      this.parent = parent;
      this.audio = audio;
      this.fireRate = 500;

      this.weaponList = null;
      this.currentWeapon = null;

      this.canShoot = true;
      this.nbCannon = 0;
      this.cannon = [];

      this.spawnDistance = -0.3;
      this.spawnRot = new THREE.Euler;
      this.temp = new THREE.Vector3;

      this.basicBullet = 0;
      this.powerBullet = 1;

      this.ultimate = 0;

      this.indexMissile = 1;

    }

    Shoot(timeElapsed,bullet){
      
      for (let i = 0; i < this.cannon.length; i++) {
        
        this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
        this.temp.y = -0;
        this.spawnRot =  this.parent.rotation;

        if (bullet == 0){

          this.weaponList.normalBullet.timerInstantiate = timeElapsed;
          this.parent.stageSystem.InstantiateGameObject(this.weaponList.normalBullet,this.temp, this.spawnRot, 0.0009) 
          this.parent.audioSystem.PlayBulletShoot();
          
        }else{

          this.weaponList.specialBullet.timerInstantiate = timeElapsed;
          this.parent.stageSystem.InstantiateShader(this.weaponList.specialBullet,this.temp, this.spawnRot, 0.9);
          this.parent.audioSystem.PlayPowerShoot();

        }
        
       // if(this.currentWeapon.constructor.name == "SpecialBullet") 
 
        

        this.indexMissile ++;

      }
      
    }

    AddProjectile(nbCannon){ 

      this.nbCannon += nbCannon;
      if(this.nbCannon > 4) this.nbCannon = 4;
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

    loadUltimate(){

      
      this.ultimate += 15 /60;
      if(this.ultimate > 100) this.ultimate =  100;

      document.getElementById("power").style.width = this.ultimate +"%";
      document.getElementById("powerp").innerHTML = Math.round(this.ultimate);

    }

    Update(timeElapsed,timeInSecond){
      
      const input = this.parent.GetComponent('CharacterControllerInput');

        if ( input.keys.shoot && this.canShoot ){ 
        
          this.Shoot(timeInSecond * 1000,this.basicBullet)
          this.canShoot = false

          setTimeout(() => {

            this.canShoot = true;
  
          }, this.fireRate);   
          
        }

        if ( input.keys.enter && this.ultimate == 100 ){ 
                   
          this.Shoot(timeInSecond * 1000,this.powerBullet)
          this.ultimate = 0;
          
        }

        this.loadUltimate();

        input.keys.shoot = false;
        input.keys.enter = false;
        
  }

}

export default PlayerShootProjectiles