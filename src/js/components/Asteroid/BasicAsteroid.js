import AsteroidMovement from "./AsteroidMouvement.js";
import AsteroidHealthSystem from "./AsteroidHealthSystem.js";
import GameObject from "../GameObject.js";

class BasicAsteroid extends GameObject{

    constructor(scene,model,nbBreak){

        super(scene,model);

        this.components = {};

        this.name = "Asteroid"
        this.nbBreak = nbBreak;
        this.life = 35;
        
        this.InitComponent();

    }
    
    InitComponent(){

        this.AddComponent(new AsteroidMovement(this))
        this.AddComponent(new AsteroidHealthSystem(this))

    }

    Instantiate(o,p,r,s){
        
        super.Instantiate(o,p,r,s);

        this.GetComponent("AsteroidMovement").InitComponent();

        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        if (o.children[0].material.color.getHexString() !== 'ffffff')  o.children[0].material.color.set(0xffffff);

        this.SetInvulnerability(500);
        this.life = this.life / (this.nbBreak + 1);
        
        this.scene.add(o);
        
    }

    Destroy(object){

        super.Destroy(object);

        object.mesh = null;
       
        this.scene.remove(object);
            
    }

}

export default BasicAsteroid