"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
//  And from an example by Pedro Iglésias
//
// 		J. Madeira - April 2021


// To store the scene graph, and elements useful to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,  // NEW
    renderer: null,
};


var visibleFlag = 1;
var enable = 1;
var i = 0.04; 

// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

const sun = sceneElements.sceneGraph.getObjectByName("sun");
// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false, keyH = false, keyArrowDown = false, keyArrowLeft = false, keyArrowRight = false, keyArrowUp = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 65: //a
            i += 0.01;
            keyA = true;
            break;
        case 68: //d
            if (i>0) i -= 0.01;
            keyD = true;
            break;
        case 72: //h
            visibleFlag = !visibleFlag;
            keyH = true;            
            break;
        case 83: //s
            enable = !enable;
            keyS = true;
            break;
        case 87: //w
            sun.position.set(0, 30, 0);
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 72: //h
            keyH = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

var car = createCar(sceneElements.sceneGraph);
    sceneElements.sceneGraph.add(car);

    car.translateZ(5)
    car.translateX(-2)

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const loader = new THREE.TextureLoader();
    const grass = loader.load("https://i.imgur.com/dyR4hwl.jpeg")
    const tile = loader.load("https://static.vecteezy.com/ti/fotos-gratis/t1/1369175-textura-de-asfalto-preto-foto.jpg")
    const pavement = loader.load("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi6F2er5ExHegEBmcdSIIThwiz7TPHMszs5Q&usqp=CAU")
    tile.wrapS = THREE.RepeatWrapping;
    tile.wrapT = THREE.RepeatWrapping;
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    pavement.wrapS = THREE.RepeatWrapping;
    pavement.wrapT = THREE.RepeatWrapping;
    pavement.repeat.set (1,4);

    const planeGeometry = new THREE.BoxGeometry(25,25,0.1);
    const planeMaterial = new THREE.MeshPhongMaterial({ map: grass, color: 'rgb(100, 255, 100)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    var entrance = new THREE.Mesh(new THREE.BoxGeometry(3,0.01,5), new THREE.MeshPhongMaterial({map: pavement}))
    sceneGraph.add(entrance)
    entrance.translateX(1)
    entrance.translateZ(-2.5)
    entrance.translateY(0.05)
    var entrance2 = entrance.clone()
    entrance2.translateZ(5)
    sceneGraph.add(entrance2)
    var entrance3 = new THREE.Mesh(new THREE.BoxGeometry(8.9,0.01,4.5), new THREE.MeshPhongMaterial({map: tile}))
    sceneGraph.add(entrance3)
    entrance3.translateY(0.051)
    entrance3.translateZ(5)

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;
    
    // HOUSE
    addFloorToScene(sceneGraph, 5, 0.1, 10, 5, 0, -5, 0xBA8C63);
    addFloorToScene(sceneGraph, 7, 0.1, 5, -1, 0, -7.5, 0xBA8C63);
    var wall1 = addWallToScene(sceneGraph, 0.1, 3,  10,   7.5,  1.5, -5, "wall1");
    var wall2 = addWallToScene(sceneGraph, 5,  3, 0.1,    5,  1.5, 0, "wall2");
    var wall3 = addWallToScene(sceneGraph, 0.1,  3, 5,    2.5,  1.5, -2.5, "wall3");
    var wall4 = addWallToScene(sceneGraph, 7,  3, 0.1,    -1,  1.5, -5, "wall4");
    var wall5 = addWallToScene(sceneGraph, 0.1,  3, 5,    -4.5,  1.5, -7.5, "wall5");
    var wall6 = addWallToScene(sceneGraph, 12,  3, 0.1,    1.5,  1.5, -10, "wall6");
    clearHolesWalls(sceneGraph); 
    furnishHouse(sceneGraph);

    
    var roof3 = createRoof(sceneGraph, 10.5,0.2,3, 2.75,2.5,-5, "roof3", true, 1.21, -0.6);
    var roof4 = createRoof(sceneGraph, 10.5,0.2,3, 5,2,-5, "roof4", false, 0.71, 1.9);
    var roof5 = createRoof2(sceneGraph, 3, 0.2, 7, 1.25, 2.5, -5, "roof5", true, 0.55, -1.45, 2.5);
    var roof6= createRoof2(sceneGraph, 3, 0.2, 7, -1.25, 2.5, -10, "roof6", false, 0.55, -1.45, 0.0);
   
    // GARAGE
    addFloorToScene(sceneGraph, 3, 0.1, 5, 6, 0, 5, 0xC0C0C0);
    var wall7 = addWallToScene(sceneGraph, 3,  3, 0.1,    6,  1.5, 2.5, "wall7");
    var wall8 = addWallToScene(sceneGraph, 0.1,  3, 5,    7.5,  1.5, 5, "wall8");
    var wall9 = addWallToScene(sceneGraph, 3,  3, 0.1,    6,  1.5, 7.5, "wall9");
    var wall10 = addWallToScene(sceneGraph, 0.1,  3, 1.5,    4.5,  1.5, 3.25, "wall10");
    var wall11 = addWallToScene(sceneGraph, 0.1,  3, 1.5,    4.5,  1.5, 6.75, "wall11");
    var wall12 = addWallToScene(sceneGraph, 0.1, 1, 2,4.5, 2.5, 5, "wall12", false)
    var roof1 = createRoof(sceneGraph, 5.5,0.2,2, 4.5,2.5,5, "roof1", true, 0.9, -0.5);
    var roof2 = createRoof(sceneGraph, 5.5,0.2,2, 5.3,2,5, "roof2", false, 1.1, 1.8);
    
    
    var door1 = createDoor(sceneGraph, 1, -4.95, 0x6a4940)
    
    
    // The CAMERA

    // --- Where the viewer is and how he is looking at the scene

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Position the camera

    sceneElements.camera.position.x = -15;
    sceneElements.camera.position.y = 10;
    sceneElements.camera.position.z = 10;

    // Point the camera to the center of the scene

    camera.lookAt(sceneGraph.position);

    sceneGraph.add(camera) 
}



    var deltaX = sceneElements.sceneGraph.getObjectByName("sun").position.x;
    var deltaY = sceneElements.sceneGraph.getObjectByName("sun").position.y;

    var decreaseX = false; 
    var decreaseY = true;

function computeFrame(time) {

    // THE SPOT LIGHT

    // Can extract an object from the scene Graph from its name
    
    var step = i*time;
    car.position.x = 2 + (3.5 * Math.cos(step * 0.03));


    // Apply a small displacement
    
    if(enable){
        if(decreaseX){
            deltaX -= 0.1;
            if(deltaX <= -30){
                decreaseX = false;
            }
        } else {
            deltaX += 0.1;
            if (deltaX >= 30){
                decreaseX = true;
            }
        }
        if(decreaseY){
            deltaY -= 0.1;
            if(deltaY <= -30){
                decreaseY = false;
            }
        } else {
            deltaY += 0.1;
            if (deltaY >= 30){
                decreaseY = true;
            }
        }
    }   
    
    sun.position.set(deltaX, deltaY, 0);

    if(keyW) deltaX = 0; deltaY = 40; sun.position.set(deltaX, deltaY,0);
    // CONTROLING OBJECTS WITH KEYBOARD

    const wall1 =  sceneElements.sceneGraph.getObjectByName("wall1");    
    const wall2 =  sceneElements.sceneGraph.getObjectByName("wall2");    
    const wall3 =  sceneElements.sceneGraph.getObjectByName("wall3");
    const wall4 =  sceneElements.sceneGraph.getObjectByName("wall4");
    const wall5 =  sceneElements.sceneGraph.getObjectByName("wall5");
    const wall6 =  sceneElements.sceneGraph.getObjectByName("wall6");
    const wall7 =  sceneElements.sceneGraph.getObjectByName("wall7");
    const wall8 =  sceneElements.sceneGraph.getObjectByName("wall8");
    const wall9=   sceneElements.sceneGraph.getObjectByName("wall9");
    const wall10 = sceneElements.sceneGraph.getObjectByName("wall10");
    const wall11 = sceneElements.sceneGraph.getObjectByName("wall11");
    const wall12 = sceneElements.sceneGraph.getObjectByName("wall12");
    const roof1 =  sceneElements.sceneGraph.getObjectByName("roof1");
    const roof2 =  sceneElements.sceneGraph.getObjectByName("roof2");
    const roof3 =  sceneElements.sceneGraph.getObjectByName("roof3");
    const roof4 =  sceneElements.sceneGraph.getObjectByName("roof4");
    const roof5 =  sceneElements.sceneGraph.getObjectByName("roof5");
    const roof6 =  sceneElements.sceneGraph.getObjectByName("roof6");
    const prism1 = sceneElements.sceneGraph.getObjectByName("prism1");    
    const prism2 = sceneElements.sceneGraph.getObjectByName("prism2");
    const prism3 = sceneElements.sceneGraph.getObjectByName("prism3");    
    const prism4 = sceneElements.sceneGraph.getObjectByName("prism4");
    const prism5 = sceneElements.sceneGraph.getObjectByName("prism5");
    const prism6 = sceneElements.sceneGraph.getObjectByName("prism6");
    
    
    
    if (keyH) {
        if(visibleFlag){
            wall1.visible = false;
            wall2.visible = false;
            wall3.visible = false;
            wall4.visible = false;
            wall5.visible = false;
            wall6.visible = false;
            wall7.visible = false;            
            wall8.visible = false;            
            wall9.visible = false;
            wall10.visible = false;
            wall11.visible = false;
            wall12.visible = false;
            roof1.visible = false;
            roof2.visible = false;
            roof3.visible = false;
            roof4.visible = false;
            roof5.visible = false;
            roof6.visible = false;
            prism1.visible = false;
            prism2.visible = false;
            prism3.visible = false;
            prism4.visible = false;
            prism5.visible = false;
            prism6.visible = false;
        }
        else{
            wall1.visible = true;
            wall2.visible = true;
            wall3.visible = true;
            wall4.visible = true;
            wall5.visible = true;
            wall6.visible = true;
            wall7.visible = true;
            wall8.visible = true;
            wall9.visible = true;
            wall10.visible = true;
            wall11.visible = true;
            wall1.visible = true;
            roof1.visible = true;
            roof2.visible = true;
            roof3.visible = true;
            roof4.visible = true;
            roof5.visible = true;
            roof6.visible = true;
            prism1.visible = true;
            prism2.visible = true;
            prism3.visible = true;
            prism4.visible = true;
            prism5.visible = true;            
            prism6.visible = true;
        }
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}

function addFloorToScene(scene, width, height, depth, x, y, z, color) {
    var geometry = new THREE.BoxBufferGeometry(width, height, depth);

    var edgesMaterial = new THREE.MeshPhongMaterial({ color: color });
    var cubeMaterial = new THREE.Mesh(geometry, edgesMaterial);

    scene.add(cubeMaterial);

    // With a constant color

    var floorMaterial = new THREE.MeshPhongMaterial({ color: color });

    // The axes
    const axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);
    // The cube 

    var floor = new THREE.Mesh(geometry, floorMaterial);

    scene.add(floor);
    floor.receiveShadow = true;
    floor.position.x =  x;
    cubeMaterial.position.x = x;
    floor.position.y = (1.5*y)+0.05;
    cubeMaterial.position.y = (1.5*y)+0.05;
    floor.position.z =  z;
    cubeMaterial.position.z = z;
}

function addWallToScene(scene, width, height, depth, x, y, z, name, wrap) {
    const loader = new THREE.TextureLoader();
    const mapOverlay = loader.load("https://i.imgur.com/lrznAwVb.jpg")
    mapOverlay.wrapS = THREE.RepeatWrapping;
    mapOverlay.wrapT = THREE.RepeatWrapping;
    
    if(wrap){
        mapOverlay.repeat.set(1,1);
    }
    else mapOverlay.repeat.set(5,5);
    
    

     
    var wallGeometry = new THREE.BoxBufferGeometry(width, height, depth);
    var wallMaterial = new THREE.MeshPhongMaterial({map: mapOverlay, color: 0xffffff });
    var wall = new THREE.Mesh(wallGeometry, wallMaterial);
    scene.add(wall);

    wall.name = name;

    wall.position.x = x+0.01;
    wall.position.y = y+0.01;
    wall.position.z = z+0.01;

    wall.receiveShadow = true;
    wall.castShadow = true;
}

function createDoor(scene, x,z,color){
    const loader = new THREE.TextureLoader();
    const mapOverlay = loader.load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/333c539c-253d-4900-aab3-9e9bdd76327a/d4iwzs7-3038c1bf-f18c-472d-91cd-2549c922e337.jpg/v1/fill/w_632,h_1264,q_70,strp/wooden_door_texture_by_ancientorange_d4iwzs7-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTgwMCIsInBhdGgiOiJcL2ZcLzMzM2M1MzljLTI1M2QtNDkwMC1hYWIzLTllOWJkZDc2MzI3YVwvZDRpd3pzNy0zMDM4YzFiZi1mMThjLTQ3MmQtOTFjZC0yNTQ5YzkyMmUzMzcuanBnIiwid2lkdGgiOiI8PTkwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.EDHb7yzUBrr6Ywlg2z1sUzLnO__a8nFul8Cpl_Dvo_Q")
    var wallGeometry = new THREE.BoxBufferGeometry(1, 2, 0.1);
    var edgesMaterial = new THREE.MeshBasicMaterial({ map: mapOverlay, color: color });
    var door = new THREE.Mesh(wallGeometry, edgesMaterial);
    scene.add(door);

    door.position.x = x;
    door.position.y = 1.05;
    door.position.z = z;
}

function createRoof(scene, height, width, depth, x, y, z, name, reverse,translateZ, translateY){
    const loader = new THREE.TextureLoader();
    const mapOverlay = loader.load('https://i.imgur.com/qblNfOO.jpeg.jpg');
    mapOverlay.wrapS = THREE.RepeatWrapping;
    mapOverlay.wrapT = THREE.RepeatWrapping;
    mapOverlay.repeat.set(4,4);
    
    // Draw roof
    const roofShape = new THREE.BoxBufferGeometry(height,width,depth);
    const roofMaterial = new THREE.MeshPhongMaterial({map: mapOverlay, color: 0xff0000 });
    const roof = new THREE.Mesh(roofShape, roofMaterial);
    scene.add(roof);

    if(reverse){
        roof.rotateY(-Math.PI / 2);
        roof.rotateX(-Math.PI / 2 - 1.2);
    }
    else{
        roof.rotateY(Math.PI / 2);
        roof.rotateX(Math.PI / 2 - 1.2);
    }
    
    roof.translateZ(translateZ);
    roof.translateY(translateY);

    roof.position.x += x;
    roof.position.y += y;
    roof.position.z += z;

    roof.name = name;
}

function createRoof2(scene, height, width, depth, x, y, z, name, reverse,translateY, translateX, translateZ){
    //const textureLoader = new THREE.TextureLoader();
    //const roofTexture = textureLoader.load('./textures/telha.jpg');
    
    const loader = new THREE.TextureLoader();
    const mapOverlay = loader.load('https://i.imgur.com/qblNfOO.jpeg.jpg');
    mapOverlay.wrapS = THREE.RepeatWrapping;
    mapOverlay.wrapT = THREE.RepeatWrapping;
    mapOverlay.repeat.set(2,2);

    // Draw roof
    const roofShape = new THREE.BoxBufferGeometry(height,width,depth);
    const roofMaterial = new THREE.MeshPhongMaterial({ map: mapOverlay, color: 0xff0000 });
    const roof = new THREE.Mesh(roofShape, roofMaterial);
    scene.add(roof);

    if(reverse){
        roof.rotateY(-Math.PI / 2);
        roof.rotateZ(-Math.PI / 4 + 0.4);
    }
    else{
        roof.rotateY(Math.PI / 2);
        roof.rotateZ(-Math.PI / 4 + 0.4);
    }
    
    roof.translateY(translateY);
    roof.translateX(translateX);
    roof.translateZ(translateZ);

    roof.position.x += x;
    roof.position.y += y;
    roof.position.z += z;

    roof.name = name;
}

function clearHolesWalls(scene){
    const loader = new THREE.TextureLoader();
    const mapOverlay = loader.load("https://i.imgur.com/lrznAwVb.jpg")
    mapOverlay.wrapS = THREE.RepeatWrapping;
    mapOverlay.wrapT = THREE.RepeatWrapping;
    mapOverlay.repeat.set(1.5,1.5)


    PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
    var A = new THREE.Vector3( 0, 0);
    var B = new THREE.Vector2( 5, 0);
    var C = new THREE.Vector2( 2.5, 1.125 );
    var D = new THREE.Vector2( 3, 0);
    var E = new THREE.Vector2( 1.5, 0.5);


    var height = 0.1;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); 
    var material = new THREE.MeshPhongMaterial( {map: mapOverlay, color: 0xffffff} );



    var prism1 = new THREE.Mesh( geometry, material );
    scene.add(prism1)
    prism1.translateY(3)
    prism1.translateX(2.5)

    var prism2 = new THREE.Mesh( geometry, material );
    scene.add(prism2)
    prism2.rotation.y = Math.PI / 2;
    prism2.translateY(3)
    prism2.translateX(4.9)
    prism2.translateZ(-4.6)

    var prism3 = prism1.clone()
    scene.add(prism3)
    prism3.translateZ(-10.1)

    var prism4 = prism2.clone()
    scene.add(prism4)
    prism4.translateZ(6.7)

    var prism5 = new THREE.Mesh( new PrismGeometry([A, D, E], height), material);
    scene.add(prism5)
    prism5.translateX(4.55)
    prism5.translateY(3)
    prism5.translateZ(2.46)

    var prism6 = prism5.clone()
    scene.add(prism6)
    prism6.translateZ(5)

    prism1.name = "prism1"
    prism2.name = "prism2"
    prism3.name = "prism3"
    prism4.name = "prism4"
    prism5.name = "prism5"
    prism6.name = "prism6"
}

