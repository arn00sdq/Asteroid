import { Euler, Quaternion, Vector3, MathUtils } from '../three/three.module.js'

class StaticCamera{

    constructor(parent) {

        this.parent = parent
        this.camera = parent.params.camera;
        this.goal = parent.params.goal;

    }

    Update() {
        
        const camera_input = this.parent.GetComponent("CharacterControllerInput").keys.cam1;
        
        if( this.parent.children[0] !== null && camera_input){
            //this.camera.position.set(0,5,0);
            //console.log( this.camera,this.goal)
            this.camera.lookAt(0,0,0);
            //console.log(this.camera)
        }
        
    }
}

export default StaticCamera;