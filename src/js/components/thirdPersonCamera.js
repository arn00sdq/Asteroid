import { Euler, Quaternion, Vector3, MathUtils } from '../three/three.module.js'

class ThirdPersonCamera{
    constructor(params) {
        this.parent = params
        this.camera = params.camera;
        this.goal = params.goal;
        this.follow = params.follow;

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;
        this.offset = 0.3;
    }

    Update(timeElapsed) {
        if( this.parent.children[0] !== null){
        
            this.a.lerp( this.parent.position, 1);
            this.b.copy(this.parent.params.goal.position);
            
            let limitA = this.a.distanceTo(new THREE.Vector3(0,0,0) )
            
            if((limitA) >5 )  {
                this.parent.params.goal.position.x =  this.a.x
                this.parent.params.goal.position.z =  this.a.z -0.3
                
            }else{
                this.dir.copy( this.a ).sub( this.b );
                const dis = this.a.distanceTo( this.b ) - this.offset;// ou on va pos la cam
                this.parent.params.goal.position.addScaledVector( this.dir, dis );
            }
            
            console.log(this.temp)
            this.parent.params.goal.position.lerp(this.temp, 0.05);
            this.temp.setFromMatrixPosition(this.parent.children[0].matrixWorld);
            
            
            
            this.parent.params.camera.lookAt(this.parent.position );
        
        }
        
    }
}

export default ThirdPersonCamera