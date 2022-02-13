class BulletDamageSystem{

    constructor(parent){

        this.parent = parent;
        this.damageAmount = 10;

    }

    Update(timeElapsed){

       let spaceShip = this.parent.spaceShip;

       let bulletDistance = spaceShip.position.distanceTo(spaceShip.position);
       
       this.damageAmount -= bulletDistance;

       if(this.damageAmount < 1) this.damageAmount = 1

    }

}

export default BulletDamageSystem