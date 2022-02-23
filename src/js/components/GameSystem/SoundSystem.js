class SoundSystem{

    constructor(parent,audio){

        this.parent = parent;

        this.audioManager = audio.audioManager
        this.sound = audio.sound;

    }

    PlayCoinPickUp(){

        const CoinBuffer =  this.audioManager.find(e => e.name == "Coin");

        if (this.sound.isPlaying)  this.sound.stop()
        this.sound.setBuffer( CoinBuffer );
        this.sound.setLoop( false );
        this.sound.setVolume( 1 );
        this.sound.play();

    }

    PlayHeartPickUp(){

        const heartBuffer =  this.audioManager.find(e => e.name == "Heart");

        if (this.sound.isPlaying)  this.sound.stop()

        this.sound.setBuffer( heartBuffer );
        this.sound.setLoop( false );
        this.sound.setVolume( 1 );
        this.sound.play();

    }

    PlayBulletShoot(audio, delay,volume){

        const bulletBuffer =  this.audioManager.find(e => e.name == "Bullet");

        audio.setBuffer( bulletBuffer );
        audio.setLoop( false );
        audio.setVolume( volume );
        audio.play(delay);

    }

    Update(timeElapsed){}

}

export default SoundSystem