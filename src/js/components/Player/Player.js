import PlayerShootProjectiles from './PlayerShootProjectiles.js';
import CharacterControllerInput from './playerInput.js';
import CharacterMouvement  from './playerMouvement.js';
import PlayerHealthSystem from "./PlayerHealthSystem.js";

import GameObject from '../GameObject.js';
import PlayerCameraSystem from './PlayerCameraSystem.js';

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

        this.AddComponent(new CharacterMouvement(this));
        this.AddComponent(new PlayerHealthSystem(this));
        this.AddComponent(new PlayerShootProjectiles(this,this.audio));
        this.AddComponent(new PlayerCameraSystem(this, this.params));
        this.AddComponent(new CharacterControllerInput(this));
        
    }

    InitValue(){

       if (this.constructor.name =="Player") this.GetComponent("PlayerShootProjectiles").AddProjectile( 1 );

    }

}

export default Player
