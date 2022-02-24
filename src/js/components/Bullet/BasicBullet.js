import BulletMouvement from "./BulletMouvement.js";
import BulletDamageSystem from "./BulletDamageSystem.js";

class BasicBullet extends THREE.Object3D{ 
    constructor(model, scene, audio) {

        super();

        this.components = {};
        this.name = "BasicBullet";
        this.spaceShip = null;
        this.model = model;
        this.scene = scene;
        this.index = 0;
        this.audio = audio;
        this.InitComponent();
        
    }

    InitComponent() {

        this.AddComponent(new BulletMouvement(this))
        this.AddComponent(new BulletDamageSystem(this))

    }

    InitMesh(){

        this.add(this.model);

        this.children[0].geometry.computeBoundingBox();
        this.children[0].geometry.computeBoundingSphere();

        this.children[0].BB = new THREE.Box3().copy( this.children[0].geometry.boundingBox );
        this.children[0].BS = new THREE.Sphere().copy( this.children[0].geometry.boundingSphere );


        //this.SetRigidBoby(this.children[0])
        
    }
    
    SetRigidBoby(object){

        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        this.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    Instantiate(o,p,r){
        
        const dummy = new THREE.Object3D
        dummy.position.copy(p);
        dummy.rotation.copy(r);

        o.children[0].setMatrixAt(this.index,dummy.matrix)

        o.position.copy(p);
        o.rotation.copy(r);

        this.SetInvulnerability(100);
        
        this.scene.add(o);
        
    }

    SetInvulnerability(seconds){;
           
        setTimeout(() => {

            this.SetRigidBoby(this.children[0]);

        }, seconds);

    }

    Destroy(object){

        this.parent.remove(object.mesh);
        this.parent.remove(object);

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
            
            for (let k in this.components) {

                this.components[k].Update(timeElapsed);

            }
            
        }
        
    }

}

export default BasicBullet
