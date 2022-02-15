class Explosion extends THREE.Group{ 

    constructor(scene) {

        super();
        
        this.components = {};
        this.name = "Explosion";
        this.scene = scene;

    }

    InitComponent(){}

    InitMesh(model,scale){

        this.add(model)
        
        this.children[0].scale.copy(scale)

    }

    Instantiate(o,p,r){

        this.position.copy(p);
        this.rotation.copy(r);

        this.scene.add(o);
        
    }
    
    Destroy(object){

        this.params.scene.remove(object);
        object.mesh = null;

    }

    GetComponent(n) {

        return this.components[n];

    }

    AddComponent(c) {
        
        this.components[c.constructor.name] = c;   

    }

    Update(timeElapsed){

        if(this.children[0] !== null){
            
        }

    }

}

export default Explosion
