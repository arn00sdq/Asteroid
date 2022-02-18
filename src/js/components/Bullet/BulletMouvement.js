class BulletMouvement{

    constructor(parent){

        this.parent = parent;
        this.speed = 0.1;

    }

    Update(timeElapsed){
        
        let palier = Math.floor(timeElapsed / 7);
        this.parent.translateZ(  0.01 * Math.log(palier) + 0.06); 

    }

};

export default BulletMouvement