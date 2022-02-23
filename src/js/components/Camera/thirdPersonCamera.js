class ThirdPersonCamera{

    constructor(parent) {

        this.parent = parent
        this.camera = parent.params.camera;
        this.goal = parent.params.goal;
        this.follow = parent.follow;

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;
        this.offset = 0.3;

    }

    Update(timeElapsed) {
        
        const camera_input = this.parent.GetComponent("CharacterControllerInput").keys.cam2;

        if( this.parent.children[0] !== null && camera_input){

            this.a.lerp( this.parent.position, 1);
            this.b.copy(this.goal.position);
            
            let limitA = this.a.distanceTo(new THREE.Vector3(0,0,0) )
            
            if((limitA) > 15 )  {

                this.goal.position.x =  this.a.x
                this.goal.position.z =  this.a.z - 0.3

            }else{

                this.dir.copy( this.a ).sub( this.b );// Calcul de la pos de la cam
                let dis = this.a.distanceTo( this.b ) - this.offset;  // pos vaisseau - pos cam

                if( dis > 1) {

                    dis = 0.1
                }
                if( dis < -1) {

                    dis = - 0.1
                }

                this.goal.position.addScaledVector( this.dir, dis ); // multiplié par la distance en float

            }
            
            this.goal.position.lerp(this.temp, 0.02);
            this.temp.setFromMatrixPosition(this.parent.children[0].matrixWorld);
            
            this.camera.lookAt(this.parent.position );
        
        }
        
    }
}

export default ThirdPersonCamera