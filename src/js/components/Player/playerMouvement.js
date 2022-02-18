class CharacterMouvement { // composant script

  constructor(parent) {

    this.parent = parent;
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -0.3);
    this.acceleration = new THREE.Vector3(0.8, 0.125, 1.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 0.0

  }

  InitComponent() { }

  Update(timeInSeconds) {

    const TiS = 0.016

    const input = this.parent.GetComponent('CharacterControllerInput');

    const velocity = this.velocity;
    const frameDecceleration = new THREE.Vector3(

      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z
    )

    frameDecceleration.multiplyScalar(0.016);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    velocity.add(frameDecceleration);

    const controlObject = this.parent;
    const _Q = new THREE.Quaternion();
    const _Y = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();
    const acc = this.acceleration.clone();

    if (input.keys.forward) {

      velocity.z += acc.z * TiS;

    }

    if (input.keys.backward) {

      velocity.z -= acc.z * TiS;

    }

    if (velocity.z > 3.5) velocity.z = 3

    if (input.keys.left) {

      _Y.set(0, 1, 0); // axe Y
      _Q.setFromAxisAngle(_Y, 4.0 * Math.PI * TiS * this.acceleration.y);
      _R.multiply(_Q);

    }
    if (input.keys.right) {

      _Y.set(0, 1, 0); // axe Y
      _Q.setFromAxisAngle(_Y, 4.0 * - Math.PI * TiS * this.acceleration.y);
      _R.multiply(_Q);

    }

    controlObject.quaternion.copy(_R)

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * TiS);
    forward.multiplyScalar(velocity.z * TiS);

    const pos = controlObject.position;

    pos.add(forward);
    pos.add(sideways);
    
  }

};

export default CharacterMouvement