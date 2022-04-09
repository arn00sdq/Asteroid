import * as THREE from 'three';

class SoundSystem{

    constructor(parent,audio){

        this.parent = parent;

        this.audioManager = audio.audioManager
        this.sound = audio.sound;

        this.masterVolume = 0.5;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.5;

    }

    PlayCoinPickUp(){

        const CoinBuffer =  this.audioManager.find(e => e.name == "Coin");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        if (playerAudio.isPlaying)  playerAudio.stop()
        playerAudio.setBuffer( CoinBuffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }

    PlayHeartPickUp(){

        const CoinBuffer =  this.audioManager.find(e => e.name == "Coin");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        if (playerAudio.isPlaying)  playerAudio.stop()
        playerAudio.setBuffer( CoinBuffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }

    PlayBulletShoot(){
      
        const bulletBuffer =  this.audioManager.find(e => e.name == "Bullet");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        if (playerAudio.isPlaying)  playerAudio.stop()
        playerAudio.setBuffer( bulletBuffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }

    PlayHitBullet(bullet, delay){

        const bulletBuffer =  this.audioManager.find(e => e.name == "BulletHit");
        let bulletAudio =  bullet.children.find(e => e.constructor.name == "PositionalAudio");

        bulletAudio.setBuffer( bulletBuffer );
        bulletAudio.setRefDistance( 1);
        bulletAudio.setLoop( false );
        bulletAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );

        bulletAudio.play(delay);

    }

    PlayShipDamageTaken(){

        const bulletBuffer =  this.audioManager.find(e => e.name == "ShipDamageTaken");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        playerAudio.setBuffer( bulletBuffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play(0);

    }

    PlayEnergyShield(){

        const shieldBuffer =  this.audioManager.find(e => e.name == "EnergyShield");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        playerAudio.setBuffer( shieldBuffer );
        playerAudio.setLoop( true );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }

    PlayPlayerRespawn(){

        const spawnBuffer =  this.audioManager.find(e => e.name == "ShipRespawn");
        const playerAudio = this.parent.player.children.find(e => e.constructor.name == "PositionalAudio")

        playerAudio.setBuffer( spawnBuffer );
        playerAudio.setLoop( false );
        playerAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );
        playerAudio.play();

    }

    PlayAsteroidDestruction(asteroid, delay){

        const exploBuffer =  this.audioManager.find(e => e.name == "AsteroidExplosion");

        let exploAudio =  asteroid.children.find(e => e.constructor.name == "PositionalAudio");

        exploAudio.setBuffer( exploBuffer );
        exploAudio.setLoop( false );
        exploAudio.setVolume( this.sfxVolume > this.masterVolume ? this.masterVolume : this.sfxVolume );

        exploAudio.play(delay);

    }

    Update(timeElapsed){}

}

export default SoundSystem