
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
      
      this.weaponParams.InitMesh();


      for (let i = 0; i < this.parent.cannon.length; i++) {

        let bulletClone = this.weaponParams.clone();

        bulletClone.spaceShip = this.parent;
        bulletClone.scene = this.weaponParams.scene;
        
        this.temp.setFromMatrixPosition(this.parent.cannon[i].matrixWorld);
        this.spawnPos.copy(this.parent.cannon[i].position);

        this.playerDirection = this.parent.getWorldPosition(new THREE.Vector3());
        this.spawnRot =  this.parent.rotation;
        
        bulletClone.GetComponent("BulletDamageSystem").Start(this.temp);
       
        bulletClone.Instantiate(bulletClone,this.temp, this.spawnRot);

        this.parent.params.scene.add(new THREE.Object3D)

      }
      
    }
}

export default PlayerShootProjectiles