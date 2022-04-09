import * as THREE from 'three';

import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class FireRate extends GameObject{

    constructor(model,audio, nb){

        super(model,audio);

        this.components = {}
        this.name = "FireRate";

        this.limit = 1;
        this.nb = nb;    
        
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

    Instantiate(o,p,r,s){
        
        super.Instantiate(o,p,r,s);

        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.nb += 1;

        this.scene.add(o);
        
    }

}

export default FireRate