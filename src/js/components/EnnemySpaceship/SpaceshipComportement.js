import * as THREE from 'three';

class SpaceshipComportement { 

    constructor(parent) {

        this.parent = parent;
        this.canShoot = true;

        this.TargetPosition = new THREE.Quaternion();
        this.TargetPosition.setFromAxisAngle(new THREE.Vector3(0, 1, 0),0);

        this.q1 = new THREE.Quaternion();
        this.q2 = new THREE.Quaternion();

        this.nbCannon = 0;

        this.spawnDistance = -0.3;
        this.spawnRot = new THREE.Euler;
        this.temp = new THREE.Vector3;

        this.indexMissile = 1;


    }

    AddProjectile(nbCannon){ //Composant ?

        this.nbCannon += nbCannon;
        if(this.nbCannon > 4) this.nbCannon = 4;
        this.cannon = [];
  
        let zPos = new THREE.Vector3(0,0,0.5); // changez z ou x pour futur
        let r = zPos.distanceTo(new THREE.Vector3(0,0,0));

        this.cannon.push(new THREE.Object3D);
        this.cannon[0].position.copy(  new THREE.Vector3(0,0,0.2) );
        this.parent.add(this.cannon[0]);
  
      }

    Update(timeElapsed) {

      this.Subsomption(timeElapsed);

    }
    
    Subsomption(timeElapsed) {

        if(!this.Dodge()){

            this.Explore();
            if(this.canShoot){ 

                this.canShoot = false;

                setTimeout(() => {

                    this.canShoot = true;
                    this.Shoot(timeElapsed);
    
                }, 400);
                

            }
           

        }

    }

    //---- Regle de comportement

    Explore(){

        let condition = true;
        if (condition){

            
        } this.RandomMouvement();

    }

    Dodge(){

        let condition = this.PerceptObstacle();
        if (condition) this.Turn();
        return condition;

    }

    //---- Percept

    PerceptObstacle(){

        let dodge = false;

        this.parent.scene.children.forEach((e) => {
            if(e.name == "Asteroid" || e.name == "Player"){

                if (this.parent.position.distanceTo(e.position) <= 2 ) dodge = true

            }

        });

        return dodge;

    }

    //---- Action

    RandomMouvement(){

        this.parent.translateZ(0.02)

        let yAxis = new THREE.Vector3(0, 1, 0);

        this.TargetPosition.setFromAxisAngle(yAxis,  Math.random() * ((Math.PI/180) * 10));
        this.q1.multiply(this.TargetPosition);
        this.parent.quaternion.slerp( this.q1,0.02)

        this.TargetPosition.setFromAxisAngle(yAxis,  Math.random() * ((Math.PI/180) * -10));
        this.q1.multiply(this.TargetPosition);
        this.parent.quaternion.slerp( this.q1,0.02)


    }

    Turn(){

        
        this.parent.translateZ(0.02)
        let yAxis = new THREE.Vector3(0, 1, 0);
        
        this.TargetPosition.setFromAxisAngle(yAxis,  (Math.PI/180) * 1);
        this.q2.multiply(this.TargetPosition);
        this.parent.quaternion.slerp( this.q2,0.02)


    }

    Shoot(timeElapsed){

        for (let i = 0; i < this.cannon.length; i++) {
        
            this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
            this.temp.y = -0;
            this.spawnRot =  this.parent.rotation;
            
            this.parent.stageSystem.InstantiateGameObject(this.parent.weaponParams,this.temp, this.spawnRot, 0.001)
            console.log(this.parent.weaponParams)
            //this.parent.audio_syst.PlayBulletShoot(Math.random() * 0.2, 0.2);
    
            this.indexMissile ++;
    
        }


      /*  for (let i = 0; i < this.cannon.length; i++) {

            let bulletClone = this.parent.weaponParams.clone(); 

            bulletClone.spaceShip = this.parent;
            bulletClone.scene = this.parent.weaponParams.scene;
            bulletClone.index = this.indexMissile;
    
            this.temp.setFromMatrixPosition(this.cannon[i].matrixWorld);
    
            bulletClone.SetRigidBody(bulletClone);
            bulletClone.Instantiate(bulletClone,this.temp, new THREE.Euler(0,0,0), 1);      
            bulletClone.lookAt(this.parent.target.position)
            
            this.indexMissile ++;
    
        }*/

    }
    
}

export default SpaceshipComportement