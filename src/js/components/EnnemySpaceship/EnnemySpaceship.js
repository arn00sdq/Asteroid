import GameObject from '../GameObject.js';
import EnnemySSHealthSystem from './EnnemySSHealthSystem.js';
import SpaceshipComportement from './SpaceshipComportement.js';

class EnnemySpaceship extends GameObject{ 

    constructor(model, audio) {

        super(model,audio);

        this.components = {};
        this.name = "EnnemySpaceship";

        this.asteroid = null;
        this.weaponParams = null;
        this.target = null;
        
        this.audio_syst = null;
        this.stageSystem = null;

        this.InitComponent();
        this.InitValue();

    }

    InitComponent(){

        this.AddComponent( new SpaceshipComportement(this));
        this.AddComponent( new EnnemySSHealthSystem(this));

    }

    InitValue(){

        this.GetComponent("SpaceshipComportement").AddProjectile( 1 );

    }

}

export default EnnemySpaceship
