import * as THREE from 'three';
import GameObject from "../GameObject.js";
import PlanetMouvement from "./PlanetMouvement.js";

class Earth extends GameObject{ 

    constructor(model) {

        super(model);

        this.components = {};
        this.name = "Earth";
        this.InitComponent();
        
    }

    InitComponent() {
        this.AddComponent(new PlanetMouvement(this))
    }
    
}

export default Earth;
