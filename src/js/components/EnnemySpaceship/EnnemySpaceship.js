import GameObject from '../GameObject.js';

class EnnemySpaceship extends GameObject{ 

    constructor(scene, model, audio) {

        super(scene,model,audio);

        this.components = {};
        this.name = "EnnemySpaceship";

        this.life = 1;

        this.InitComponent();

    }

    InitComponent(){

    }

}

export default EnnemySpaceship
