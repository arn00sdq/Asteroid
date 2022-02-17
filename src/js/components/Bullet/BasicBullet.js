import BulletMouvement from "./BulletMouvement.js";
import BulletDamageSystem from "./BulletDamageSystem.js";

class BasicBullet extends THREE.Group{ 
    constructor() {

        super();

        this.components = {};
        this.name = "BasicBullet";
        this.mesh = null;
        this.spaceShip = null;
        this.InitComponent();
        
    }

    InitComponent() {

        this.AddComponent(new BulletMouvement(this))
        this.AddComponent(new BulletDamageSystem(this))

    }

    InitMesh(){

        const geometry = new THREE.CylinderGeometry(0.01,0.01,0.1,12,2,false);
        const material = new THREE.MeshLambertMaterial( );
        
        material.color.set(0xff0000)
        material.emissive.set(0xff000d)

        this.mesh = new THREE.Mesh( geometry, material );

        this.mesh.rotateX( (Math.PI / 180) *90 );

        this.mesh.geometry.computeBoundingBox();
        this.mesh.geometry.computeBoundingSphere();

        this.BB = new THREE.Box3().copy( this.mesh.geometry.boundingBox );
        this.BS = new THREE.Sphere().copy( this.mesh.geometry.boundingSphere );

        this.add(this.mesh);
        
    }

    Instantiate(o,p,r,s){
        
        this.position.copy(p);
        this.rotation.copy(r);

        s.add(o)
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
        
        if(this.mesh !== null){
            
            for (let k in this.components) {

                this.components[k].Update(timeElapsed);

            }
            
        }
        
    }

}

export default BasicBullet
