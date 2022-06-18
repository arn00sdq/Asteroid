import * as THREE from 'three';

import AsteroidMovement from "./AsteroidMouvement.js";
import AsteroidHealthSystem from "./AsteroidHealthSystem.js";
import StaticAsteroid from "./StaticAsteroid.js";
import GameObject from "../GameObject.js";

class BasicAsteroid extends GameObject { // extends sceneManager

    constructor(gameObject) {

        super(gameObject);

        this.sceneManager = null;
        this.components = {};

        if (!gameObject) gameObject = {audio : null, nbBreak : 0};

        this.audio = gameObject.audio;
        this.name = "Asteroid"
        this.nbBreak = gameObject.nbBreak;
        this.InitComponent();

    }

    InitComponent() {


        this.AddComponent(new AsteroidMovement(this))
        this.AddComponent(new AsteroidHealthSystem(this))

    }

    InitValue(){}

    Instantiate(o, p, r, s) {

        super.Instantiate(o, p, r, s);

        o.position.copy(p);
        o.rotation.copy(r);
        o.children.forEach( e => {
            if (e.constructor.name == "Mesh") {
                e.scale.copy(new THREE.Vector3(s,s,s))
            }
        })

        let aste_mvt = this.GetComponent("AsteroidMovement");
        o.userData.velocity !== undefined ? aste_mvt.velocity.copy(o.userData.velocity) : 
        aste_mvt.velocity = new THREE.Vector3(Math.ceil(Math.random() * (6 - 3) + 3) * (Math.round(Math.random()) ? 1 : -1), 0, Math.ceil(Math.random() * (6 - 3) + 3) * (Math.round(Math.random()) ? 1 : -1));;


        aste_mvt.gravity = (this.scale.x * 20);

        if (o.children[0].material.color.getHexString() !== 'ffffff') o.children[0].material.color.set(0xffffff);

        if(o.userData.type == "BackGround") o.children[0].material.color.set(new THREE.Color("rgb(84, 83, 83)"));

        this.SetInvulnerability(2000);
        this.life = this.life / (this.nbBreak + 1);
        this.scene.add(o);


    }

    Destroy(object) {

        super.Destroy(object);

        object.mesh = null;

        this.scene.remove(object);

    }

}

export default BasicAsteroid