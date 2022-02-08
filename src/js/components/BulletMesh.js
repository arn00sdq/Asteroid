import Component from './component.js';
import {GLTFLoader} from "../GLTFLoader.js";

class BulletMesh extends Component{
    constructor(){
        super();   
        this.mesh  = null;
        this.gameEntities = null;
        this.asteroidBox = null;
        this.speed = 0.1;
        this.destroy = false;
    }
    
    InitComponent(){
        const geometry = new THREE.CylinderGeometry(0.2,0.2,0.2 );
        const material = new THREE.MeshNormalMaterial( );
        this.mesh = new THREE.Mesh( geometry, material );

        this.mesh.geometry.computeBoundingBox();
        this.mesh.geometry.computeBoundingSphere();

        this.mesh.BB = new THREE.Box3().copy( this.mesh.geometry.boundingBox );
        this.mesh.BS = new THREE.Sphere().copy( this.mesh.geometry.boundingSphere );

       // this.parent.params.scene.add(this.mesh);
    }

    Update() {
        if(this.mesh !== null && !('consumed' in this.mesh.userData)){
            this.parent.translateZ(this.speed);
            this.mesh.position.copy(this.parent.position);
            this.mesh.rotation.copy(this.parent.rotation);
            this.parent.checkCollision(this,"ShipMesh",false);
        } 
    }

    
}

export default {BulletMesh,Component}