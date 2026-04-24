export function setupResizeHandler( camera, renderer ) {
	window.addEventListener( 'resize', () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	} );
}
