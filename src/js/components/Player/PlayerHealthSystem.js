class PlayerHealthSystem{

    constructor(parent) {

        this.parent = parent;
        this.life = 1;

    }

    Update() {}

    Damage(lifeAmount){

        this.life -= lifeAmount
        
        if (this.life < 0) this.life = 0

    }

    Heal(healAmount){

        this.life += healAmount;
        if (this.life > 0) this.life = this.life

    }
}

export default PlayerHealthSystem;