import * as THREE from 'three';

export function createFishSchool( scene ) {
	const fishGroup = new THREE.Group();
	scene.add( fishGroup );

	const fishCount = 18;
	const fishes = [];
	const fishBodyGeometry = new THREE.SphereGeometry( 1, 14, 10 );
	const fishTailGeometry = new THREE.ConeGeometry( 0.5, 0.9, 4 );
	const fishFinGeometry = new THREE.ConeGeometry( 0.22, 0.45, 3 );
	fishTailGeometry.rotateZ( -Math.PI / 2 );
	fishFinGeometry.rotateZ( Math.PI / 2 );

	for ( let i = 0; i < fishCount; i++ ) {
		const orbitPivot = new THREE.Group();
		fishGroup.add( orbitPivot );

		const fish = new THREE.Group();
		const bodyLength = 0.14 + Math.random() * 0.08;
		const bodyHeight = bodyLength * ( 0.32 + Math.random() * 0.06 );
		const bodyDepth = bodyHeight * 0.75;
		const tailColor = new THREE.Color().setHSL( 0.5 + Math.random() * 0.08, 0.62, 0.66 );
		const bodyColor = new THREE.Color().setHSL( 0.52 + Math.random() * 0.08, 0.58, 0.5 );

		const body = new THREE.Mesh(
			fishBodyGeometry,
			new THREE.MeshStandardMaterial( {
				color: bodyColor,
				roughness: 0.48,
				metalness: 0.06
			} )
		);
		body.scale.set( bodyLength, bodyHeight, bodyDepth );
		body.castShadow = true;
		body.receiveShadow = true;

		const dorsalFin = new THREE.Mesh(
			fishFinGeometry,
			new THREE.MeshStandardMaterial( {
				color: tailColor,
				roughness: 0.58,
				metalness: 0.05
			} )
		);
		dorsalFin.position.set( -bodyLength * 0.05, bodyHeight * 0.95, 0 );
		dorsalFin.scale.set( bodyLength * 0.7, bodyHeight * 0.8, bodyDepth * 0.55 );
		dorsalFin.rotation.x = Math.PI / 2;
		dorsalFin.castShadow = true;
		dorsalFin.receiveShadow = true;

		const tailPivot = new THREE.Group();
		tailPivot.position.x = -bodyLength * 1.03;

		const tail = new THREE.Mesh(
			fishTailGeometry,
			new THREE.MeshStandardMaterial( {
				color: tailColor,
				roughness: 0.57,
				metalness: 0.05
			} )
		);
		tail.scale.set( bodyHeight * 0.9, bodyHeight * 0.9, bodyDepth * 0.65 );
		tail.castShadow = true;
		tail.receiveShadow = true;

		fish.add( body );
		fish.add( dorsalFin );
		tailPivot.add( tail );
		fish.add( tailPivot );
		orbitPivot.add( fish );

		const radius = 1.6 + Math.random() * 1.8;
		fish.position.x = radius;

		fishes.push( {
			mesh: fish,
			orbitPivot,
			tailPivot,
			speed: 0.22 + Math.random() * 0.24,
			radius,
			height: -0.45 + Math.random() * 1.5,
			phase: Math.random() * Math.PI * 2,
			bobAmp: 0.05 + Math.random() * 0.07,
			bobSpeed: 1.5 + Math.random() * 0.9,
			turnDirection: Math.random() > 0.5 ? 1 : -1,
			bankAmp: 0.08 + Math.random() * 0.09,
			pitchAmp: 0.03 + Math.random() * 0.04,
			radialSwayAmp: 0.03 + Math.random() * 0.06,
			radialSwaySpeed: 1.1 + Math.random() * 1.2,
			wiggleAmount: 0.18 + Math.random() * 0.18,
			wiggleSpeed: 8 + Math.random() * 5
		} );
	}

	return { fishes };
}

export function updateFishSchool( fishState, elapsed ) {
	for ( const fishData of fishState.fishes ) {
		const orbit = elapsed * fishData.speed * fishData.turnDirection + fishData.phase;
		const y = fishData.height + Math.sin( orbit * fishData.bobSpeed ) * fishData.bobAmp;
		const radialSway = Math.sin( elapsed * fishData.radialSwaySpeed + fishData.phase ) * fishData.radialSwayAmp;

		fishData.orbitPivot.rotation.y = orbit;
		fishData.mesh.position.set( fishData.radius + radialSway, y, 0 );

		const headingYaw = fishData.turnDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
		const bank = Math.sin( elapsed * 1.7 + fishData.phase ) * fishData.bankAmp * fishData.turnDirection;
		const pitch = Math.cos( orbit * fishData.bobSpeed ) * fishData.pitchAmp;
		fishData.mesh.rotation.set( pitch, headingYaw, bank );

		fishData.tailPivot.rotation.y = Math.sin( elapsed * fishData.wiggleSpeed + fishData.phase ) * fishData.wiggleAmount;
	}
}
