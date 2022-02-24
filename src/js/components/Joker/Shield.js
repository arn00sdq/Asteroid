import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class Shield extends GameObject{

    constructor(scene, model){

        super(scene, model);

        this.components = {};
        this.name = "Shield";
   
        this.limit = 1;

        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

}

export default Shield