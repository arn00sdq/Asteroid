import * as THREE from 'three';

class BulletDamageSystem{

    constructor(parent){

        this.parent = parent;

        this.damage = 10;
        this.damageAmount = 10;

        this.DistanceTravelled = 0;
        this.lastPosition  = new THREE.Vector3;


    }

    Start(){}

    Update(timeElapsed){

        let bulletCurrentTime = timeElapsed *1000 - this.parent.timerInstantiate;
        this.damageAmount = this.damage - Math.round(bulletCurrentTime) *2
        if(this.damageAmount <= 0){

            this.damageAmount = 0;
            this.parent.Destroy(this.parent); 

        }  

    }

}

export default BulletDamageSystem