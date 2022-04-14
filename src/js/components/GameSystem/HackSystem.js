class HackSystem{

    constructor(parent){

        this.parent = parent;
        
        this.jokerSytem = this.parent.GetComponent("JokerSystem");
        this.sound_sys = this.parent.GetComponent("SoundSystem");

        this.indexJoker = 0;

    }

    InvincibleMode() {

        this.playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;

        if (this.playerInput.invincible){

            this.playerInput.invincible = false;

            if( this.parent.player.userData.box3  !== null){

                this.parent.player.RemoveRigidBody(this.parent.player)
                console.log(" Activation invincible mode")

            }else{

                this.parent.player.SetRigidBody(this.parent.player)
                console.log(" Désactivation invincible mode")

            }

        }
        
    }

    NextJoker() {

        let playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;
        let jokerSystem = this.parent.GetComponent("JokerSystem");
        let displayJoker = document.getElementById("joker-cheat");
        let player = this.parent.player;

        if (playerInput.nj){

            playerInput.nj = false;
            
            switch (this.indexJoker){

                case 0:
                    jokerSystem.PlayerAddLife(player,1);
                    this.sound_sys.PlayHeartPickUp();
                    displayJoker.innerHTML = "extra-life";
                    break;

                case 1:
                    jokerSystem.PlayerAddCoin(this.parent.score, 1);
                    this.sound_sys.PlayCoinPickUp();
                    displayJoker.innerHTML = "coin";
                    break;
                case 2:
                    player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
                    displayJoker.innerHTML = "extra-missile";
                    break;
                case 3:
 
                    if(player.hasJoker.immune == false){

                        jokerSystem.PlayerProtection(player, this.parent.shield,3000);
                    }
                    break;
                    displayJoker.innerHTML = "shield";

                case 4:
                    
                    if(player.hasJoker.fireRate == false){

                        jokerSystem.IncreaseFireRate(player,5000);
    
                    }
                    displayJoker.innerHTML = "firerate increased";

                break;


            }

            this.indexJoker == this.jokerSytem.joker.length - 1 ? this.indexJoker = 0 : this.indexJoker ++;

        }

    }

    KillThemAll(){ 

        let playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;
        let scene = this.parent.currentScene;

        if (playerInput.kta){

            playerInput.kta = false;

            for( var i = scene.children.length - 1; i >= 0; i--) { 
                let obj = scene.children[i];
                if(obj.name == "Asteroid") scene.remove(obj); 
                
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