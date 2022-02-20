import JokerMovement from "./JokerMovement.js";

class Heart extends THREE.Group{

    constructor(scene, model){

        super();

        this.components = {}

        this.model = model;
        this.name = "Heart"
        
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

        object.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        object.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    SetInvulnerability(seconds){

        this.BB = null;
        this.BS = null;
       if(this.children[0]){

            setTimeout(() => {

                this.BB = new THREE.Box3().copy( this.children[0].geometry.boundingBox );
                this.BS = new THREE.Sphere().copy( this.children[0].geometry.boundingSphere );

            }, seconds);

       } 

    }

  ;

    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        this.SetInvulnerability(500);

        this.scene.add(o);
        
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

export default Heart