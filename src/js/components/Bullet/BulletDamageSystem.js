class BulletDamageSystem{

    constructor(parent){

        this.parent = parent;

        this.damage = 10;
        this.damageAmount = 10;

        this.DistanceTravelled = 0;
        this.lastPosition  = new THREE.Vector3;

    }

    Start(pos){

        this.lastPosition = pos.clone();

    }

    Update(timeElapsed){

        let DistanceTravelled = this.parent.position.distanceTo(this.lastPosition)
        this.damageAmount = this.damage - (DistanceTravelled /2)
        

        if(this.damageAmount <= 0)  this.damageAmount = 0 /*this.parent.Destroy(this.parent)*/

    }

}

export default BulletDamageSystem