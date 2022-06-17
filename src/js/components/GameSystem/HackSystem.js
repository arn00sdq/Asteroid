class HackSystem{

    constructor(parent,audio){

        this.parent = parent;
        
        this.jokerSytem = this.parent.GetComponent("JokerSystem");
        this.soundSyst = this.parent.GetComponent("SoundSystem");
        this.audioManager = audio.audioManager

        this.indexJoker = 0;

    }

    InvincibleMode() {

        this.playerInput = this.parent.gameModels.player.GetComponent("CharacterControllerInput").keys;

        if (this.playerInput.invincible){

            this.playerInput.invincible = false;

            if( this.parent.gameModels.player.userData.box3  !== null){

                this.parent.gameModels.player.RemoveRigidBody(this.parent.gameModels.player);
                this.jokerSytem.addShield(this.parent.gameModels.player,this.parent.gameModels.shield);

            }else{

                this.parent.gameModels.player.SetRigidBody(this.parent.gameModels.player);
                this.jokerSytem.removeShield(this.parent.gameModels.player);

            }

        }
        
    }

    NextJoker() {

        let playerInput = this.parent.gameModels.player.GetComponent("CharacterControllerInput").keys;
        let jokerSystem = this.parent.GetComponent("JokerSystem");
        let displayJoker = document.getElementById("joker-cheat");
        let player = this.parent.gameModels.player;

        if (playerInput.nj){

            playerInput.nj = false;
            
            switch (this.indexJoker){

                case 0:
                    jokerSystem.PlayerAddLife(player,1);
                    console.log(this.soundSyst)
                    this.soundSyst.playSfxJoker(this.audioManager.find(e => e.name == "Heart"));
                    displayJoker.innerHTML = "extra-life";
                    break;

                case 1:
                    jokerSystem.PlayerAddCoin(this.parent.score, 1);
                    this.soundSyst.playSfxJoker(this.audioManager.find(e => e.name == "Coin"));
                    displayJoker.innerHTML = "coin";
                    break;
                case 2:
                    player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
                    displayJoker.innerHTML = "extra-missile";
                    this.soundSyst.playSfxJoker(this.audioManager.find(e => e.name == "ItemPick"));
                    break;
                case 3:
 
                    if(player.hasJoker.immune == false){
                        jokerSystem.PlayerProtection(player, this.parent.gameModels.shield,3000);
                        this.soundSyst.playSfxShield(this.audioManager.find(e => e.name == "EnergyShield"));
                    }
                    displayJoker.innerHTML = "shield";
                    break;
                    

                case 4:
                    
                    if(player.hasJoker.fireRate == false){

                        jokerSystem.IncreaseFireRate(player,5000);
                        this.soundSyst.playSfxJoker(this.audioManager.find(e => e.name == "ItemPick"));
    
                    }
                    displayJoker.innerHTML = "firerate increased";

                break;


            }

            this.indexJoker == this.jokerSytem.joker.length - 1 ? this.indexJoker = 0 : this.indexJoker ++;

        }

    }

    KillThemAll(){ 

        let playerInput = this.parent.gameModels.player.GetComponent("CharacterControllerInput").keys;
        let scene = this.parent.currentScene;

        if (playerInput.kta){

            playerInput.kta = false;

            for( var i = scene.children.length - 1; i >= 0; i--) { 
                let obj = scene.children[i];
                console.log(obj.name)
                if(obj.name == "Asteroid" || obj.name == "ennemySS") scene.remove(obj); 
                
            }

        }

    }

    Update(){
        
        this.KillThemAll();
        this.NextJoker();
        this.InvincibleMode();

    }

}

export default HackSystem