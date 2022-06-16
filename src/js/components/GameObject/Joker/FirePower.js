import * as THREE from 'three';

import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class FirePower extends GameObject{

    constructor(gameObject){

        super(gameObject);

        this.sceneManager = null;
        this.components = {}

        if (!gameObject) gameObject = {nb : 0};
        
        this.name = "FirePower";

        this.limit = 1;
        this.nb = gameObject.nb; 
        this.userData.type = "joker";

        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

    InitValue(){}

    Instantiate(o,p,r,s){
        
        super.Instantiate(o,p,r,s);

        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.nb += 1;

        this.scene.add(o);
        
    }

}

export default FirePower