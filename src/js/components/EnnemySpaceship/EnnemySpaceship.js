import GameObject from '../GameObject.js';
import EnnemySSHealthSystem from './EnnemySSHealthSystem.js';
import SpaceshipComportement from './SpaceshipComportement.js';

class EnnemySpaceship extends GameObject{ 

    constructor(scene, model, audio) {

        super(scene,model,audio);

        this.components = {};
        this.name = "EnnemySpaceship";

        this.asteroid = null;
        this.weaponParams = null;
        this.target = null;

        this.InitComponent();

    }

    InitComponent(){

        this.AddComponent( new SpaceshipComportement(this));
        this.AddComponent( new EnnemySSHealthSystem(this));

        if (this.constructor.name =="EnnemySpaceship") this.GetComponent("SpaceshipComportement").AddProjectile(1);

    }

}

export default EnnemySpaceship
