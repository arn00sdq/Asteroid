import * as THREE from 'three';

class GameObjectManager {

  constructor(parent, audio) {

    this.parent = parent;

    this.edge_limit = parent.limit;
    this.edge_limit_background = parent.limit_background;

    this.audioManager = audio.audioManager;

    this.levelSystem = this.parent.GetComponent("LevelSystem");
    this.sound_sys = this.parent.GetComponent("SoundSystem");
    this.joker_sys = this.parent.GetComponent("JokerSystem");
    this.displaySystem = this.parent.GetComponent("DisplaySystem");

    this.playerHealth = this.parent.gameModels.player.GetComponent("PlayerHealthSystem");


  }

  DetectEdge(object) {

    if (object.userData.type == "Planet") return;

    if (object.userData.type == "BackGround") {

      if ((object.position.distanceTo(new THREE.Vector3(0, 0, 0)) > this.edge_limit_background)) {

        object.position.x = - object.position.x;
        object.position.y = object.position.y;
        object.position.z = - object.position.z;

      }

    } else {

      if ((object.position.distanceTo(new THREE.Vector3(0, 0, 0)) > this.edge_limit)) {

        object.position.x = - object.position.x;
        object.position.y = object.position.y;
        object.position.z = - object.position.z;

      }

    }

  }

  Detect_collision() {

    this.parent.currentScene.children.forEach(e => {

      if ((e.userData.box3 !== null) && (e.children[0])) {

        this.parent.currentScene.children.forEach(e2 => {

          if ((e !== e2) && (e2.userData.box3 && e.userData.box3) && e2.children[0] && e.children[0]) {

            if (e.userData.box3.intersectsBox(e2.userData.box3)) this.collision_handler(e, e2);

          }

        })

      }

    })

  }

  collision_handler(e, e2) {

    switch (e.constructor.name) {

      case "BasicAsteroid":
        this.CollisionAsteroidHandler(e, e2);
        break;
      case "Player":
        this.CollisionPlayerHandler(e, e2);
        break;
      case "EnnemySpaceship":
        this.CollisionEnnemySSHandler(e, e2);
        break;
    }

    switch (e2.constructor.name) {

      case "BasicAsteroid":
        this.CollisionAsteroidHandler(e2, e);
        break;
      case "Player":
        this.CollisionPlayerHandler(e2, e);
        break;
      case "EnnemySpaceship":
        this.CollisionEnnemySSHandler(e2, e);
        break;
    }

  }

  CollisionPlayerHandler(player, object) {

    switch (object.name) {
      case "Asteroid":
        if (player.hasJoker.immune) return;
        this.triggerPlayerDamage(player);
        break;
      case "EnnemyBullet":
        if (player.hasJoker.immune) return;
        this.triggerPlayerDamage(player);
        break;
      case "Coin":
        object.Destroy(object);
        this.parent.gameModels.coin.nb -= 1;
        this.joker_sys.PlayerAddCoin(this.parent.score, 1);
        this.sound_sys.playSfxJoker(this.audioManager.find(e => e.name == "Coin"));
        break;
      case "Heart":
        object.Destroy(object);
        this.parent.gameModels.heart.nb -= 1;
        this.joker_sys.PlayerAddLife(player, 1);
        this.sound_sys.playSfxJoker(this.audioManager.find(e => e.name == "Heart"));
        break;
      case "FirePower":
        object.Destroy(object);
        this.parent.gameModels.firepower.nb -= 1;
        this.parent.gameModels.player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
        this.sound_sys.playSfxJoker(this.audioManager.find(e => e.name == "ItemPick"));
        break;
      case "FireRate":
        object.Destroy(object);
        this.parent.gameModels.firerate.nb -= 1;
        if (!player.hasJoker.firerate) this.joker_sys.IncreaseFireRate(player, 5000);
        this.sound_sys.playSfxJoker(this.audioManager.find(e => e.name == "ItemPick"));
        break;
      case "Shield":
        object.Destroy(object);
        this.parent.gameModels.shield.nb -= 1;
        if (!player.hasJoker.immune) {
          this.sound_sys.playSfxShield(this.audioManager.find(e => e.name == "EnergyShield"));
          this.joker_sys.PlayerProtection(player, this.parent.gameModels.shield, 5000);
        }
        break;
      case "Sun":
        this.levelSystem.InstantiateGameObject(this.parent.gameModels.explosion, player.position, new THREE.Euler(0, 0, 0), 1);
        player.Destroy(player);

        setTimeout(() => {

          this.parent.OnPlayerEnd();

        }, 1200);
        break;

    }

  }

  triggerPlayerDamage(player) {

    this.sound_sys.playSfxPlayerDamge(this.audioManager.find(e => e.name == "ShipDamageTaken"));

    this.playerHealth.Damage(1);
    player.SetInvulnerability(2000);

    this.displaySystem.PrintLife(this.playerHealth.life);
    if (this.playerHealth.life == 0) {

      this.levelSystem.InstantiateGameObject(this.parent.gameModels.explosion, player.position, new THREE.Euler(0, 0, 0), 1);
      player.Destroy(player);

      setTimeout(() => {

        this.parent.OnPlayerEnd();

      }, 1200);


    }

  }

