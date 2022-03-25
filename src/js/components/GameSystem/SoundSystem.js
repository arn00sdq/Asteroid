class SoundSystem{

    constructor(parent,audio){

        this.parent = parent;

        this.audioManager = audio.audioManager
        this.sound = audio.sound;

        this.masterVolume = 1;
        this.sfxVolume = 1;
        this.musicVolume = 1;

    }

    PlayCoinPickUp(){

        const CoinBuffer =  this.audioManager.find(e => e.name == "Coin");

        if (this.sound.isPlaying)  this.sound.stop()
        this.sound.setBuffer( CoinBuffer );
        this.sound.setLoop( false );
        this.sound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        this.sound.play();

    }

    PlayHeartPickUp(){

        const heartBuffer =  this.audioManager.find(e => e.name == "Heart");

        if (this.sound.isPlaying)  this.sound.stop()

        this.sound.setBuffer( heartBuffer );
        this.sound.setLoop( false );
        this.sound.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        this.sound.play();

    }

    PlayBulletShoot(listener, delay,volume){

        let audio = new THREE.Audio( listener );

        const bulletBuffer =  this.audioManager.find(e => e.name == "Bullet");

        audio.setBuffer( bulletBuffer );
        audio.setLoop( false );
        audio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        audio.play(delay);

    }

    PlayHitBullet(audio, delay,volume){

        const bulletBuffer =  this.audioManager.find(e => e.name == "BulletHit");

        audio.setBuffer( bulletBuffer );
        audio.setLoop( false );
        audio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );

        audio.play(delay);

    }

    PlayShipDamageTaken(audio, delay,volume){

        const bulletBuffer =  this.audioManager.find(e => e.name == "ShipDamageTaken");

        audio.setBuffer( bulletBuffer );
        audio.setLoop( false );
        audio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        audio.play(delay);

    }

    Update(timeElapsed){}

}

export default SoundSystem