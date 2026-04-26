import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadSubmarineModel( scene ) {
	const state = {
		orbitPivot: new THREE.Group(),
		headingOffset: -Math.PI,
		submarine: null
	};
	scene.add( state.orbitPivot );

	const gltfLoader = new GLTFLoader();
	gltfLoader.load(
		'/models/submarine.glb',
		( gltf ) => {
			const submarine = gltf.scene;
			submarine.scale.setScalar( 0.22 );
			submarine.position.set( 3.4, 0.25, 0 );

			submarine.traverse( ( child ) => {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			} );

			state.orbitPivot.add( submarine );
			state.submarine = submarine;
		},
		undefined,
		() => {
			console.warn( 'Unable to load /models/submarine.glb.' );
		}
	);

	return state;
}

export function updateSubmarineModel( submarineState, elapsed ) {
	const submarine = submarineState.submarine;

	if ( !submarine ) {
		return;
	}

	const radius = 3.4;
	const angularSpeed = 0.22;
	const orbitAngle = elapsed * angularSpeed;
	const bob = Math.sin( elapsed * 0.95 ) * 0.08;
	const radialSway = Math.sin( elapsed * 0.5 ) * 0.12;

	submarineState.orbitPivot.rotation.y = orbitAngle;
	submarine.position.set( radius + radialSway, 0.25 + bob, 0 );

	// Tunable base heading to align the GLB forward axis with the orbit tangent.
	submarine.rotation.y = submarineState.headingOffset;
	submarine.rotation.z = Math.sin( elapsed * 0.75 ) * 0.05;
	submarine.rotation.x = Math.cos( elapsed * 0.95 ) * 0.03;
}
