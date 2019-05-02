function init() {
    // set up scene + camera
    var scene = new THREE.Scene();
    var clock = new THREE.Clock();

    var camera = new THREE.PerspectiveCamera(
        50, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );

    
    // var camera = new THREE.OrthographicCamera(  window.innerWidth / - 200, window.innerWidth / 200, window.innerHeight / 200, window.innerHeight / -200, - 500, 1000);


    // set up 3D content 
    // kidney
    var kidneyWidth = 4;
    var kidneyHeight = 3;
    var kidneyDepth = 10;
    var kidney = new THREE.Group();
    scene.add(kidney);

    var geometry = new THREE.BoxGeometry(kidneyWidth, kidneyHeight, kidneyDepth);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        transparent: true,
        opacity: .4
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    kidney.add(mesh);

    //draw kidney BoxHelper
    var kidneyHelper = new THREE.BoxHelper(kidney);
    // scene.add(kidneyHelper);

    //spheres inside kidney
    var sphereRadius = .1;

    var sphereColors = [
        //red
        new THREE.Color("rgb(255, 0, 0)"),
        //green
        new THREE.Color("rgb(0, 255, 0)"),
        //blue
        new THREE.Color("rgb(0, 0, 255)")

    ];

    var spheresInside = new THREE.Group();
    var sphereArray = [];
    var numSpheres = 100;
    for (let index = 0; index < numSpheres; index++) {
        var newSphere = getSphere(sphereRadius, sphereColors[Math.round(Math.random() * 2)]);
        newSphere.position.x = giveRandom(-kidneyWidth / 2, kidneyWidth / 2);
        newSphere.position.y = giveRandom(-kidneyHeight / 2, kidneyHeight / 2);
        newSphere.position.z = giveRandom(-kidneyDepth / 2, kidneyDepth / 2);
        sphereArray.push(newSphere);
    }
    // console.log("new spheres: " + sphereArray[3].position.x);

    for (let index = 0; index < sphereArray.length; index++) {
        spheresInside.add(sphereArray[index]);
    }
    scene.add(spheresInside);

    //sliver
    var sliverOffset = -10; //determines distance between sliver and kidney
    var sliver = new THREE.Group();
    scene.add(sliver);
    var sliverWidth = giveRandom(2, kidneyWidth);
    var sliverHeight = giveRandom(2, kidneyHeight);
    var sliverDepth = giveRandom(2, kidneyDepth);
    var geometry = new THREE.BoxGeometry(sliverWidth, sliverHeight, sliverDepth);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        transparent: true,
        opacity: .4
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    sliver.add(mesh);

    //determine which spheres are inside the sliver so they can be copied
    //first, we draw some basic geometry as helpers
    var sliverHelper = new THREE.BoxHelper(sliver);
    scene.add(sliverHelper);
    var sliverBox3 = new THREE.Box3();
    sliverBox3.setFromObject(sliver);

    var spheresOutside = new THREE.Group();

    //for every sphere whose Box3 is within sliverBox3, we create a new sphere the same position, add it to spheresOutside, and add elements in the array to sliver
    scene.add(spheresOutside);
    for (let index = 0; index < sphereArray.length; index++) {

        var currentSphere = sphereArray[index];
        var copy = getSphere(sphereRadius, currentSphere.children[1].material.color);
        copy.position.x = currentSphere.position.x;
        copy.position.y = currentSphere.position.y;
        copy.position.z = currentSphere.position.z;
        var sphereBox3 = new THREE.Box3();
        sphereBox3.setFromObject(currentSphere);
        var sphereBox3Helper = new THREE.BoxHelper(currentSphere);

        if (sliverBox3.containsBox(sphereBox3)) {
            console.log("is in");
            var copyBoxHelper = new THREE.BoxHelper(currentSphere, 0xff0000);
            scene.add(copyBoxHelper);
            sliver.add(copy);
        } else {
            console.log("is out");
        }
    }

    //move sliver away from kidney 
    sliver.position.x = sliver.position.x + sliverOffset;

    // set up lighting
    var dirLight1 = getDirectionalLight(.7);
    scene.add(dirLight1);
    dirLight1.position.x = 10;
    dirLight1.position.y = 5;
    var dirLight2 = getDirectionalLight(.4);
    scene.add(dirLight2);
    dirLight2.position.x = -10;
    dirLight2.position.y = 5;
    var dirLight3 = getDirectionalLight(1);
    scene.add(dirLight3);
    dirLight3.position.z = 5;
    dirLight3.position.y = 5;

    camera.position.z = 10;
   


    //set up canvas + renderer
    const canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    // var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enablePan = false;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);
    renderer.render(
        scene,
        camera
    );

    //set up user input
    var controls = new THREE.SpaceNavigatorControls(options);
   
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

    // if (!controls.getSpaceNavigator()) {
    //     alert("Sorry, this demo only works with a Space Mouse.");
    // }

    document.getElementById('webgl').appendChild(renderer.domElement);
    update(renderer, scene, camera, controls);
    return scene;
}

function update(renderer, scene, camera, controls, clock) {
    controls.update();
    // update camera position
    camera.position.copy(controls.position);
    // // // update camera rotation
    camera.rotation.copy(controls.rotation);
    // // // when using mousewheel to control camera FOV
    // // camera.fov = controls.fov;
    camera.updateProjectionMatrix();
    // render();
    const xElem = document.querySelector('#x');
    const yElem = document.querySelector('#y');
    const zElem = document.querySelector('#z');
    xElem.textContent = Math.round(camera.position.x * 100) / 100;
    yElem.textContent = Math.round(camera.position.y * 100) / 100;
    zElem.textContent = Math.round(camera.position.z * 100) / 100;
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    });
}

init();