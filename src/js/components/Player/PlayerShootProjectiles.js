class PlayerShootProjectiles{
    constructor(params,weapon){

      this.parent = params;
      this.weaponParams = weapon;
      this.canShoot = true;

      this.spawnDistance = -0.3;

      this.spawnPos = new THREE.Vector3;
      this.spawnRot = new THREE.Euler;
      this.playerDirection = new THREE.Vector3;

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

      this.spawnPos.set(this.parent.position.x,this.parent.position.y + this.spawnDistance,this.parent.position.z);
      this.playerDirection = this.parent.getWorldPosition(new THREE.Vector3());
      this.spawnRot =  this.parent.rotation;
      
      t.GetComponent("BulletDamageSystem").Start(this.spawnPos)
      t.Instantiate(t,this.spawnPos, this.spawnRot,this.parent.params.scene);
      
    }
}

export default PlayerShootProjectiles