  CollisionAsteroidHandler(asteroid, object) {

    if (object.name == "Heart" || object.name == "Shield" || object.name == "Coin" || object.name == "FirePower" || object.name == "Asteroid") return;

    let asteroidHealth = asteroid.GetComponent("AsteroidHealthSystem");
    switch (object.name) {

      case "BasicBullet":
        object.Destroy(object);
        this.sound_sys.PlayHitBullet(this.audioManager.find(e => e.name == "BulletHit"));
        if (object.GetComponent("BulletDamageSystem").damageAmount > 0) {
          this.sound_sys.PlayHitBullet(this.audioManager.find(e => e.name == "BulletHit"));
          asteroidHealth.Damage(object.GetComponent("BulletDamageSystem").damageAmount);
        }
        this.triggerAsteroidDamage(asteroid, object, asteroidHealth);
        break;
      case "SpecialBullet":
        this.sound_sys.PlayHitBullet(this.audioManager.find(e => e.name == "powerShot"));
        asteroidHealth.Damage(object.GetComponent("BulletDamageSystem").damageAmount);
        this.triggerAsteroidDamage(asteroid, object, asteroidHealth);
        break;
      case "player":
        if (object.hasJoker.immune == false) asteroidHealth.Damage("max");
        this.triggerAsteroidDamage(asteroid, object, asteroidHealth);
        break;
    }

  }

  triggerAsteroidDamage(asteroid, object, asteroidHealth) {

    if (asteroidHealth.life == 0) {

      asteroid.nbBreak += 1;
      this.sound_sys.PlayAsteroidDestruction(this.audioManager.find(e => e.name == "AsteroidExplosion"))
      if (asteroid.nbBreak < 2) {

        this.Asteroid_Subdivision(asteroid, object);
        this.parent.score += 4;
        this.displaySystem.printScore(this.parent.score, 2, 2);

      } else {
        this.parent.score += 5;
        this.displaySystem.printScore(this.parent.score, 1, 10);
      }

      asteroid.Destroy(asteroid);
      this.levelSystem.InstantiateGameObject(this.parent.gameModels.explosion, asteroid.position, new THREE.Euler(0, 0, 0), 1);


    }

  }

  Asteroid_Subdivision(e, object) {

    let dir = new THREE.Vector3();

    object.name == "player" ? dir.set(1, 0, 0.5) : dir = object.GetComponent("BulletMouvement").forward;

    for (let index = 1; index <= 2; index++) {

      let position = new THREE.Vector3(e.position.x + Math.random() * 0.3, 0,
        e.position.z + Math.random() * 0.3);
      let rotation = new THREE.Euler(0, 0, 0);
      let scale = 0.4 * e.children[0].scale.x;
      console.log(scale)
      let velocity = new THREE.Vector3(Math.random() * 1, 0, (dir.x / dir.z) * (index == 1 ? 1 : -1)).normalize().multiplyScalar(10);

      e.userData.velocity = velocity;

      this.levelSystem.InstantiateGameObject(e, position, rotation, scale)

    }

  }

  CollisionEnnemySSHandler(ennemy_ss, object) {

    let ennemy_ss_health = ennemy_ss.GetComponent("EnnemySSHealthSystem");
    let bullet = object.GetComponent("BulletDamageSystem");

    switch (object.name) {

      case "BasicBullet":
        this.sound_sys.PlayHitBullet(this.audioManager.find(e => e.name == "BulletHit"));
        ennemy_ss_health.Damage(bullet.damageAmount);
        object.Destroy(object);
        break;
      case "SpecialBullet":
        this.sound_sys.PlayHitBullet(this.audioManager.find(e => e.name == "BulletHit"));
        ennemy_ss_health.Damage(bullet.damageAmount);
        break;
      case "Asteroid":
        ennemy_ss_health.Damage(2);
        break;

    }

    if (ennemy_ss_health.life == 0) ennemy_ss.Destroy(ennemy_ss);

  }

  CheckBullet(nbBullet) {

    let objectsToRemove = [];
    let bulletToRemove = 2;

    if (nbBullet > 40) {

      this.parent.currentScene.traverse(function (child) {

        if (child.name == "BasicBullet" && bulletToRemove > 0) {

          objectsToRemove.push(child)
          bulletToRemove--;

        }

      })

    }

    objectsToRemove.forEach(node => {
      this.parent.currentScene.remove(node);
    });

  }


  Update(timeElapsed, timeInSecond) {

    let nbEnnemyFrame = 0; let countBullet = 0;
    this.parent.selectedObjects = [];
    this.parent.selectedEnnemy = [];
    this.parent.currentScene.children.forEach(e => {
    
      if (e.type == "Object3D") {

        if (e.userData.type == "Ennemy") {

          nbEnnemyFrame++;
          this.parent.selectedObjects.push(e.children.find(e => e.constructor.name == "Mesh"));

        }

        if (e.userData.type == "joker") {

          this.parent.selectedObjects.push(e.children.find(e => e.constructor.name == "Mesh"));

        };

        if (e.name == "Player") {
          let test = e.children.filter(k => k.constructor.name == "Mesh");
          for (let mesh of test) this.parent.selectedObjects.push(mesh);


        }

        if (e.name == "BasicBullet") countBullet++;


        this.DetectEdge(e);
        e.Update(timeElapsed, timeInSecond);

      }

    });

    this.Detect_collision()
    this.CheckBullet(countBullet);

    this.parent.ennemy = nbEnnemyFrame;

    this.displaySystem.PrintEnnemyKilled(nbEnnemyFrame);
    this.displaySystem.PrintEnnemyRemaining(nbEnnemyFrame);

    if (nbEnnemyFrame == 0 && this.levelSystem.currentLevel !== "StartMenu") this.parent.StageCompleted(this.levelSystem.currentLevel);

  }

}

export default GameObjectManager