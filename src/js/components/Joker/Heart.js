import GameObject from "../GameObject.js";

import JokerMovement from "./JokerMovement.js";

class Heart extends GameObject{

    constructor(scene, model){

        super(scene, model);

        this.name = "Heart";

        this.limit = 1;
      
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

}

export default Heart