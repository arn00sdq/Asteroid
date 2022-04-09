//not a planet --'
import GameObject from "../GameObject.js";
import PlanetMouvement from "./PlanetMouvement.js";

class Sun extends GameObject{ 

    constructor(model, audio) {

        super(model,audio);

        this.components = {};
        this.name = "Sun";
        this.InitComponent();
        
    }

    InitComponent() {
        this.AddComponent(new PlanetMouvement(this))
    }
    
}

export default Sun;