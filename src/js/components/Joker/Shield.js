import JokerMovement from "./JokerMovement.js";

class Shield extends THREE.Object3D{

    constructor(scene, model){

        super();

        this.components = {};
        this.vscale = 1;

        this.model = model;

        this.name = "Shield";
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

    RemoveRigidBody(object) {

        object.BB = null;
        object.BS = null;

    }



    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.SetRigidBoby(this.children[0]);

        this.scene.add(o);
        
    }

    InstantiateAndDestroy(o,p,r,s,t){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))
        
        this.scene.add(o);

        setTimeout(() => {

            this.Destroy(o)

        }, t);


    }

    Destroy(object){

        object.mesh = null;
       
        setTimeout(() => {

            this.scene.remove(object);
            

        }, 150);
 
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

export default Shield