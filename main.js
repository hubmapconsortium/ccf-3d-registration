function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock();


    var lightLeft = getPointLight(1, 'rgb(255, 255, 255)');
    var lightRight = getPointLight(1, 'rgb(255, 255, 255)');
    var lightBottom = getPointLight(10, 'rgb(255, 255, 255)');
    var dirLight = getDirectionalLight(5);



    lightLeft.position.x = 6;
    lightLeft.position.y = 8;
    lightLeft.position.z = 12;

    lightRight.position.x = 50;
    lightRight.position.y = 14;
    lightRight.position.z = -6;
    lightBottom.position = {
        x: 0,
        y: -5,
        z: 0
    }

    gui.add(lightBottom.position, "y", 0, -10)




    // add other objects to the scene
    scene.add(lightLeft);
    scene.add(lightRight);
    // scene.add(dirLight);

    // camera
    var camera = new THREE.PerspectiveCamera(
        50, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.y = 10;
    camera.position.z = 23;

    // load external geometry
    var loader = new THREE.OBJLoader();
    var textureLoader = new THREE.TextureLoader();
    var kidney = new THREE.Group();
    scene.add(kidney);

    // var texture = textureLoader.load('/assets/textures/checkerboard.jpg');
    // var plane = getPlane(20);
    // plane.material = texture;

    var geometry = new THREE.PlaneGeometry(.2, .2);

    var texture = textureLoader.load(
        '/assets/textures/red-dot.png'
    );

    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        map: texture,
        // side: THREE.DoubleSide,
        transparent: true
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    mesh.rotation.x = 90 * Math.PI / 180;
    mesh.position.x = -6;
    mesh.position.y = .5;



    scene.add(mesh);


    var loader = new THREE.OBJLoader();
    loader.load(
        'assets/kidney/Repositioned Kidney Files/hubmap-2x butterfly subdivision-kidney-mh-repositioned.obj'
        // '/assets/models/head/lee-perry-smith-head-scan.obj'
        ,

        function (object) {

            var colorMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-DM.jpg');
            var bumpMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-NM.jpg');
            var faceMaterial = getMaterial('phong', 'rgb(255, 255, 255)');


            object.traverse(function (child) {

                child.material = faceMaterial;
                faceMaterial.roughness = 0.875;
                faceMaterial.map = colorMap;
                faceMaterial.bumpMap = bumpMap;
                faceMaterial.roughnessMap = bumpMap;
                faceMaterial.metalness = 0;
                faceMaterial.bumpScale = 0.175;
                faceMaterial.transparent = true;
                faceMaterial.opacity = .3;

            });

            gui.add(faceMaterial, "opacity", 0, 1);
            kidney.add(object);

            // object.position.z = 5;
            // object.position.y = -30;


        }
    );

    camera.lookAt(kidney.position);

 


    var cube = getBox(2, .5, 2);

    var sliver = new THREE.Group();
    // sliver.add(cube);
    // cube.position.x = -6;
    // sliver.add(mesh);
    // sliver.position.x = -6;
    scene.add(sliver);


    // renderer
    const canvas = document.querySelector('#c');


    var renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120, 120, 120)');
    renderer.shadowMap.enabled = true;

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var options = {
        rollEnabled: false,
        movementEnabled: true,
        lookEnabled: true,
        rollEnabled: true,
        invertPitch: false,
        fovEnabled: false,
        fovMin: 2,
        fovMax: 115,
        rotationSensitivity: 0.05,
        movementEasing: 3,
        movementAcceleration: 100,
        fovSensitivity: 0.01,
        fovEasing: 3,
        fovAcceleration: 5,
        invertScroll: false
    }
    

    var controls = new THREE.SpaceNavigatorControls(options);

    // var mouse = new THREE.Vector2();
    // document.addEventListener('mousedown', onDocumentMouseDown, false);
    // document.addEventListener('mousewheel', onDocumentMouseWheel, false);

    // document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    // // document.addEventListener('mousedown', onDocumentMouseDown, function () {
    // //     console.log("clicked");
    // // });

    // function onDocumentMouseDown(event) {



    //     // event.preventDefault();

    //     // switch (event.which) {
    //     //     case 1: // left mouse click

    //     //         console.log("left");
    //     //         break;

    //     //     case 3: // right mouse click
    //     //         console.log("right");
    //     //         break;
    //     // }
    // }

    // function onDocumentMouseWheel(event) {
    //     var fovMAX = 160;
    //     var fovMIN = 1;
    //     console.log("wheel");
    //     camera.fov -= event.wheelDeltaY * 0.05;
    //     camera.fov = Math.max(Math.min(camera.fov, fovMAX), fovMIN);
    //     camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, window.innerWidth / window.innerHeight, camera.near, camera.far);

    // }

    document.getElementById('webgl').appendChild(renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;
}

function update(renderer, scene, camera, controls, clock) {
    controls.update();

    // update camera position
    camera.position.copy(controls.position);
    // // update camera rotation
    camera.rotation.copy(controls.rotation);
    // // when using mousewheel to control camera FOV
    camera.fov = controls.fov;
    camera.updateProjectionMatrix();

    // render();
    const xElem = document.querySelector('#x');
    const yElem = document.querySelector('#y');
    const zElem = document.querySelector('#z');
    // var IsSpace = document.querySelector('#spacemouse');
    // console.log(IsSpace.);
    xElem.textContent = Math.round(camera.position.x * 100) / 100;
    yElem.textContent = Math.round(camera.position.y * 100) / 100;
    zElem.textContent = Math.round(camera.position.z * 100) / 100;
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    });
}

var scene = init();