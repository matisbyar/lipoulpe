import * as THREE from 'three';

export function createParticles( scene ) {
	const farParticleCount = 3000;
	const farParticlesGeometry = new THREE.BufferGeometry();
	const farParticlePositions = new Float32Array( farParticleCount * 3 );
	const farParticleSpeeds = new Float32Array( farParticleCount );

	for ( let i = 0; i < farParticleCount; i++ ) {
		const i3 = i * 3;
		farParticlePositions[ i3 ] = ( Math.random() - 0.5 ) * 16;
		farParticlePositions[ i3 + 1 ] = ( Math.random() - 0.5 ) * 12;
		farParticlePositions[ i3 + 2 ] = ( Math.random() - 0.5 ) * 16;
		farParticleSpeeds[ i ] = 0.00025 + Math.random() * 0.001;
	}

	farParticlesGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute( farParticlePositions, 3 )
	);

	const farParticlesMaterial = new THREE.PointsMaterial( {
		color: 0x8cb7d2,
		size: 0.013,
		transparent: true,
		opacity: 0.36,
		blending: THREE.NormalBlending,
		depthWrite: false
	} );

	const farParticles = new THREE.Points( farParticlesGeometry, farParticlesMaterial );
	scene.add( farParticles );

	const nearParticleCount = 700;
	const nearParticlesGeometry = new THREE.BufferGeometry();
	const nearParticlePositions = new Float32Array( nearParticleCount * 3 );
	const nearParticleSpeeds = new Float32Array( nearParticleCount );

	for ( let i = 0; i < nearParticleCount; i++ ) {
		const i3 = i * 3;
		nearParticlePositions[ i3 ] = ( Math.random() - 0.5 ) * 8;
		nearParticlePositions[ i3 + 1 ] = ( Math.random() - 0.5 ) * 6;
		nearParticlePositions[ i3 + 2 ] = ( Math.random() - 0.5 ) * 6;
		nearParticleSpeeds[ i ] = 0.0008 + Math.random() * 0.0022;
	}

	nearParticlesGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute( nearParticlePositions, 3 )
	);

	const nearParticlesMaterial = new THREE.PointsMaterial( {
		color: 0xc8e7ff,
		size: 0.028,
		transparent: true,
		opacity: 0.5,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	} );

	const nearParticles = new THREE.Points( nearParticlesGeometry, nearParticlesMaterial );
	scene.add( nearParticles );

	return {
		farParticles,
		farParticleCount,
		farParticleSpeeds,
		nearParticles,
		nearParticleCount,
		nearParticleSpeeds
	};
}

export function updateParticles( particlesState, time ) {
	const farPositions = particlesState.farParticles.geometry.attributes.position.array;
	for ( let i = 0; i < particlesState.farParticleCount; i++ ) {
		const i3 = i * 3;
		farPositions[ i3 ] += Math.sin( time * 0.00007 + i ) * 0.00005;
		farPositions[ i3 + 1 ] += particlesState.farParticleSpeeds[ i ];
		if ( farPositions[ i3 + 1 ] > 6 ) {
			farPositions[ i3 + 1 ] = -6;
		}
	}
	particlesState.farParticles.geometry.attributes.position.needsUpdate = true;

	const nearPositions = particlesState.nearParticles.geometry.attributes.position.array;
	for ( let i = 0; i < particlesState.nearParticleCount; i++ ) {
		const i3 = i * 3;
		nearPositions[ i3 ] += Math.sin( time * 0.0002 + i * 0.2 ) * 0.0002;
		nearPositions[ i3 + 1 ] += particlesState.nearParticleSpeeds[ i ];
		nearPositions[ i3 + 2 ] += 0.00025;
		if ( nearPositions[ i3 + 1 ] > 3 ) {
			nearPositions[ i3 + 1 ] = -3;
		}
		if ( nearPositions[ i3 + 2 ] > 3 ) {
			nearPositions[ i3 + 2 ] = -3;
		}
	}
	particlesState.nearParticles.geometry.attributes.position.needsUpdate = true;
}
