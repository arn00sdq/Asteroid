import * as THREE from 'three';

import GameObject from "../GameObject.js";
import ExplosionMouvement from './ExplosionMouvement.js';

class Explosion extends GameObject{

    constructor(gameObject){

        super(gameObject);

        this.sceneManager = null;
        this.components = {}
        this.name = "Explosion";

        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new ExplosionMouvement(this));

    }

    InitValue(){}

}

export default Explosion