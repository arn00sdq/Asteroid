import GameObject from "../GameObject.js";
import PlanetMouvement from "./PlanetMouvement.js";

class Earth extends GameObject{ 

    constructor(model, audio) {
        
        super(model, audio);
        
        this.components = {};
        this.name = "Earth";
        this.InitComponent();
        
    }

    InitComponent() {
        this.AddComponent(new PlanetMouvement(this))
    }
    
}

export default Earth;
