import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class Coin extends GameObject{

    constructor(scene, model){

        super(scene, model);

        this.components = {}
        this.name = "Coin";

        this.limit = 5;

        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

}

export default Coin