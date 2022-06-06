let scene, camera, renderer;

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

function init() {
    class FlakesTexture {

		constructor( width = 512, height = 512 ) {

			const canvas = document.createElement( 'canvas' );
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext( '2d' );
			context.fillStyle = 'rgb(127,127,255)';
			context.fillRect( 0, 0, width, height );

			for ( let i = 0; i < 4000; i ++ ) {

				const x = Math.random() * width;
				const y = Math.random() * height;
				const r = Math.random() * 3 + 3;
				let nx = Math.random() * 2 - 1;
				let ny = Math.random() * 2 - 1;
				let nz = 1.5;
				const l = Math.sqrt( nx * nx + ny * ny + nz * nz );
				nx /= l;
				ny /= l;
				nz /= l;
				context.fillStyle = 'rgb(' + ( nx * 127 + 127 ) + ',' + ( ny * 127 + 127 ) + ',' + nz * 255 + ')';
				context.beginPath();
				context.arc( x, y, r, 0, Math.PI * 2 );
				context.fill();

			}

			return canvas;

		}

	}

    let container = document.querySelector('.sphere');

    // creating scene
    scene = new THREE.Scene();

    // creating camera
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 7); //default position

    //render
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        transparent: true,
        antialias: true
    })
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); //set size of rendered scene
    container.appendChild(renderer.domElement);

    //adding light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    ambientLight.position.set(10, 0, 0);
    scene.add(ambientLight);

    let pointlight = new THREE.PointLight(0xffffff, 1);
    pointlight.position.set(200, 200, 200);
    scene.add(pointlight);


    //texture
    let texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 10;
    texture.repeat.y = 6;

    const ballMaterial = {
        clearcoat: 1.0,
        metalness: 0.9,
        roughness:0.5,
        color: 0x8418ca,
        normalMap: texture,
        normalScale: new THREE.Vector2(0.15,0.15),
    };

    //adding sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    const sphereMaterial = new THREE.MeshPhysicalMaterial(ballMaterial);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    const clock = new THREE.Clock();

    //scrolling logic
    let prevOffset = 0;
    let scrollingToTop = false;

    window.addEventListener('scroll', () => {
        let newOffset = pageYOffset;

        if (newOffset < prevOffset) scrollingToTop = true;
        else if (newOffset = prevOffset) scrollingToTop = '';
        else scrollingToTop = false;

        prevOffset = pageYOffset
    })

    //animate

    function animate() {
        renderer.render(scene, camera);

        if (scrollingToTop === true) {
            sphere.rotation.y -= 180/Math.PI * 0.0001;
        }
        else sphere.rotation.y += 180/Math.PI * 0.0001;

        requestAnimationFrame(animate);
    }

    animate();

    // adaptive
    window.addEventListener('resize', () => {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    })
}

init();