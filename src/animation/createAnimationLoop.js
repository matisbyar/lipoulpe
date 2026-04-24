import * as THREE from 'three';
import { updateMainModel } from '../features/model/loadMainModel.js';
import { updateParticles } from '../features/particles/createParticles.js';
import { updateFishSchool } from '../features/fish/createFishSchool.js';
import { updateMysticRings } from '../features/rings/createMysticRings.js';

export function createAnimationLoop( animationState ) {
	const clock = new THREE.Clock();

	return function animate( time ) {
		const elapsed = clock.getElapsedTime();

		updateMainModel( animationState.modelState, time, elapsed );
		updateParticles( animationState.particlesState, time );
		updateFishSchool( animationState.fishState, elapsed );
		updateMysticRings( animationState.ringsState, animationState.modelState.animatedObject, elapsed );

		animationState.controls.update();
		animationState.renderer.render( animationState.scene, animationState.camera );
	};
}
