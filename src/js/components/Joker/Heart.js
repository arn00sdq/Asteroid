import JokerMovement from "./JokerMovement.js";

class Heart extends THREE.Object3D{

    constructor(scene, model){

        super();

        this.components = {};
        this.model = model;
        this.vscale = 0.05;
        
        this.name = "Heart";
        this.type == "Joker"

        this.nb = 0;
        this.limit = 1;
      
        this.scene = scene;
        this.InitComponent();

    }

    InitComponent() {

        this.AddComponent(new JokerMovement(this))

    }

    InitMesh(scale){

        this.add(this.model);
        
        this.children[0].scale.copy(scale)
        this.SetRigidBoby(this.children[0]);
        
    }  

    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        this.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }


    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.SetRigidBoby(this.children[0]);
        
        this.scene.add(o);
        
    }

    Destroy(object){

        object.mesh = null;
       

        this.scene.remove(object);
            

 
    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;  

    }

    Update(timeElapsed){

        if(this.children[0] !== null){   

            for (let k in this.components) {

                this.components[k].Update(timeElapsed);
            }
        }

    }

}

export default Heart