class GameManager {
    constructor(scene){
        this.scene = scene;
        this.score = 0;
        this.ennemy = 0;
    }

    printScore(){
        document.getElementById("score").appendChild = this.score;
    }

    printEnnemyRemaining(){
        document.getElementById("remaining_asteroid").innerHTML = this.ennemy;
    }

    Update(){
        let nbEnnemy = 0;
        this.scene.children.forEach( e => {
            if(e.name == "Asteroid") nbEnnemy++;
        })
        this.ennemy = nbEnnemy;

        this.printEnnemyRemaining()
    }
}

export default GameManager