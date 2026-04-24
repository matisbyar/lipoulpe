import * as THREE from 'three';

export function createCamera( width, height ) {
	const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 50 );
	camera.position.z = 4;
	return camera;
}
