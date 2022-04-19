import * as THREE from 'three';

class BulletDamageSystem{

    constructor(parent){

        this.parent = parent;

        this.damage = 10;
        this.damageAmount = 10;

        this.DistanceTravelled = 0;
        this.lastPosition  = new THREE.Vector3;

        this.debugTime = null;


    }

    Start(){}

    Update(timeElapsed,timeInSecond){


        
        if(this.debugTime !== Math.round(timeInSecond*1000)){

            this.debugTime =  Math.round(timeInSecond*1000);
            
            let bulletCurrentTime = timeInSecond*1000 - this.parent.timerInstantiate;
            this.damageAmount = this.damage - Math.round(bulletCurrentTime) * 2

            //console.log("Temps en seconde : ", this.debugTime, "Dégat balleJoueur : ", this.damageAmount)

            if(this.damageAmount <= 0){

                this.damageAmount = 0;
                this.parent.Destroy(this.parent); 

            }  

        }
        
        if(this.debugTime < Math.round(timeInSecond*1000))  this.debugTime = null

    }

}

export default BulletDamageSystem