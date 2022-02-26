import GameObject from '../GameObject.js';
import SpaceshipComportement from './SpaceshipComportement.js';

class EnnemySpaceship extends GameObject{ 

    constructor(scene, model, audio) {

        super(scene,model,audio);

        this.components = {};
        this.name = "EnnemySpaceship";
        this.asteroid = null;

        this.life = 1;

        this.InitComponent();

    }

    InitComponent(){

        this.AddComponent( new SpaceshipComportement(this))

    }

}

export default EnnemySpaceship
