import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import PlayerHealthSystem from "./PlayerHealthSystem.js";

import ThirdPersonCamera from '../Camera/thirdPersonCamera.js';
import StaticCamera from "../Camera/StaticCamera.js";
import CameraTracking from "../Camera/CameraTracking.js";

import GameObject from '../GameObject.js';

class Player extends GameObject{ 

    constructor(params, model, audio) {

        super(params.scene,model,audio);

        this.components = {};
        this.name = "Player";
        
        this.params = params;
        
        this.immune = false;

        this.audio_syst = null;

        this.life = 1;

        this.InitComponent();
        this.InitValue();

    }

    InitComponent(){

        this.AddComponent(new CameraTracking(this));
        this.AddComponent(new StaticCamera(this));
        this.AddComponent(new ThirdPersonCamera(this));

        
        
        this.AddComponent(new CharacterControllerInput(this));
        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerHealthSystem(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.audio));

        for (const property in this.children) {

            console.log("ee",property)

        }
        this.children.forEach(e => { console.log("dd")})

        console.log("ee", this)

        
    }

    InitValue(){

       if (this.constructor.name =="Player") this.GetComponent("PlayerShootProjectiles").AddProjectile(1);
    

    }

}

export default Player
