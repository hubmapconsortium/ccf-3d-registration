function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock();


    var lightLeft = getPointLight(1, 'rgb(255, 255, 255)');
    var lightRight = getPointLight(1.25, 'rgb(255, 255, 255)');
    var dirLight = getDirectionalLight(5);



    lightLeft.position.x = 6;
    lightLeft.position.y = 8;
    lightLeft.position.z = 12;

    lightRight.position.x = 50;
    lightRight.position.y = 14;
    lightRight.position.z = -6;




    // dat.gui
    gui.add(lightLeft, 'intensity', 0, 10);
    gui.add(lightLeft.position, 'x', -50, 50);
    gui.add(lightLeft.position, 'y', -50, 50);
    gui.add(lightLeft.position, 'z', -50, 50);

    gui.add(lightRight, 'intensity', 0, 10);
    gui.add(lightRight.position, 'x', -50, 50);
    gui.add(lightRight.position, 'y', -50, 50);
    gui.add(lightRight.position, 'z', -50, 50);





    gui.add(dirLight, 'intensity', 0, 10);

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
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 5;

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
        side: THREE.DoubleSide,
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
    
    gui.add(mesh.position, 'x', -7, 0);

    scene.add(mesh);


    var loader = new THREE.OBJLoader();
    loader.load(
        'assets/kidney/NLMVHM_Kidneys.obj'
        // '/assets/models/head/lee-perry-smith-head-scan.obj'
        ,

        function (object) {

            var colorMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-DM.jpg');
            var bumpMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-NM.jpg');
            var faceMaterial = getMaterial('standard', 'rgb(255, 255, 255)');


            object.traverse(function (child) {

                child.material = faceMaterial;
                faceMaterial.roughness = 0.875;
                faceMaterial.map = colorMap;
                faceMaterial.bumpMap = bumpMap;
                faceMaterial.roughnessMap = bumpMap;
                faceMaterial.metalness = 0;
                faceMaterial.bumpScale = 0.175;

            });

            kidney.add(object);

            object.position.z = 5;
            object.position.y = -30;


        }
    );

    camera.lookAt(kidney.position);

    kidney.rotation.x = 90;
    kidney.position.x = 10;


var cube = getBox(2,.5,2);

    var sliver = new THREE.Group();
    sliver.add(cube);
    cube.position.x = -6;
    sliver.add(mesh);
    sliver.position.x = -6;
    scene.add(sliver);

    console.log(cube.position);
    console.log(mesh.position);


    // renderer
    const canvas = document.querySelector('#c');
    
        
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120, 120, 120)');
    renderer.shadowMap.enabled = true;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.getElementById('webgl').appendChild(renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;
}

function update(renderer, scene, camera, controls, clock) {
    controls.update();
    const xElem = document.querySelector('#x');
    const yElem = document.querySelector('#y');
    const zElem = document.querySelector('#z');
    xElem.textContent = Math.round(camera.position.x * 100)/100;
    yElem.textContent = Math.round(camera.position.y * 100)/100;
    zElem.textContent = Math.round(camera.position.z * 100)/100;
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    });
}

var scene = init();
