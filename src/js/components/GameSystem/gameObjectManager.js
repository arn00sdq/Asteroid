import * as THREE from 'three';

class GameObjectManager {

  constructor(parent) {

    this.parent = parent;
    this.edge_limit = parent.limit;
    this.edge_limit_background = parent.limit_background

    this.levelSystem = this.parent.GetComponent("LevelSystem");
    this.sound_sys = this.parent.GetComponent("SoundSystem");
    this.joker_sys = this.parent.GetComponent("JokerSystem");

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

      case "BasicBullet":
        this.CollisionBulletHandler(e, e2);
        break;
      case "EnnemyBullet":
        this.CollisionEnnemyBulletHandler(e, e2);
        break;

      case "Heart":
        this.CollisionJokerHandler(e, e2);
        break;

      case "Coin":
        this.CollisionJokerHandler(e, e2);
        break;

      case "FirePower":
        this.CollisionJokerHandler(e, e2);
        break;

      case "FireRate":
        this.CollisionJokerHandler(e, e2);
        break;

      case "Shield":
        this.CollisionJokerHandler(e, e2);
        break;
      case "EnnemySpaceship":
        this.CollisionEnnemySSHandler(e, e2);
        break;

    }

  }

  DetectEdge(object) {

    if (object.userData.type == "Planet") return;

    if (object.userData.type == "BackGround") {

      if ((object.position.distanceTo(new THREE.Vector3(0, 0, 0)) > this.edge_limit_background)) {

        object.position.x = - object.position.x
        object.position.y = object.position.y
        object.position.z = - object.position.z

      }

    } else {

      if ((object.position.distanceTo(new THREE.Vector3(0, 0, 0)) > this.edge_limit)) {

        object.position.x = - object.position.x
        object.position.y = object.position.y
        object.position.z = - object.position.z

      }

    }



  }

  CollisionPlayerHandler(player, object) {

    if ((object.name == "Asteroid" || object.name == "EnnemyBullet") && !player.hasJoker.immune) {

      let playerHealth = player.GetComponent("PlayerHealthSystem");

      let playerHitSound = new THREE.Audio(this.parent.audio.listener);
      this.sound_sys.PlayShipDamageTaken();

      playerHealth.Damage(1);
      player.SetInvulnerability(2000);

      this.parent.playerLife = player.life
      this.parent.GetComponent("DisplaySystem").PrintLife(player.life);

      if (player.life == 0) {

        this.levelSystem.InstantiateShader(this.parent.explosion, player.position, new THREE.Euler(0, 0, 0));
        player.Destroy(player);

        setTimeout(() => {

          this.parent.OnPlayerEnd();

        }, 1000);


      }

    }

  }

  CollisionAsteroidHandler(asteroid, object) {

    if (object.name == "Heart" || object.name == "Shield" || object.name == "Coin" || object.name == "FirePower" || object.name == "Asteroid") return;

    let asteroidHealth = asteroid.GetComponent("AsteroidHealthSystem");

    if (object.name == "Player" && object.hasJoker.immune == false) asteroidHealth.Damage("max");
    if (object.name == "BasicBullet" || object.name == "SpecialBullet") {

      let bullet = object.GetComponent("BulletDamageSystem");
      asteroidHealth.Damage(bullet.damageAmount);

    }

    if (asteroid.life == 0) {

      asteroid.nbBreak += 1;
      this.sound_sys.PlayAsteroidDestruction(asteroid, 0) // destroy will remove pos audio
      if (asteroid.nbBreak < 2) {

        this.Asteroid_Subdivision(asteroid, object);
        this.parent.score += 4;
        this.parent.GetComponent("DisplaySystem").printScore(this.parent.score, 2, 2);

      } else {
        this.parent.score += 5;
        this.parent.GetComponent("DisplaySystem").printScore(this.parent.score, 1, 10);
      }

      asteroid.Destroy(asteroid);
      this.levelSystem.InstantiateShader(this.parent.explosion, asteroid.position, new THREE.Euler(0, 0, 0), 1);


    }

  }

  Asteroid_Subdivision(e, object) {

    let dir = new THREE.Vector3();

    object.name == "Player" ? dir.set(1, 0, 0.5) : dir = object.GetComponent("BulletMouvement").forward;

    for (let index = 1; index <= 2; index++) {

      let position = new THREE.Vector3(e.position.x + Math.random() * 0.3, 0,
        e.position.z + Math.random() * 0.3);
      let rotation = new THREE.Euler(0, 0, 0);
      let scale = 0.75 * e.scale.x;
      let velocity = new THREE.Vector3(Math.random() * 1, 0, (dir.x / dir.z) * (index == 1 ? 1 : -1)).normalize().multiplyScalar(10);

      e.userData.velocity = velocity;

      this.levelSystem.InstantiateGameObject(e, position, rotation, scale)

    }

  }

  CollisionBulletHandler(bullet, object) {

    if (bullet.name == "EnnemyBullet") return;

    if (object.name == "Asteroid" || object.name == "EnnemySpaceship") {

      bullet.Destroy(bullet)
      let bulletDamage = bullet.GetComponent("BulletDamageSystem").damageAmount;
      if (bulletDamage > 0) {

        this.sound_sys.PlayHitBullet(object, 0);

      }

    }

  }

  CollisionEnnemyBulletHandler(bullet, object) {


    if (object.name == "Asteroid" || object.name == "Player") {


      bullet.Destroy(bullet)

    }

  }

  CollisionJokerHandler(joker, object) {

    if (object.name == "Player") {

      joker.Destroy(joker);

      switch (joker.constructor.name) {

        case "Coin":
          this.parent.coin.nb -= 1
          this.joker_sys.PlayerAddCoin(this.parent.score, 1);
          this.sound_sys.PlayCoinPickUp();
          break;
        case "Heart":
          this.parent.heart.nb -= 1
          this.joker_sys.PlayerAddLife(object, 1);
          this.sound_sys.PlayHeartPickUp();
          break;
        case "FirePower":
          this.parent.firepower.nb -= 1
          this.parent.player.GetComponent("PlayerShootProjectiles").AddProjectile(1);
          break;
        case "FireRate":
          this.parent.firerate.nb -= 1
          if (!object.hasJoker.firerate) this.joker_sys.IncreaseFireRate(object, 5000);
          break;
        case "Shield":
          this.parent.shield.nb -= 1
          this.sound_sys.PlayEnergyShield();

          if (!object.hasJoker.immune) this.joker_sys.PlayerProtection(object, this.parent.shield, 3000);
          break;

      }

    }

  }

  CollisionEnnemySSHandler(ennemy_ss, object) {

    let ennemy_ss_health = ennemy_ss.GetComponent("EnnemySSHealthSystem");
    let bullet = object.GetComponent("BulletDamageSystem");

    switch (object.name) {

      case "BasicBullet":
        this.sound_sys.PlayHitBullet(object, 0);
        ennemy_ss_health.Damage(bullet.damageAmount);
        object.Destroy(object);
        break;
      case "SpecialBullet":
        this.sound_sys.PlayHitBullet(object, 0);
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

    let nbEnnemyFrame = 0; let playerLife; let countBullet = 0;
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

          playerLife = e.life;

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

    this.parent.GetComponent("DisplaySystem").PrintEnnemyKilled(nbEnnemyFrame);
    this.parent.GetComponent("DisplaySystem").PrintEnnemyRemaining(nbEnnemyFrame);

    if (nbEnnemyFrame == 0 && this.levelSystem.currentLevel !== "StartMenu") this.parent.StageCompleted();

  }

}

export default GameObjectManager