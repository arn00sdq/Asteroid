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

    Instantiate(o,p,r,s){
        
        super.Instantiate(o,p,r,s);

        o.position.copy(p);
        o.rotation.copy(r);

        let bullet_mvt = this.GetComponent("BulletMouvement");
        bullet_mvt.velocity.set(0,0,1);
        this.SetInvulnerability(100);
        
        this.scene.add(o);
        
    }
    

}

export default BasicBullet
