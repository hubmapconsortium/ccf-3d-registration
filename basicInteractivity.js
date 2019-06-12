var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    INTERSECTED, SELECTED;
var intersectColor = 0xFFFF00;
var selectColor = 0xFF0000;
var unselectColor = 0xffffff;
// var projector = new THREE.Projector();
var camera = new THREE.PerspectiveCamera(
    50, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane
    1000 // far clipping plane
);
var scene = new THREE.Scene();

var kidney = getBox(5, 10, 5);
kidney.position.x = -10;
kidney.position.z = -10;
scene.add(kidney);
kidney.name = "kidney";
kidney.isSelected = false;


var sliver = getBox(2.5, 5, 5)
sliver.position.x = 10;
sliver.position.y = -5;
sliver.position.z = -10;
scene.add(sliver);
sliver.name = "sliver";
sliver.isSelected = false;



function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    // console.log(kidney.isSelected)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function name(params) {

}

document.onkeypress = function (e) {
    e = e || window.event;
    // console.log(e.key);
    // use e.keyCode
};

// movement - please calibrate these values
var xSpeed = 1;
var ySpeed = 1;

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    
    var keyCode = event.which;
    console.log(keyCode)
    if (keyCode == 87) {
        // console.log('w pressed');
        sliver.position.y += ySpeed;
    } else if (keyCode == 83) {
        sliver.position.y -= ySpeed;
    } else if (keyCode == 65) {
        sliver.position.x -= xSpeed;
    } else if (keyCode == 68) {
        sliver.position.x += xSpeed;
    } else if (keyCode == 32) {
        sliver.position.set(0, 0, 0);
    }
};

function onDocumentMouseDown(event) {
    console.log();
    if (event.button == 0) {
        // update the picking ray with the camera and mouse position
        var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
        // projector.unprojectVector(vector, camera);
        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects(scene.children, true);
        console.log(intersects);
        // if there is one (or more) intersections
        if (intersects.length > 0) {
            console.log('You clicked on an object: ' + intersects[0].object.name);
            SELECTED = intersects[0];
            console.log(SELECTED);
            SELECTED.object.isSelected = true;
            SELECTED.object.material.color =
                new THREE.Color(0xff0000);
            console.log(SELECTED.object.material.color)

        } else {
            console.log("You clicked nothing.");
            kidney.isSelected = false;
            sliver.isSelected = false;
            // SELECTED.object.isSelected = false;
        }
        // console.log(SELECTED.object.isSelected);
    }

}


function init() {
    // set up scene + camera

    var clock = new THREE.Clock();


    // Place camera on x axis
    camera.position.set(0, 0, 30);
    camera.up = new THREE.Vector3(0, 1, 0);



    // set up lighting
    var dirLight1 = getDirectionalLight(.8);
    scene.add(dirLight1);
    dirLight1.position.x = 10;
    dirLight1.position.y = 5;
    var dirLight2 = getDirectionalLight(.8);
    scene.add(dirLight2);
    dirLight2.position.x = -10;
    dirLight2.position.y = 5;
    var dirLight3 = getDirectionalLight(.7);
    scene.add(dirLight3);
    dirLight3.position.z = 5;
    dirLight3.position.y = -5;
    scene.add(dirLight3);
    var dirLight4 = getDirectionalLight(.7);
    dirLight4.position.z = -5;
    scene.add(dirLight4);

    //set up canvas + renderer
    const canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(20,20,20)');
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);
    renderer.render(
        scene,
        camera
    );

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        // console.log('resiizng');
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    document.getElementById('webgl').appendChild(renderer.domElement);
    update(renderer, scene, camera, controls);
    return scene;
}

function update(renderer, scene, camera, controls, clock) {
    controls.update();
    camera.updateProjectionMatrix();
    const xElem = document.querySelector('#x');
    const yElem = document.querySelector('#y');
    const zElem = document.querySelector('#z');
    xElem.textContent = Math.round(camera.position.x * 100) / 100;
    yElem.textContent = Math.round(camera.position.y * 100) / 100;
    zElem.textContent = Math.round(camera.position.z * 100) / 100;

    if (kidney.isSelected == false) {
        kidney.material.color = new THREE.Color(unselectColor);
    }
    if (sliver.isSelected == false) {
        sliver.material.color = new THREE.Color(unselectColor);
    }
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(intersectColor);
            console.log(INTERSECTED);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    });
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onDocumentMouseDown, false);
}



init();