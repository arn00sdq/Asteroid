import BulletMouvement from "./BulletMouvement.js";
import BulletDamageSystem from "./BulletDamageSystem.js";

class BasicBullet extends THREE.Group{ 
    constructor(model, scene) {

        super();

        this.components = {};
        this.name = "BasicBullet";
        this.spaceShip = null;
        this.model = model;
        this.scene = scene;

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

        object.BB = new THREE.Box3().copy( object.geometry.boundingBox );
        object.BS = new THREE.Sphere().copy( object.geometry.boundingSphere );

    }

    Instantiate(o,p,r){
        
       /* const matrix = new THREE.Matrix4();
        matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        o.children[0].setMatrixAt(0,matrix)
        o.mesh.setMatrixAt(0,matrix)*/

        o.position.copy(p);
        o.rotation.copy(r);

        this.SetInvulnerability(100);

        this.scene.add(o);
        
    }

    SetInvulnerability(seconds){

        this.BB = null;
        this.BS = null;
           
        setTimeout(() => {

            this.BB = new THREE.Box3().copy( this.children[0].geometry.boundingBox );
            this.BS = new THREE.Sphere().copy( this.children[0].geometry.boundingSphere );

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
