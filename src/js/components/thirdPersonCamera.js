
import { Euler, Quaternion, Vector3, MathUtils } from '../three.module.js';

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
        if( this.parent.mesh !== null){
            this.speed = 0.0;
            
        this.a.lerp( this.parent.position, 1);
        
        this.b.copy(this.parent.params.goal.position);

        this.dir.copy( this.a ).sub( this.b );
        const dis = this.a.distanceTo( this.b ) - this.offset;
        this.parent.params.goal.position.addScaledVector( this.dir, dis );
        //this.goal.position.lerp(new Vector3(this.temp.x,this.temp.y,this.temp.z), 0.02);
        this.temp.copy(this.parent.params.goal.position)
        this.temp.setFromMatrixPosition(this.parent.params.follow.matrixWorld);
        
        this.parent.params.camera.lookAt(this.parent.position );
      //  target.mixer.update( timeElapsed )
        }
        
    }
}

export default ThirdPersonCamera