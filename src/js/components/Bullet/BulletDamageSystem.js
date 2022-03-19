class BulletDamageSystem{

    constructor(parent){

        this.parent = parent;

        this.damage = 10;
        this.damageAmount = 10;

        this.DistanceTravelled = 0;
        this.lastPosition  = new THREE.Vector3;

        this.startTime = 0;

    }

    Start(){}

    Update(timeElapsed){

        //console.log(this.startTime)
        let bulletCurrentTime = timeElapsed *1000 - this.startTime;
        this.damageAmount = this.damage - Math.round(bulletCurrentTime) *2

        if(this.damageAmount <= 0)  this.damageAmount = 0 /*this.parent.Destroy(this.parent)*/

    }

}

export default BulletDamageSystem