import GameObject from "../GameObject.js";
import PlanetMouvement from "./PlanetMouvement.js";

class Earth extends GameObject{ 

    constructor(gameObject) {
        
        super(gameObject);
        
        this.sceneManager = null;
        this.components = {};
        this.name = "Earth";

        this.InitComponent();
        
    }

    InitComponent() {

        this.AddComponent(new PlanetMouvement(this))
    }

    InitValue(){}
    
}

export default Earth;
