import AsteroidMovement from "./AsteroidMouvement.js";
import AsteroidHealthSystem from "./AsteroidHealthSystem.js";

class BasicAsteroid extends THREE.Group{

    constructor(scene,nbBreak){

        super();
        this.components = {};
        this.name = "Asteroid"
        this.nbBreak = nbBreak;
        this.scene = scene;
        this.InitComponent();

    }
    
    InitComponent(){

        this.AddComponent(new AsteroidMovement(this))
        this.AddComponent(new AsteroidHealthSystem(this))

    }

    InitMesh(model,scale){
        
        this.add(model);

        this.children[0].scale.copy(scale)
        this.SetRigidBoby(this.children[0])
        
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

    Instantiate(o,p,r){
        
        o.position.copy(p);
        o.rotation.copy(r);

        this.SetInvulnerability(500);
        this.scene.add(o);
        
    }

    Destroy(object){
       
        this.scene.remove(object);
        object.mesh = null;
    }

    GetComponent(n) {

        return this.components[n];

    }

    AddComponent(c) {

        this.components[c.constructor.name] = c;  

    }

    Update(timeElapsed) {

        if(this.children[0] !== null){   

            for (let k in this.components) {

                this.components[k].Update(timeElapsed);
            }
        }
    }
}

export default BasicAsteroid