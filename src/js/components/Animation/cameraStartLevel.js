import * as THREE from 'three';


function cameraStartLevel() {

    // POSITION
    const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 2 ], [ 0, 10, 0, 0, 0.3, 0] );

    // SCALE

    const clip = new THREE.AnimationClip( 'Action', 2, [  positionKF ] );


    return clip;

  }
  
  export { cameraStartLevel };