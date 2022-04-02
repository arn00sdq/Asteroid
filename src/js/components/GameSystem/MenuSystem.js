class MenuSystem{

    constructor(parent){

        this.parent = parent;

        this.ui_display = this.parent.GetComponent("DisplaySystem");
        this.level_system = this.parent.GetComponent("LevelSystem");
        this.sound_sys = this.parent.GetComponent("SoundSystem");

        document.addEventListener('click', (e) => this.OnClick(e), false);
        document.addEventListener("change", (e) => this.OnChange(e), false);
    }

    OnClick(event) {
        console.log(event.target.id)
        switch (event.target.id) {

            case "retour":
                this.ui_display.printPause();
                break;
            case "resume":
                this.parent.state.pause = false;
                this.ui_display.printUIHeader(this.parent.player.life, this.parent.score);
                break;
            case "restart":
                this.parent.GetComponent("LevelSystem").ResetLevel();
                this.level_system.StartLevel(this.level_system.currentLevel, false);
                break;
            case "next":
                this.parent.GetComponent("LevelSystem").ResetLevel();
                let currentLevel = this.level_system.currentLevel + 1;
                this.level_system.StartLevel(currentLevel, false);
                break;
            case "audio":
                this.ui_display.printAudioUIMenu();
                break;
            case "video":
                this.ui_display.printVideoUIMenu();
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
                sound_sys.masterVolume = event.target.value / 100;
                document.getElementById("sp_master_volume").innerHTML = sound_sys.masterVolume;
                break;
            case "range_sfx_volume":
                sound_sys.sfxVolume = event.target.value / 100;
                document.getElementById("sp_sfx_volume").innerHTML = sound_sys.sfxVolume;
                break;
            case "range_music_volume":
                sound_sys.musicVolume = event.target.value / 100;
                document.getElementById("sp_music_volume").innerHTML = sound_sys.musicVolume;
                break;
            default:
                break;

        }

    }

    Update(){}

}

export default MenuSystem