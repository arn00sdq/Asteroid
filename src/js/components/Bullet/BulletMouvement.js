class BulletMouvement{

    constructor(parent){

        this.parent = parent;
        this.speed = 0.1;

    }

    Update(timeElapsed){

        
        let palier = Math.floor(timeElapsed / 4);
        this.parent.translateZ(  0.01 * (palier + 1 )); 


    }

};

export default BulletMouvement