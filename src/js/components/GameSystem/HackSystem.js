class HackSystem{

    constructor(parent){

        this.parent = parent;
        
        this.objectManager = this.parent.GetComponent("GameObjectManager");
        this.jokerSytem = this.parent.GetComponent("JokerSystem");
        this.sound_sys = this.parent.GetComponent("SoundSystem");


        this.indexJoker = 0;

    }

    InvincibleMode() {

        this.playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;

        if (this.playerInput.invincible){

            this.playerInput.invincible = false;

            if( this.parent.player.BB !== null){

                this.parent.player.RemoveRigidBody(this.parent.player)
                console.log(" Activation invincible mode")

            }else{

                this.parent.player.SetRigidBoby(this.parent.player.children[0])
                console.log(" Désactivation invincible mode")

            }


        }
        
    }

    NextJoker() {

        this.playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;
        let playerJoker = this.parent.player;

        if (this.playerInput.nj){

            this.playerInput.nj = false;
            
            switch (this.indexJoker){

                case 0:
                    this.parent.PlayerAddLife(1);
                    this.sound_sys.PlayHeartPickUp();
                    console.log("vie supplémentaire");
                    break;

                case 1:
                    this.parent.PlayerAddCoin(1);
                    this.sound_sys.PlayCoinPickUp();
                    console.log("Piece en +");
                    break;
                case 2:
                    playerJoker.GetComponent("PlayerShootProjectiles").AddProjectile(1);
                    console.log("Cannon en plus");
                    break;

            }

            this.indexJoker == this.jokerSytem.joker.length ? this.indexJoker = 0 : this.indexJoker ++;

        }

    }

    KillThemAll(){ 

        this.playerInput = this.parent.player.GetComponent("CharacterControllerInput").keys;

        if (this.playerInput.kta){

            this.playerInput.kta = false;
            let scene = this.parent.scene;

            scene.children.forEach( (e) => {

                if (e.name == "Asteroid"){

                    this.objectManager.Asteroid_Subdivision(e);
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