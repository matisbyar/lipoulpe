import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 50 );
camera.position.z = 4;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x02070d );
scene.fog = new THREE.FogExp2( 0x04111c, 0.28 );
const clock = new THREE.Clock();
let mixer = null;
const animationActions = [];

const textureLoader = new THREE.TextureLoader();
textureLoader.load(
	'/textures/deepsea.png',
	(texture) => {
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
let animatedObject = mesh;

const ambientLight = new THREE.AmbientLight( 0x4a7392, 0.85 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xb8e3ff, 1.9 );
directionalLight.position.set( 1.6, 2.4, 2.1 );
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set( 1024, 1024 );
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = -0.0002;
scene.add( directionalLight );

const fillLight = new THREE.HemisphereLight( 0x6f9bc0, 0x041019, 0.72 );
scene.add( fillLight );

const keyPointLight = new THREE.PointLight( 0xd6efff, 1.8, 10, 1.7 );
keyPointLight.position.set( 0, 1.1, 1.8 );
keyPointLight.castShadow = true;
scene.add( keyPointLight );

const rimLight = new THREE.SpotLight( 0x8fd8ff, 1.2, 11, Math.PI / 6, 0.4, 1.1 );
rimLight.position.set( -2, 1.8, -1.8 );
rimLight.target.position.set( 0, 0, 0 );
scene.add( rimLight );
scene.add( rimLight.target );

const frontSpot = new THREE.SpotLight( 0xe4f6ff, 0.7, 12, Math.PI / 5, 0.55, 1.4 );
frontSpot.position.set( 0.6, 2.1, 2.6 );
frontSpot.target.position.set( 0, 0, 0 );
scene.add( frontSpot );
scene.add( frontSpot.target );

const gltfLoader = new GLTFLoader();
gltfLoader.load(
	'/models/model.glb',
	(gltf) => {
		const model = gltf.scene;
		model.position.set( 0, -0.1, 0 );
		model.scale.setScalar( 0.35 );
		model.traverse( (child) => {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
				if ( child.material && 'envMapIntensity' in child.material ) {
					child.material.envMapIntensity = 0.5;
				}
			}
		} );

		scene.remove( mesh );
		scene.add( model );
		animatedObject = model;

		if ( gltf.animations && gltf.animations.length > 0 ) {
			mixer = new THREE.AnimationMixer( model );
			for ( const clip of gltf.animations ) {
				const action = mixer.clipAction( clip );
				action.setLoop( THREE.LoopPingPong, Infinity );
				action.clampWhenFinished = false;
				action.paused = true;
				action.play();
				animationActions.push( action );
			}
		}
	},
	undefined,
	() => {
		console.warn( 'Unable to load /models/model.glb, using fallback cube.' );
	}
);

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

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.target.set( 0, 0, 0 );

window.addEventListener( 'resize', () => {
	const w = window.innerWidth;
	const h = window.innerHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize( w, h );
} );

// animation

function animate( time ) {
	const elapsed = clock.getElapsedTime();

	animatedObject.rotation.y = time / 2600;
	animatedObject.position.y = Math.sin( time * 0.0005 ) * 0.03;
	if ( mixer && animationActions.length > 0 ) {
		const boomerangSpeed = 0.175;
		const cycle = ( elapsed * boomerangSpeed ) % 2;
		const boomerang = cycle <= 1 ? cycle : 2 - cycle;
		const eased = 0.5 - 0.5 * Math.cos( Math.PI * boomerang );

		for ( const action of animationActions ) {
			action.time = eased * action.getClip().duration;
		}
		mixer.update( 0 );
	}

	const farPositions = farParticles.geometry.attributes.position.array;
	for ( let i = 0; i < farParticleCount; i++ ) {
		const i3 = i * 3;
		farPositions[ i3 ] += Math.sin( time * 0.00007 + i ) * 0.00005;
		farPositions[ i3 + 1 ] += farParticleSpeeds[ i ];
		if ( farPositions[ i3 + 1 ] > 6 ) {
			farPositions[ i3 + 1 ] = -6;
		}
	}
	farParticles.geometry.attributes.position.needsUpdate = true;

	const nearPositions = nearParticles.geometry.attributes.position.array;
	for ( let i = 0; i < nearParticleCount; i++ ) {
		const i3 = i * 3;
		nearPositions[ i3 ] += Math.sin( time * 0.0002 + i * 0.2 ) * 0.0002;
		nearPositions[ i3 + 1 ] += nearParticleSpeeds[ i ];
		nearPositions[ i3 + 2 ] += 0.00025;
		if ( nearPositions[ i3 + 1 ] > 3 ) {
			nearPositions[ i3 + 1 ] = -3;
		}
		if ( nearPositions[ i3 + 2 ] > 3 ) {
			nearPositions[ i3 + 2 ] = -3;
		}
	}
	nearParticles.geometry.attributes.position.needsUpdate = true;

	controls.update();

	renderer.render( scene, camera );

}