function PrismGeometry( vertices, height ) {

    var Shape = new THREE.Shape();
    ( function f( ctx ) {
    ctx.moveTo( vertices[0].x, vertices[0].y );
        for (var i=1; i < vertices.length; i++) {
            ctx.lineTo( vertices[i].x, vertices[i].y );
        }
        ctx.lineTo( vertices[0].x, vertices[0].y );    
    } )( Shape );

    var settings = { };
    settings.amount = height;
    settings.bevelEnabled = false;
    THREE.ExtrudeGeometry.call( this, Shape, settings );
};

function furnishHouse(scene){ 
    var wall1 =  addWallToScene(scene,  0.1, 0.2, 10.1,  7.5,  0.15,   -5, "none");
    var wall2 =  addWallToScene(scene,  5.1, 0.2,  0.1,    5,  0.15,    0, "none2");
    var wall3 =  addWallToScene(scene,  0.1, 0.2,  5.1,  2.5,  0.15, -2.5, "none3");
    var wall4 =  addWallToScene(scene,  7.1, 0.2,  0.1,   -1,  0.15,   -5, "none4");
    var wall5 =  addWallToScene(scene,  0.1, 0.2,  5.1, -4.5,  0.15, -7.5, "none5");
    var wall6 =  addWallToScene(scene, 12.1, 0.2,  0.1,  1.5,  0.15,  -10, "none6");
    var wall7 =  addWallToScene(scene,  5.1, 0.2,  0.1,    5,  0.15,   -4, "none7");
    var wall8 =  addWallToScene(scene,  0.1, 0.2,  4.1,  4.5,  0.15,   -2, "none8");
    var wall9 =  addWallToScene(scene,  0.1, 0.2,  5.1,    0,  0.15, -7.5, "none9");
    var wall10 = addWallToScene(scene,    3, 0.2,  0.1,    6,  0.15,  2.5, "none10");
    var wall11 = addWallToScene(scene,  0.1, 0.2,    5,  7.5,  0.15,    5, "none11");
    var wall12 = addWallToScene(scene,    3, 0.2,  0.1,    6,  0.15,  7.5, "none12");
    var wall13 = addWallToScene(scene,  0.1, 0.2,    5,  4.5,  0.15,    5, "none13");


    
   
}


function CreateWheels(){
    const geometry = new THREE.BoxBufferGeometry(0.6, 0.6, 1.65);
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
}

function createCar(scene) {
        const car = new THREE.Group();
        
        const backWheel = CreateWheels();
        backWheel.position.y = 0.3;
        backWheel.position.x = -0.9;
        car.add(backWheel);
        
        const frontWheel = CreateWheels();
        frontWheel.position.y = 0.3;  
        frontWheel.position.x = 0.9;
        car.add(frontWheel);
      
        const main = new THREE.Mesh(
          new THREE.BoxBufferGeometry(3, 0.75, 1.5),
          new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        main.position.y = 0.6;
        car.add(main);
      
        const cabin = new THREE.Mesh(
          new THREE.BoxBufferGeometry(1.65, 0.6, 1.2),
          new THREE.MeshPhongMaterial({ color: 0xffffff })
        );
        cabin.position.x = -0.3;
        cabin.position.y = 1.275;
        car.add(cabin);
      
        return car;
}
      
      