class HackSystem{

    constructor(parent){

        this.parent = parent

    }

    KillThemAll(){ // lancé par le update futur composant

        let playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys
        console.log(playerInput.kta)

    }

    Update(){
        
        this.KillThemAll();

    }

}

export default HackSystem