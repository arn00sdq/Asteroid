import BulletMouvement from "./BulletMouvement.js";
import BulletDamageSystem from "./BulletDamageSystem.js";
import GameObject from "../GameObject.js";
import * as THREE from 'three';
import SpecialBulletAnim from "./SpecialBulletAnim.js";


class SpecialBullet extends GameObject{ 

    constructor(model, audio) {

        super(model, audio);

        this.components = {};
        this.name = "SpecialBullet";

        this.spaceShip = null;
        this.timerInstantiate = null;

        this.index = 0;
        this.InitComponent();
        
    }

    InitComponent() {

        this.AddComponent(new BulletMouvement(this));
        this.AddComponent(new BulletDamageSystem(this));
        this.AddComponent(new SpecialBulletAnim(this));

    }
    

}

export default SpecialBullet
