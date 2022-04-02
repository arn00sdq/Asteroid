class SceneSystem{

    constructor(parent){

        this.parent = parent;

        this.StateScene = {

            StartMenu:false,
            Stage1:true,
            Stage2:false,
            Stage3:false,

        }
        
        this.currentScene = new THREE.Scene();
    }

    Update(){}

}

export default SceneSystem