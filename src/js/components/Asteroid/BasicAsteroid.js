import AsteroidMovement from "./AsteroidMouvement.js";
import AsteroidHealthSystem from "./AsteroidHealthSystem.js";
import StaticAsteroid from "./StaticAsteroid.js";
import GameObject from "../GameObject.js";
import { BoxHelper } from "../../three/three.module.js";

class BasicAsteroid extends GameObject {

    constructor(model, nbBreak) {

        super(model);

        this.components = {};

        this.name = "Asteroid"
        this.nbBreak = nbBreak;
        this.life = 15;

        this.InitComponent();

    }

    InitComponent() {


        this.AddComponent(new AsteroidMovement(this))
        this.AddComponent(new AsteroidHealthSystem(this))

    }

    Instantiate(o, p, r, s, v) {

        super.Instantiate(o, p, r, s);

        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s, s, s))

        let aste_mvt = this.GetComponent("AsteroidMovement");

        if (v !== undefined) {

            aste_mvt.velocity = v;

        } else {

            aste_mvt.velocity = new THREE.Vector3(Math.ceil(Math.random() * (6 - 3) + 3) * (Math.round(Math.random()) ? 1 : -1), 0, Math.ceil(Math.random() * (6 - 3) + 3) * (Math.round(Math.random()) ? 1 : -1));

        }

        aste_mvt.gravity = (this.scale.x * 20);

        if (o.children[0].material.color.getHexString() !== 'ffffff') o.children[0].material.color.set(0xffffff);

        if(o.userData.type == "BackGround") o.children[0].material.color.set(new THREE.Color("rgb(84, 83, 83)"));

        this.SetInvulnerability(500);
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