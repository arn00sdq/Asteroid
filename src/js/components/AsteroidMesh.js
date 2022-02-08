import { Vector3 } from "../three.module.js";
import AsteroidMovement from "./AsteroidMouvement.js";

class BasicAsteroid extends THREE.Group{
    constructor(scene,nbBreak,scale){
        super();
        this.components = {};
        this.mesh = null;
        this.nbBreak = nbBreak;
        this.scene = scene;
        this.InitMesh(scale)
    }
    
    InitComponent(){
        this.AddComponent(new AsteroidMovement(this))
    }

    InitMesh(scale){
        const geometry = new THREE.CylinderGeometry(0.2,0.2,0.2 );
        const material = new THREE.MeshNormalMaterial( );
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.scale.copy(scale);

        this.mesh.geometry.computeBoundingBox();
        this.mesh.geometry.computeBoundingSphere();

        this.mesh.BB = new THREE.Box3().copy( this.mesh.geometry.boundingBox );
        this.mesh.BS = new THREE.Sphere().copy( this.mesh.geometry.boundingSphere );

        this.add(this.mesh);

    }  

    Update(timeElapsed) {
        if(this.mesh !== null){
            this.rotation.x = (this.rotation.x + (Math.PI / 180) * timeElapsed * 10 );
            this.rotation.y = (this.rotation.y + (Math.PI / 180) * timeElapsed * 10 );
            this.rotation.z = (this.rotation.z + (Math.PI / 180) * timeElapsed * 10);
        }
    }

    Instantiate(o,p,r,s){
        
        o.position.copy(p);
        o.rotation.copy(r);

        s.add(o);
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
}

export default BasicAsteroid