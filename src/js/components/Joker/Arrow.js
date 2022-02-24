import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class Arrow extends GameObject{

    constructor(scene, model){

        super(scene, model);

        this.components = {}
        this.name = "Arrow";

        this.limit = 1;    
        
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

}

export default Arrow