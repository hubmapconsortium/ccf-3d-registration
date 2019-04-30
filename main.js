function init() {
    var scene = new THREE.Scene();
    var clock = new THREE.Clock();
    var camera = new THREE.PerspectiveCamera(
        50, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        .1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.y = 10;
    camera.position.z = 050;

    // load external geometry
    var loader = new THREE.OBJLoader();
    var textureLoader = new THREE.TextureLoader();
    var kidney = new THREE.Group();
    scene.add(kidney);

    // var texture = textureLoader.load('/assets/textures/checkerboard.jpg');
    // var plane = getPlane(20);
    // plane.material = texture;


    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var loader = new THREE.OBJLoader();
    loader.load(
        'assets/kidney/Repositioned Kidney Files/hubmap-2x butterfly subdivision-kidney-mh-single-ab-repositioned.obj'
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

                // console.log(child.isMesh);
                if (child.isMesh) {
                    var l = child.geometry.attributes.position.count;
                    // console.log(l);

                    var meshGeometry = new THREE.Geometry();



                    var position = child.geometry.attributes.position;
                    var vector = new THREE.Vector3();
                    for (let i = 0; i < l; i++) {
                        vector.fromBufferAttribute(position, i);
                        vector.applyMatrix4(child.matrixWorld);
                        // console.log(vector);
                        // console.log(vector.x);
                        meshGeometry.vertices.push(
                            new THREE.Vector3(
                                vector.x,
                                vector.y,
                                vector.z
                            ));
                        // console.log("cycle ended. next! " + i);
                    }
                   
                   
                    var sprite = new THREE.TextureLoader().load('assets/textures/disc.png');

                    var meshMaterial = new THREE.PointsMaterial({
                        size: 4,
                        sizeAttenuation: false,
                        map: sprite,
                        alphaTest: 0.1,
                        transparent: true,
                        // color: sphereColors[Math.round(Math.random() * 2)]
                    });
                    var meshDot = new THREE.Points(meshGeometry, meshMaterial);
                    scene.add(meshDot);
                }
            });

            // var box = new THREE.BoxHelper(object, 0xffffff);
            // scene.add(box);
        }
    );

    camera.lookAt(kidney.position);
    var dotPattern = new THREE.Group();
    scene.add(dotPattern);

    var sphereColors = [
        //red
        new THREE.Color("rgb(255, 0, 0)"),
        //green
        new THREE.Color("rgb(0, 255, 0)"),
        //blue
        new THREE.Color("rgb(0, 0, 255)")

    ];

    // var numSpheres = 800;

    // for (let index = 0; index < numSpheres; index++) {
    //     var color = sphereColors[Math.round(Math.random() * 2)];
    //     var sphere = getSphere(.01, color)

    //     sphere.position.x = Math.random() * (1 - (-1)) + (-1);
    //     sphere.position.y = Math.random() * (1 - (-1)) + (-1);
    //     sphere.position.z = Math.random() * (3 - (-3)) + (-3);
    //     sphere.name = index;
    //     // console.log(sphere.name);
    //     dotPattern.add(sphere);
    // }
    // dotPattern.position.x = 0;
    // gui.add(dotPattern.position, "x", -10, 5)
    //  var sphere = getSphere(1, sphereColors[2]);

    // scene.fog = new THREE.FogExp2(0xffffff, .1);

    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({
        size: .1,
        sizeAttenuation: false
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);

    // var pointGeometry = new THREE.Geometry();
    // for (let index = 0; index < 1000; index++) {
    //     var x = Math.random() * (1 - (-1)) + (-1);
    //     var y = Math.random() * (1 - (-1)) + (-1);
    //     var z = Math.random() * (3 - (-3)) + (-3);
    //     pointGeometry.vertices.push(new THREE.Vector3(x, y, z));

    // }

    // var sprite = new THREE.TextureLoader().load('assets/textures/disc.png');

    // var pointsMaterial = new THREE.PointsMaterial({
    //     size: 10,
    //     sizeAttenuation: false,
    //     map: sprite,
    //     alphaTest: 0.1,
    //     transparent: true,
    //     // vertexColors: THREE.VertexColors
    // });

    // var points = new THREE.Points(pointGeometry, pointsMaterial);
    // scene.add(points);






    //normalize the direction vector (convert to vector of length 1)


    // var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );


    var arrowY = getArrowHelper(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
        2,
        '#00ff00');

    var arrowX = getArrowHelper(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        2,
        '#ff0000');

    var arrowZ = getArrowHelper(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 1),
        2,
        '#0000ff');

    scene.add(arrowX, arrowY, arrowZ);

    // var cube = getBox(2, .5, 2);






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
    renderer.setClearColor('rgb(20,20,20)');
    renderer.shadowMap.enabled = true;

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var options = {
        rollEnabled: true,
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
    // camera.fov = controls.fov;
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