import Component from './component.js';
import {GLTFLoader} from "../GLTFLoader.js";

class ShipMesh extends Component{
    constructor(models,params){
        super();   
        this.soldier = null;
        this.LoadModel(params);
        
        
    }
    
    InitComponent() {}

    LoadModel(params){
        let me = this;
        this._params = params
        const loader = new GLTFLoader();
        loader.load('../medias/models/SpaceShipAnim.gltf',  function(gltf) {
            me.soldier = gltf.scene;
            me.soldier.scale.set(0.1,0.1,0.1)
            me._params.scene.add(gltf.scene);
            me.mixer = new THREE.AnimationMixer( gltf.scene );
        
           /* gltf.animations.forEach( ( clip ) => {
            console.log( gltf.animations)
            me.mixer.clipAction( clip ).play();
          
            } );*/
        });
        
    }

}

export default {ShipMesh,Component}