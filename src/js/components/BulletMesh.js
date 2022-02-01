import Component from './component.js';
import {GLTFLoader} from "../GLTFLoader.js";

class BulletMesh extends Component{
    constructor(){
        super();   
        this.cylinder  = null;
    }
    

    InitComponent(){
        const geometry = new THREE.CylinderGeometry(0.2,0.2,0.2 );
        const material = new THREE.MeshNormalMaterial( );
        this.cylinder = new THREE.Mesh( geometry, material );
        this.parent.params.scene.add(this.cylinder);
    }

    Update() {
        this.cylinder.position.copy(this.parent.position);
        this.cylinder.rotation.copy(this.parent.rotation);
        
    }
}

export default {BulletMesh,Component}