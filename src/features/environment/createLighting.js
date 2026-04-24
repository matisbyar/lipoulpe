import * as THREE from 'three';

export function createLighting( scene ) {
	const ambientLight = new THREE.AmbientLight( 0x4a7392, 0.3 );
	scene.add( ambientLight );

	const ambientBoost = new THREE.AmbientLight( 0x7fb6d6, 0.18 );
	scene.add( ambientBoost );

	const directionalLight = new THREE.DirectionalLight( 0xb8e3ff, 3.05 );
	directionalLight.position.set( 1.6, 2.4, 2.1 );
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.set( 1024, 1024 );
	directionalLight.shadow.radius = 4;
	directionalLight.shadow.bias = -0.0002;
	scene.add( directionalLight );

	const fillLight = new THREE.HemisphereLight( 0x6f9bc0, 0x041019, 0.22 );
	scene.add( fillLight );

	const keyPointLight = new THREE.PointLight( 0xd6efff, 6.7, 10, 1.7 );
	keyPointLight.position.set( 0, 1.1, 1.8 );
	keyPointLight.castShadow = true;
	scene.add( keyPointLight );

	const rimLight = new THREE.SpotLight( 0x8fd8ff, 0, 11, Math.PI / 6, 0.4, 1.1 );
	rimLight.position.set( -2, 1.8, -1.8 );
	rimLight.target.position.set( 0, 0, 0 );
	scene.add( rimLight );
	scene.add( rimLight.target );

	const frontSpot = new THREE.SpotLight( 0xe4f6ff, 5.5, 12, Math.PI / 5, 0.55, 1.4 );
	frontSpot.position.set( 0.6, 2.1, 2.6 );
	frontSpot.target.position.set( 0, 0, 0 );
	scene.add( frontSpot );
	scene.add( frontSpot.target );

	const octopusFillLight = new THREE.PointLight( 0xbfe5ff, 7.55, 16, 1.2 );
	octopusFillLight.position.set( 0, 0.4, 2.4 );
	scene.add( octopusFillLight );

	const octopusBackLight = new THREE.PointLight( 0x6fc4ff, 10.35, 18, 1.35 );
	octopusBackLight.position.set( 0, 0.1, -2.8 );
	scene.add( octopusBackLight );

	const topGlow = new THREE.SpotLight( 0xdaf3ff, 10.8, 24, Math.PI / 4.5, 0.5, 1.1 );
	topGlow.position.set( 0, 4.2, 0.8 );
	topGlow.target.position.set( 0, 0, 0 );
	scene.add( topGlow );
	scene.add( topGlow.target );

	const bigLight = new THREE.PointLight( 0xffffff, 6.9, 45, 1 );
	bigLight.position.set( 0, 5, 3 );
	scene.add( bigLight );

	return {
		ambientLight,
		ambientBoost,
		directionalLight,
		fillLight,
		keyPointLight,
		rimLight,
		frontSpot,
		octopusFillLight,
		octopusBackLight,
		topGlow,
		bigLight
	};
}
