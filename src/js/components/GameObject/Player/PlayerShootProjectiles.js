import * as THREE from 'three';

class PlayerShootProjectiles{

    constructor(parent){

      this.parent = parent;

      this.audio = this.parent.audioSystem;
      this.fireRate = 500;

      this.canShoot = true;
      this.nbCannon = 0;

      this.spawnDistance = -0.3;
      this.spawnRot = new THREE.Euler;
      this.temp = new THREE.Vector3;

      this.basicBullet = 0;
      this.powerBullet = 1;

      this.ultimate = 0;

      this.indexMissile = 1;

    }

    Shoot(timeElapsed,bullet){
      
      this.normalBullet = this.parent.sceneManager.gameModels.basicBullet;
      this.specialBullet =  this.parent.sceneManager.gameModels.specialBullet;

      for (let i = 0; i < this.cannon.length; i++) {
        
        this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
        this.temp.y = -0;
        this.spawnRot =  this.parent.rotation;

        if (bullet == 0){

          this.normalBullet.timerInstantiate = timeElapsed;
          this.parent.stageSystem.InstantiateGameObject(this.normalBullet,this.temp, this.spawnRot, 0.0009) 
          this.parent.audioSystem.playSfxBullet(this.parent.audioSystem.audioManager.find(e => e.name == "Bullet"));
          
        }else{

          this.specialBullet.timerInstantiate = timeElapsed;
          this.parent.stageSystem.InstantiateGameObject(this.specialBullet,this.temp, this.spawnRot, 0.9);
          this.parent.audioSystem.playSfxPlasma(this.parent.audioSystem.audioManager.find(e => e.name == "powerShot"));

        }
        
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

        input.keys.enter = false;
        
  }

}

export default PlayerShootProjectiles