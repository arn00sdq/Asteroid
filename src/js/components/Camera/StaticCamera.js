class StaticCamera{

    constructor(parent) {

        this.parent = parent
        this.camera = parent.params.camera;

    }

    Update() {
        
        const camera_input = this.parent.GetComponent("CharacterControllerInput").keys.cam1;
        
        if( this.parent.children[0] !== null && camera_input){

            this.camera.lookAt(0,0,0);

        }
        
    }
}

export default StaticCamera;