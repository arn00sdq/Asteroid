class GameManager {

    constructor(scene){

        this.player = null;
        this.asteroid = null; 
        this.limite = 15;

        this.scene = scene;
        this.score = 0;
        this.ennemy = 0;
        this.level = "1"

    }

    OnPlayerEnd() {

        document.getElementById("end_game").style.display = "";

    }

    InstantiatePlayer(){
        this.player.InitMesh(new THREE.Vector3(0.05,0.05,0.05));
        this.player.Instantiate(this.player,new THREE.Vector3(0,0,0), new THREE.Euler(0,0,0),this.scene);
    }

    InstantiateWave(){
        this.asteroid.InitComponent();
        this.asteroid.InitMesh(new THREE.Vector3(0.0003,0.0003,0.0003));
        
        
        for (let index = 0; index < 2; index++) {

            let rVectorPos = new THREE.Vector3( ( ( Math.random() *  ( 10.5 - 8.5 )) + 8.5 ) * (Math.round(Math.random()) ? 1 : -1) , 
                                                  0 ,
                                                ( (Math.random() *  ( 10.5 - 2 ) )+ 2  ) * (Math.round(Math.random()) ? 1 : -1)
                                              )

            let rEuleurRot = new THREE.Euler(0,0,0)
            let asteClone = this.asteroid.clone();
            
            asteClone.children[0].material = this.asteroid.children[0].material.clone();
            asteClone.scene = this.scene;
            asteClone.nbBreak = this.asteroid.nbBreak;

            asteClone.Instantiate(asteClone, rVectorPos, rEuleurRot)

        }

    }

    printScore(){
        
        document.getElementById("score").appendChild = this.score;

    }

    PrintLife(life) {

        if(life !== undefined) document.getElementById("life").innerHTML = life;

    }

    CountEnnemy(nbEnnemyFrame){

        this.ennemy = nbEnnemyFrame;

        document.getElementById("remaining_asteroid").innerHTML = this.ennemy;

    }

}

export default GameManager