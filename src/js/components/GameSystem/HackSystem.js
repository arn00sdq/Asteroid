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
        let joker_sys = this.parent.GetComponent("JokerSystem");
        
        let player = this.parent.player;

        if (playerInput.nj){

            playerInput.nj = false;
            
            switch (this.indexJoker){

                case 0:
                    joker_sys.PlayerAddLife(player,1);
                    this.sound_sys.PlayHeartPickUp();
                    console.log("vie supplémentaire");
                    break;

                case 1:
                    joker_sys.PlayerAddCoin(this.parent.score, 1);
                    this.sound_sys.PlayCoinPickUp();
                    console.log("Piece en +");
                    break;
                case 2:
                    player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
                    console.log("Cannon en plus");
                    break;
                case 3:
                    joker_sys.PlayerProtection(this.parent.player, this.parent.shield,3000);
                    console.log("Protection");
                    break;

            }

            this.indexJoker == this.jokerSytem.joker.length ? this.indexJoker = 0 : this.indexJoker ++;

        }

    }

    KillThemAll(){ 

        let playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;
        let objectManager = this.parent.GetComponent("GameObjectManager");

        if (playerInput.kta){

            playerInput.kta = false;
            let scene = this.parent.scene;

            scene.children.forEach( (e) => {

                if (e.name == "Asteroid"){

                    e.nbBreak += 1;
                    if (e.nbBreak < 2)  objectManager.Asteroid_Subdivision(e);
                    e.Destroy(e);

                }

            });

        }

    }

    Update(){
        
        this.KillThemAll();
        this.NextJoker();
        this.InvincibleMode();

    }

}

export default HackSystem