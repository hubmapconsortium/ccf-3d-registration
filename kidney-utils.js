function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}

function giveRandom(min, max){
    return Math.random() * (max - min) + min;
}

function getSphere(size, color) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);

    var material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 100
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    var model = new THREE.Object3D();

    var test = new THREE.BoxHelper(model, new THREE.Color("rgb(255,255,255)"));
    model.add(test);
    test.setFromObject(model);

    model.add(mesh);
    //    console.log(model.name)

    return model;
}

function getArrowHelper(origin, dir, length, color) {
    var dir = dir;

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();


    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, color);
    return arrowHelper;
}


function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;

    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;

    return light;
}



function getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        // side: THREE.DoubleSide
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        default:
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
    }

    return selectedMaterial;
}

function getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.bias = 0.001;

    return light;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;

    return mesh;
}