import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createFallbackCube( scene ) {
	const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	const material = new THREE.MeshStandardMaterial( {
		color: 0x356a8a,
		roughness: 0.65,
		metalness: 0.1,
		envMapIntensity: 0.6
	} );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );
	return mesh;
}

export function loadMainModel( scene, fallbackMesh ) {
	const state = {
		animatedObject: fallbackMesh,
		mixer: null,
		animationActions: []
	};

	const gltfLoader = new GLTFLoader();
	gltfLoader.load(
		'/models/model.glb',
		( gltf ) => {
			const model = gltf.scene;
			model.position.set( 0, -0.1, 0 );
			model.scale.setScalar( 0.35 );
			model.traverse( ( child ) => {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
					if ( child.material && 'envMapIntensity' in child.material ) {
						child.material.envMapIntensity = 0.5;
					}
				}
			} );

			scene.remove( fallbackMesh );
			scene.add( model );
			state.animatedObject = model;

			if ( gltf.animations && gltf.animations.length > 0 ) {
				state.mixer = new THREE.AnimationMixer( model );
				for ( const clip of gltf.animations ) {
					const action = state.mixer.clipAction( clip );
					action.setLoop( THREE.LoopPingPong, Infinity );
					action.clampWhenFinished = false;
					action.paused = true;
					action.play();
					state.animationActions.push( action );
				}
			}
		},
		undefined,
		() => {
			console.warn( 'Unable to load /models/model.glb, using fallback cube.' );
		}
	);

	return state;
}

export function updateMainModel( modelState, time, elapsed ) {
	modelState.animatedObject.rotation.y = time / 5200;
	modelState.animatedObject.position.y = Math.sin( time * 0.0005 ) * 0.03;

	if ( modelState.mixer && modelState.animationActions.length > 0 ) {
		const boomerangSpeed = 0.175;
		const cycle = ( elapsed * boomerangSpeed ) % 2;
		const boomerang = cycle <= 1 ? cycle : 2 - cycle;
		const eased = 0.5 - 0.5 * Math.cos( Math.PI * boomerang );

		for ( const action of modelState.animationActions ) {
			action.time = eased * action.getClip().duration;
		}
		modelState.mixer.update( 0 );
	}
}
