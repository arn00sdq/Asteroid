class BulletMouvement{

    constructor(parent){

        this.parent = parent;
        this.speed = 0.1;

    }

    Update(timeElapsed){
        
        let palier = timeElapsed / 7;

        this.parent.translateZ(  0.01  + 0.06); 
        if(this.parent.position.y > 0)  this.parent.position.y = 0 

    }

};

export default BulletMouvement