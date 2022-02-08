import BulletMesh from './BulletMesh.js'
import AsteroidMesh from './AsteroidMesh.js';
import {GLTFLoader} from "../GLTFLoader.js";
import ThirdPersonCamera from './thirdPersonCamera.js';
import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js'
import * as THREE from '../three.module.js'

class Player extends THREE.Group{ 
    constructor(params) {
        super();
        this.components = {};
        this.name = "GameObject";
        this.mesh = null;
        this.params = params;
        this.InitComponent();
        this.InitMesh();
    }

    InitComponent(){
        this.AddComponent(new ThirdPersonCamera(this));
        this.AddComponent(new CharacterControllerInput(this));
        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.params.weapon));
       
    }

    InitMesh(){
        let me = this;
        const loader = new GLTFLoader();
        loader.load('../medias/models/SpaceShip.gltf',  function(gltf) {
            me.mesh = gltf.scene.children[0];
            me.mesh.geometry.computeBoundingBox();
            me.mesh.geometry.computeBoundingSphere();
            
            me.mesh.BB = new THREE.Box3().copy( me.mesh.geometry.boundingBox );
            me.mesh.BS = new THREE.Sphere().copy( me.mesh.geometry.boundingSphere );

            me.mesh.scale.set(0.05,0.05,0.05)

            me.add(me.mesh);
            //me.rotation.x = Math.PI / 180 * 90;
            //me.rotation.y = (Math.PI / 180) * 180;
        }); 
    }

    Instantiate(o,p,r,s){

        this.position.copy(p);
        this.rotation.copy(r);

        s.add(o)
        
    }
    
    Destroy(object){
        this.params.scene.remove(object);
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

export default Player
