import * as THREE from 'three';

class PlayerCameraSystem {

    constructor(parent, params) {

        this.parent = parent;

        this.follow = params.follow;
        this.camera = params.camera;
        this.goal = params.goal;

        this.temp = new THREE.Vector3;
        this.dir = new THREE.Vector3;
        this.a = new THREE.Vector3;
        this.b = new THREE.Vector3;
        this.dis = 0;
        this.offset = 0.3;

        this.limit = null;

        this.parent.add(this.follow)


    }

    StaticCamera() {

        this.camera.lookAt(0,0, 0);

    }

    CameraTracking() {

        this.camera.lookAt(this.parent.position);
        this.goal.position.copy(this.parent.position)

    }

    ThirdPersonCamera() {
        let follow_player = this.parent.children.find(e => e.name == "FollowPlayer");
        let limitA = this.parent.position.distanceTo(new THREE.Vector3(0, 0, 0));
        this.b.copy(this.goal.position);

        if ((limitA) > this.limit) {

            this.goal.position.x = - this.parent.position.x;
            this.goal.position.z = - this.parent.position.z;
            this.a.copy(this.goal.position);

        } else {
            this.a.lerp(this.parent.position, 0.4);

            this.dir.copy(this.a).sub(this.b).normalize();// Calcul de la pos de la cam
            this.dis = this.a.distanceTo(this.b) - this.offset;  // pos vaisseau - pos cam

            if (this.dis > 1) {

                this.dis = 0.1
            }
            if (this.dis < -1) {

                this.dis = - 0.1
            }

            this.goal.position.addScaledVector(this.dir, this.dis);

        }

        this.goal.position.lerp(this.temp, 0.06);
        this.temp.setFromMatrixPosition(follow_player.matrixWorld);
        this.camera.lookAt(this.parent.position);

    }

    Update() {

        const input = this.parent.GetComponent('CharacterControllerInput');

        if (input.keys.cam1 == true) {

            this.StaticCamera()

        }

        if (input.keys.cam2 == true) {

            this.ThirdPersonCamera();

        }

        if (input.keys.cam3 == true) {

            this.CameraTracking()

        }


    }

}

export default PlayerCameraSystem