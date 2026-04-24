import * as THREE from 'three';

export function createScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x02070d );
	scene.fog = new THREE.FogExp2( 0x04111c, 0.28 );
	return scene;
}
