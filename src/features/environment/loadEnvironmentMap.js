import * as THREE from 'three';

export function loadEnvironmentMap( scene ) {
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load(
		'/textures/deepsea.png',
		( texture ) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.colorSpace = THREE.SRGBColorSpace;
			scene.background = texture;
			scene.environment = texture;
		},
		undefined,
		() => {
			console.warn( 'Unable to load /textures/deepsea.png, using fallback background.' );
		}
	);
}
