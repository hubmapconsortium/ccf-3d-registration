function init() {
    var scene = new THREE.Scene();

    var box = getBox(1, 1, 1);
    var plane = getPlane(20);
    var pointLight = getPointLight(1);

    box.position.y = box.geometry.parameters.height / 2;
    plane.rotation.x = Math.PI / 2;
    pointLight.position.y = 2;
    pointLight.intensity = 2;

    setupKidney(scene);

    scene.add(box);
    scene.add(plane);

    scene.add(pointLight);


    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var kidney = new THREE.Group();
    var textureLoader = new THREE.TextureLoader();
    var loader = new THREE.OBJLoader();
    loader.load(
        'assets/kidney/NLMVHM_Kidneys.obj'
        // '/assets/models/head/lee-perry-smith-head-scan.obj'
        ,

        function (object) {

            var colorMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-DM.jpg');
            var bumpMap = textureLoader.load('/assets/kidney/NLMVHM_Kidneys-NM.jpg');
            var faceMaterial = getMaterial('lambert', 'rgb(255, 255, 255)');


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

            object.position.z = 5;
            object.position.y = -100;
            

            // gui.add(faceMaterial, "opacity", 0, 1);
            kidney.add(object);


            console.log("kidney loaded at pos:" + object.position.y);


        }
    );





    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(0,0,0)');
    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;

    // var box = getBox(1,1,1);
    // scene.add(box);
    //     var group = new THREE.Group();
    //     setupKidney(group);

    //     var camera = new THREE.PerspectiveCamera(
    //         45,
    //         window.innerWidth / window.innerHeight,
    //         1,
    //         1000
    //     );

    //     const canvas = document.querySelector('#c');


    //     var renderer = new THREE.WebGLRenderer({
    //         canvas: canvas
    //     });
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     renderer.setClearColor('rgb(120, 120, 120)');
    //     renderer.shadowMap.enabled = true;
    //     var controls = new THREE.OrbitControls(camera, renderer.domElement);

    //     camera.position.x = 1;
    //     camera.position.y = 2;
    //     camera.position.z = 5;

    //     camera.lookAt(new THREE.Vector3(0, 0, 0));

    //     var renderer = new THREE.WebGLRenderer();
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     document.getElementById('webgl').appendChild(renderer.domElement);
    //     renderer.render(
    //         scene,
    //         camera
    //     );
}

function update(renderer, scene, camera, controls) {
    renderer.render(
        scene,
        camera
    );

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}

console.log("hello");

init();