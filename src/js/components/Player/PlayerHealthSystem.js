import * as THREE from 'three';

class PlayerHealthSystem{

    constructor(parent) {

        this.parent = parent;

        this.life = 1;
        this.healthLimit = 3;

    }

    Update() {}

    Damage(lifeAmount){

        this.life -= lifeAmount
        
        if (this.life < 0) this.life = 0

    }

    Heal(healAmount){
        
        if(this.life < this.healthLimit) this.life += healAmount;
        
        if (this.life > 0) this.life = this.life

    }
}

export default PlayerHealthSystem;