import AsteroidMovement from "./AsteroidMouvement.js";
import AsteroidHealthSystem from "./AsteroidHealthSystem.js";

class BasicAsteroid extends THREE.Group{

    constructor(scene,model,nbBreak){

        super();

        this.components = {};
        this.model = model
        this.scene = scene;

        this.name = "Asteroid"
        this.nbBreak = nbBreak;
        this.life = 35;
        
        this.InitComponent();

    }
    
    InitComponent(){

        this.AddComponent(new AsteroidMovement(this))
        this.AddComponent(new AsteroidHealthSystem(this))

    }

    InitMesh(scale){
        
        this.add(this.model);

        this.children[0].scale.copy(scale)
        
    }  

    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        this.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    SetInvulnerability(seconds){

       if(this.children[0]){
           
            setTimeout(() => {

                this.SetRigidBoby(this.children[0]);

            }, seconds);
       } 

    }

    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);
        o.scale.copy(new THREE.Vector3(s,s,s))

        if (o.children[0].material.color.getHexString() !== 'ffffff')  o.children[0].material.color.set(0xffffff);

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