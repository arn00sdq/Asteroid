class PlayerHealthSystem{

    constructor(parent) {

        this.parent = parent;

    }

    Update() {}

    Damage(lifeAmount){

        this.parent.life -= lifeAmount
        
        if (this.parent.life < 0) this.parent.life = 0

    }

    Heal(healAmount){

        this.parent.life += healAmount;
        if (this.parent.life > 0) this.parent.life = this.parent.life

    }
}

export default PlayerHealthSystem;