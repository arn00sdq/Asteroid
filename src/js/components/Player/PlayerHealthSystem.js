import * as THREE from 'three';

class PlayerHealthSystem{

    constructor(parent) {

        this.parent = parent;
        this.healthLimit = 3

    }

    Update() {}

    Damage(lifeAmount){

        this.parent.life -= lifeAmount
        
        if (this.parent.life < 0) this.parent.life = 0

    }

    Heal(healAmount){
        
        if(this.parent.life < this.healthLimit) this.parent.life += healAmount;
        
        if (this.parent.life > 0) this.parent.life = this.parent.life

    }
}

export default PlayerHealthSystem;