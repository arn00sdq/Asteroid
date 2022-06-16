import * as THREE from 'three';
import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";
import ShieldShader from './ShieldShader.js';

class Shield extends GameObject{

    constructor(gameObject){

        super(gameObject);

        this.sceneManager = null;
        this.components = {};

        if (!gameObject) gameObject = {nb : 0};

        this.name = "Shield";
   
        this.limit = 1;
        this.nb = gameObject.nb;
        this.userData.type = "joker";
        
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))
        this.AddComponent(new ShieldShader(this))

    }

    InitValue(){}

    Instantiate(o,p,r,s){
        
        super.Instantiate(o,p,r,s);

        o.position.copy(p);
        o.rotation.copy(r);
        o.children.forEach( e => {
            if (e.constructor.name == "Mesh") {
                e.scale.copy(new THREE.Vector3(s,s,s))
            }
        })

        this.SetInvulnerability(100);

        this.nb = this.nb + 1;

        this.scene.add(o);
        
    }

}

export default Shield