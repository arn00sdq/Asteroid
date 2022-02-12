class PlayerHealthSystem{

    constructor(parent) {

        this.parent = parent;
        this.life = 3;

    }

    Update() {}

    Damage(lifeAmount){

        this.life -= lifeAmount
        if (this.life < 0) this.life = 0

        console.log(this.life)
    }

    Heal(healAmount){

        this.life += healAmount;
        if (this.life > 0) this.life = this.life

    }
}

export default PlayerHealthSystem;