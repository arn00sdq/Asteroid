class CameraTracking{

    constructor(parent) {

        this.parent = parent
        this.camera = parent.params.camera;
        this.goal = parent.params.goal;

    }

    Update() {
        
        const camera_input = this.parent.GetComponent("CharacterControllerInput").keys.cam3;
        
        if( this.parent.children[0] !== null && camera_input){
            
            this.goal.position.copy(this.parent.position)
            this.camera.lookAt(this.parent.position);

        }
        
    }
}

export default CameraTracking;