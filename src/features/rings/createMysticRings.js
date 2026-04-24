import * as THREE from 'three';

export function createMysticRings( scene ) {
	const mysticRingsGroup = new THREE.Group();
	scene.add( mysticRingsGroup );

	const ringOpacityCanvas = document.createElement( 'canvas' );
	ringOpacityCanvas.width = 256;
	ringOpacityCanvas.height = 2;
	const ringOpacityContext = ringOpacityCanvas.getContext( '2d' );
	if ( ringOpacityContext ) {
		const opacityGradient = ringOpacityContext.createLinearGradient( 0, 0, ringOpacityCanvas.width, 0 );
		opacityGradient.addColorStop( 0, 'rgba(0,0,0,0)' );
		opacityGradient.addColorStop( 1, 'rgba(255,255,255,1)' );
		ringOpacityContext.fillStyle = opacityGradient;
		ringOpacityContext.fillRect( 0, 0, ringOpacityCanvas.width, ringOpacityCanvas.height );
	}
	const ringOpacityMap = new THREE.CanvasTexture( ringOpacityCanvas );
	ringOpacityMap.wrapS = THREE.ClampToEdgeWrapping;
	ringOpacityMap.wrapT = THREE.ClampToEdgeWrapping;

	const mysticRings = [];
	const ringSpecs = [
		{ radius: 1.7, tube: 0.1, speed: 0.24, tiltX: Math.PI / 2 - 0.22, tiltZ: 0.15, yOffset: 0.12 },
		{ radius: 2.2, tube: 0.12, speed: -0.18, tiltX: Math.PI / 2 + 0.12, tiltZ: -0.18, yOffset: 0.2 },
		{ radius: 2.7, tube: 0.13, speed: 0.14, tiltX: Math.PI / 2 - 0.08, tiltZ: 0.2, yOffset: -0.03 }
	];

	for ( const spec of ringSpecs ) {
		const ring = new THREE.Mesh(
			new THREE.TorusGeometry( spec.radius, spec.tube, 16, 96 ),
			new THREE.MeshStandardMaterial( {
				color: 0x8ddfff,
				emissive: 0x57bde9,
				emissiveIntensity: 0.32,
				roughness: 1,
				metalness: 0,
				transparent: true,
				opacity: 0.2,
				alphaMap: ringOpacityMap,
				depthWrite: false
			} )
		);

		ring.rotation.x = spec.tiltX;
		ring.rotation.z = spec.tiltZ;
		ring.position.y = spec.yOffset;
		mysticRingsGroup.add( ring );

		mysticRings.push( { mesh: ring, ...spec } );
	}

	const ringAuraLight = new THREE.PointLight( 0x7ed7ff, 0.85, 7.5, 1.7 );
	ringAuraLight.position.set( 0, 0.12, 0 );
	mysticRingsGroup.add( ringAuraLight );

	return { mysticRingsGroup, mysticRings, ringAuraLight };
}

export function updateMysticRings( ringsState, animatedObject, elapsed ) {
	ringsState.mysticRingsGroup.position.copy( animatedObject.position );
	ringsState.mysticRingsGroup.position.y += 0.08;

	for ( const ringData of ringsState.mysticRings ) {
		const pulse = 0.28 + Math.sin( elapsed * 1.9 + ringData.radius * 1.6 ) * 0.1;
		ringData.mesh.rotation.y += ringData.speed * 0.01;
		ringData.mesh.material.emissiveIntensity = pulse;
		ringData.mesh.material.opacity = 0.12 + pulse * 0.16;
	}
	ringsState.ringAuraLight.intensity = 0.42 + Math.sin( elapsed * 2.1 ) * 0.1;
}
