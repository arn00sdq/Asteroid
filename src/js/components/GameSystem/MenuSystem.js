class MenuSystem{

    constructor(parent){

        this.parent = parent;

        this.uiDisplay = this.parent.GetComponent("DisplaySystem");
        this.levelSystem = this.parent.GetComponent("LevelSystem");
        this.soundSystem = this.parent.GetComponent("SoundSystem");

        document.addEventListener('click', (e) => this.OnClick(e), false);
        document.addEventListener("change", (e) => this.OnChange(e), false);
    }

    OnClick(event) {

        switch (event.target.id) {

            case "play":
                this.levelSystem .ScenePicker("Stage1",false);
                break;
            case "retour":
                this.levelSystem.currentLevel == "StartMenu" ? this.uiDisplay.printUIStartMenu() : this.uiDisplay.printPause();
                break;
            case "resume":
                this.parent.state.pause = false;
                this.uiDisplay.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "restart":
                this.levelSystem .ResetLevel(this.levelSystem.currentLevel);
                this.levelSystem.ScenePicker(this.levelSystem.currentLevel, false);
                break;
            case "next":
                this.levelSystem .ResetLevel();
                let currentLevel = this.levelSystem.currentLevel + 1;
                this.levelSystem.StartLevel(currentLevel, false);
                break;
            case "audio":
                this.uiDisplay.printAudioUIMenu();
                break;
            case "video":
                this.uiDisplay.printVideoUIMenu();
                break;
            case "sp_post_process":
                this.parent.state.postProcess == false ? this.parent.state.postProcess = true: this.parent.state.postProcess=false;
                break;
            case "quit":
                document.location.href = "index.html";
                break;
            default:
                break;

        }

    }

    OnChange(event) {

        switch (event.target.id) {

            case "range_master_volume":
                soundSystem.masterVolume = event.target.value / 100;
                document.getElementById("sp_master_volume").innerHTML = soundSystem.masterVolume;
                break;
            case "range_sfx_volume":
                soundSystem.sfxVolume = event.target.value / 100;
                document.getElementById("sp_sfx_volume").innerHTML = soundSystem.sfxVolume;
                break;
            case "range_music_volume":
                soundSystem.musicVolume = event.target.value / 100;
                document.getElementById("sp_music_volume").innerHTML = soundSystem.musicVolume;
                break;
            default:
                break;

        }

    }

    Update(){}

}

export default MenuSystem