import { createScene } from './core/createScene.js';
import { createCamera } from './core/createCamera.js';
import { createRenderer } from './core/createRenderer.js';
import { createControls } from './core/createControls.js';
import { setupResizeHandler } from './core/setupResizeHandler.js';
import { createLighting } from './features/environment/createLighting.js';
import { loadEnvironmentMap } from './features/environment/loadEnvironmentMap.js';
import { createFallbackCube, loadMainModel } from './features/model/loadMainModel.js';
import { loadSubmarineModel } from './features/model/loadSubmarineModel.js';
import { createParticles } from './features/particles/createParticles.js';
import { createFishSchool } from './features/fish/createFishSchool.js';
import { createMysticRings } from './features/rings/createMysticRings.js';
import { createAnimationLoop } from './animation/createAnimationLoop.js';

const width = window.innerWidth;
const height = window.innerHeight;

const scene = createScene();
const camera = createCamera( width, height );
const renderer = createRenderer( width, height );
document.body.appendChild( renderer.domElement );

const controls = createControls( camera, renderer.domElement );
setupResizeHandler( camera, renderer );

loadEnvironmentMap( scene );
const lightingState = createLighting( scene );
const lightEntries = Object.entries( lightingState ?? {} );

if ( lightEntries.length > 0 ) {
	const lightControl = document.createElement( 'aside' );
	lightControl.className = 'light-control';
	lightControl.style.display = 'none';

	const title = document.createElement( 'h2' );
	title.textContent = 'Lights';
	lightControl.appendChild( title );

	lightEntries.forEach( ( [ lightName, light ] ) => {
		if ( typeof light?.intensity !== 'number' ) {
			return;
		}

		const safeName = lightName.replaceAll( /[A-Z]/g, '-$&' ).toLowerCase();
		const row = document.createElement( 'div' );
		row.className = 'light-control-row';

		const label = document.createElement( 'label' );
		label.setAttribute( 'for', `slider-${ safeName }` );
		label.textContent = lightName;

		const slider = document.createElement( 'input' );
		slider.id = `slider-${ safeName }`;
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.step = '0.05';
		slider.value = light.intensity.toFixed( 2 );

		const value = document.createElement( 'span' );
		value.className = 'light-control-value';
		value.textContent = light.intensity.toFixed( 2 );

		slider.addEventListener( 'input', ( event ) => {
			const nextIntensity = Number.parseFloat( event.target.value );
			light.intensity = nextIntensity;
			value.textContent = nextIntensity.toFixed( 2 );
		} );

		row.appendChild( label );
		row.appendChild( slider );
		row.appendChild( value );
		lightControl.appendChild( row );
	} );

	document.body.appendChild( lightControl );

	window.addEventListener( 'keydown', ( event ) => {
		const isSpaceKey = event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar';

		if ( !isSpaceKey ) {
			return;
		}

		const activeTagName = document.activeElement?.tagName;
		const isEditingInput = activeTagName === 'INPUT' || activeTagName === 'TEXTAREA';

		if ( isEditingInput ) {
			return;
		}

		event.preventDefault();
		lightControl.style.display = lightControl.style.display === 'none' ? 'flex' : 'none';
	} );
}

const fallbackMesh = createFallbackCube( scene );
const modelState = loadMainModel( scene, fallbackMesh );
const submarineState = loadSubmarineModel( scene );
const particlesState = createParticles( scene );
const fishState = createFishSchool( scene );
const ringsState = createMysticRings( scene );

const animate = createAnimationLoop( {
	scene,
	camera,
	renderer,
	controls,
	modelState,
	submarineState,
	particlesState,
	fishState,
	ringsState
} );

renderer.setAnimationLoop( animate );