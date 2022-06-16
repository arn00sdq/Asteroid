import GameObject from "../GameObject.js";
import EnnemySSHealthSystem from './EnnemySSHealthSystem.js';
import SpaceshipComportement from './SpaceshipComportement.js';

class EnnemySpaceship extends GameObject{ 

    constructor(gameObject) {

        super(gameObject);

        this.sceneManager = null;

        this.components = {};
        this.name = "EnnemySpaceship";

        if (!gameObject) gameObject = {name: "", params: null, audio : null, utils : null};

        this.name = gameObject.name;
        this.params = gameObject.params;
        this.audio = gameObject.audio;
        this.utils = gameObject.utils,

        this.target = null;

        this.audioSystem = null;
        this.stageSystem = null;

        this.InitComponent();
        this.InstantiateCannon();

    }

    InitComponent(){

        this.AddComponent( new SpaceshipComportement(this));
        this.AddComponent( new EnnemySSHealthSystem(this));

    }

    InstantiateCannon(){

        this.GetComponent("SpaceshipComportement").AddProjectile( 1 );
    }

    InitValue(){

        this.target = this.sceneManager.gameModels.player;

        this.audioSystem = this.sceneManager.GetComponent("SoundSystem");
        this.stageSystem = this.sceneManager.GetComponent("LevelSystem");   

    }

}

export default EnnemySpaceship
