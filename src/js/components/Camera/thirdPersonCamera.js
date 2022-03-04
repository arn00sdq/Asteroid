class ThirdPersonCamera{

    constructor(parent) {

        this.parent = parent
        this.camera = parent.params.camera;
        this.goal = parent.params.goal;
        //this.follow = parent.follow;

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;
        this.dis = 0;
        this.offset = 0.3;

        console.log(this.parent.children)
        
        

    }

    Update(timeElapsed) {
        
        const camera_input = this.parent.GetComponent("CharacterControllerInput").keys.cam2;
        
        
        if( this.parent.children[0] !== null && camera_input){
           let f = this.parent.children.find(e => e.name == "FollowPlayer")
            
            this.a.lerp( this.parent.position, 0.4);
            this.b.copy(this.goal.position);
            
            let limitA = this.a.distanceTo(new THREE.Vector3(0,0,0) )
            
            if((limitA) > 15 )  {

                this.goal.position.x =  this.a.x
                this.goal.position.z =  this.a.z - 0.3

            }else{
                
                this.dir.copy( this.a ).sub( this.b ).normalize();// Calcul de la pos de la cam
                this.dis = this.a.distanceTo( this.b ) - this.offset;  // pos vaisseau - pos cam

                if( this.dis > 1) {

                    this.dis = 0.1
                }
                if( this.dis < -1) {

                    this.dis = - 0.1
                }

                this.goal.position.addScaledVector( this.dir, this.dis ); // multiplié par la distance en float

            }

            this.goal.position.lerp(this.temp, 0.01);
            this.temp.setFromMatrixPosition(f.matrixWorld);
            this.camera.lookAt(this.parent.position );
           
        
        }
        
        
    }
}

export default ThirdPersonCamera