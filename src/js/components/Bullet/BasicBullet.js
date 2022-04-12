import BulletMouvement from "./BulletMouvement.js";
import BulletDamageSystem from "./BulletDamageSystem.js";
import GameObject from "../GameObject.js";

class BasicBullet extends GameObject{ 

    constructor(model, audio) {

        super(model, audio);

        this.components = {};
        this.name = "BasicBullet";

        this.spaceShip = null;
        this.timerInstantiate = null;

        this.index = 0;
        this.InitComponent();
        
    }

    InitComponent() {

        this.AddComponent(new BulletMouvement(this))
        this.AddComponent(new BulletDamageSystem(this))

    }
    

}

export default BasicBullet
