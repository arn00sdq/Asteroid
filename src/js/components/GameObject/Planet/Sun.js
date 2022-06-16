//not a planet --'
import GameObject from "../GameObject.js";
import PlanetMouvement from "./PlanetMouvement.js";
import SunShrinking from "./SunShrinking.js";

class Sun extends GameObject{ 

    constructor(gameObject) {

        super(gameObject);

        this.sceneManager = null;
        this.components = {};
        this.name = "Sun";

        this.InitComponent();
        
    }

    InitComponent() {
        
        this.AddComponent(new PlanetMouvement(this));

    }

    InitValue(){}
    
}

export default Sun;