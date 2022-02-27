import GameObject from "../GameObject.js";
import JokerMovement from "./JokerMovement.js";

class Shield extends GameObject{

    constructor(scene, model, nb){

        super(scene, model);

        this.components = {};
        this.name = "Shield";
   
        this.limit = nb;
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

        this.SetInvulnerability(100);

        this.nb = this.nb + 1;

        this.scene.add(o);
        
    }

}

export default Shield