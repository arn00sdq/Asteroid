
class SpaceshipComportement { 

    constructor(parent) {

        this.parent = parent;
        this.canShoot = true;

        this.TargetPosition = new THREE.Quaternion();
        this.TargetPosition.setFromAxisAngle(new THREE.Vector3(0, 1, 0),0);

        this.q1 = new THREE.Quaternion();
        this.q2 = new THREE.Quaternion();


    }

    Update(timeElapsed) {

      this.Subsomption();

    }
    
    Subsomption() {

        if(!this.Dodge()){

            this.Explore();
            if(this.canShoot){

                this.canShoot = false;

                setTimeout(() => {

                    this.canShoot = true;
                    this.Shoot();
    
                }, 2000);
                

            }
           

        }

    }

    //---- Regle de comportement

    Explore(){

        let condition = true;
        if (condition) this.RandomMouvement();

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

    Shoot(){


    }
    
}

export default SpaceshipComportement