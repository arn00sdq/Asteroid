import * as THREE from 'three';

import GameObject from "../GameObject.js";
import ExplosionMouvement from './ExplosionMouvement.js';

class Explosion extends GameObject{

    constructor(model, audio){

        super(model, audio);

        this.components = {}
        this.name = "Explosion";
        
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new ExplosionMouvement(this));

    }

}

export default Explosion