
class PlayerShootProjectiles{
    constructor(params,weapon){

      this.parent = params;
      this.weaponParams = weapon;
      this.canShoot = true;

      this.spawnDistance = -0.3;

      this.spawnPos = new THREE.Vector3;
      this.spawnRot = new THREE.Euler;
      this.playerDirection = new THREE.Vector3;

      this.temp = new THREE.Vector3;

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

    Shoot(){
      
      let t = this.weaponParams.clone();
      t.spaceShip = this.parent;

      t.InitMesh();

      this.temp.setFromMatrixPosition(this.parent.follow.matrixWorld);
      this.spawnPos.set(this.temp);

      this.playerDirection = this.parent.getWorldPosition(new THREE.Vector3());
      this.spawnRot =  this.parent.rotation;
      
      t.GetComponent("BulletDamageSystem").Start(this.temp)
      t.Instantiate(t,this.temp, this.spawnRot,this.parent.params.scene);
      
    }
}

export default PlayerShootProjectiles