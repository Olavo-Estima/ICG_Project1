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
var enable = 0;
var carSpeed = 0.04;
var manual = 0;

// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

const sun = sceneElements.sceneGraph.getObjectByName("lightParent");
// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false, keyH = false, keyArrowDown = false, keyArrowLeft = false, keyArrowRight = false, keyArrowUp = false, keyM = false;
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
        case 37:
            keyArrowLeft = true;
            break;
        case 38:
            keyArrowUp = true;
            break;
        case 39:
            keyArrowRight = true;
            break;
        case 40:
            keyArrowDown = true;
            break;
        case 65: //a
            carSpeed += 0.01;
            keyA = true;
            break;
        case 68: //d
            if (carSpeed > 0) carSpeed -= 0.01;
            keyD = true;
            break;
        case 72: //h
            visibleFlag = !visibleFlag;
            keyH = true;            
            break;
        case 77: //m
            manual = !manual;
            keyM = true;
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
    
        case 37:
            keyArrowLeft = false;
            break;
        case 38:
            keyArrowUp = false;
            break;
        case 39:
            keyArrowRight = false;
            break;
        case 40:
            keyArrowDown = false;
            break;
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
        case 77: //m
            keyM = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

var car = createCar();
sceneElements.sceneGraph.add(car);

car.translateZ(3)
car.translateX(0)
car.castShadow = true;

var house = createHouse(sceneElements.sceneGraph, 4, 8, 15, 0xff9999, -10, -10, true);
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
    grass.repeat.set(5,5)
    pavement.wrapS = THREE.RepeatWrapping;
    pavement.wrapT = THREE.RepeatWrapping;
    pavement.repeat.set (1,4);

    const planeGeometry = new THREE.BoxGeometry(50,50,0.1);
    const planeMaterial = new THREE.MeshPhongMaterial({ map: grass, side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);


    createTree(sceneGraph, 15, 0);
    createTree(sceneGraph, 15, -15);
    createTree(sceneGraph, 15, 15);
    createTree(sceneGraph, -15, 15);
    createTree(sceneGraph, -15, 0);
    createFence(sceneGraph)
   
    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;
    
    // HOUSE
    
    // The CAMERA

    // --- Where the viewer is and how he is looking at the scene

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Position the camera

    sceneElements.camera.position.x = 0;
    sceneElements.camera.position.y = 40;
    sceneElements.camera.position.z = 50;

    // Point the camera to the center of the scene

    camera.lookAt(sceneGraph.position);

    sceneGraph.add(camera) 
}



    var deltaX = sceneElements.sceneGraph.getObjectByName("lightParent").position.x;
    var deltaY = sceneElements.sceneGraph.getObjectByName("lightParent").position.y;

    var decreaseX = false; 
    var decreaseY = true;

function computeFrame(time) {

    // THE SPOT LIGHT

    // Can extract an object from the scene Graph from its name
    
        var disp = 0.5;
        if (car.position.x < 25 && car.position.x > -25 && car.position.z < 25  && car.position.z > -25){
            if (keyArrowUp) { 
                car.translateX(disp*.5);
            }
            if (keyArrowLeft) {
                car.rotation.y += 0.1;
                car.translateZ(-disp/3);
                car.translateX(disp/3);
            }
            if (keyArrowDown) {
                car.translateX(-disp*.5);
            }
            if (keyArrowRight) {
                car.rotation.y -= 0.1;
                car.translateZ(disp/3);
                car.translateX(disp/3);
            }
    
        } else {
            const currx = car.position.x;
            const currz = car.position.z;
    
            if (currx >= 25){ car.position.set( (-currx ) +0.1, 0, currz ) } 
            if (currx <= -25) { car.position.set( (-currx) -0.1, 0, currz )  }
            if (currz >= 25){ car.position.set( currx, 0, -currz+0.1 )  } 
            if (currz <= -25) { car.position.set( currx, 0, -currz-0.1 )  }
        }
    // Apply a small displacement
    
    if(enable){
       sun.rotateZ(0.002)
    }   
    
    sun.position.set(deltaX, deltaY, 0);

    if(keyW) { deltaX = 0; deltaY = 30; sun.position.set(deltaX, deltaY,0); }
    // CONTROLING OBJECTS WITH KEYBOARD

    
    
    if (keyH) {
        if(visibleFlag){
           house.visible = true;
        }
        else{
            house.visible = false;
        }
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}

function createTree(scene, posX, posZ){
    var tree = new THREE.Group();
    
    // Base
    var geometry = new THREE.CylinderGeometry(0.35, 0.5, 5, 40, 1);
    const treeBase = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    tree.add(treeBase);
    treeBase.position.y = 2.5;
    geometry = new THREE.CylinderGeometry(0.3, 0.35, 2, 40, 1);
    const treePart2 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    treePart2.position.y = 6;
    tree.add(treePart2)
    geometry = new THREE.CylinderGeometry(0.1, 0.35, 4, 40, 1);
    const treePart3 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    treePart3.rotateX(Math.PI/4)
    treePart3.position.y = 8.2;
    treePart3.position.z = 1.5
    tree.add(treePart3);
    const treePart4 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    treePart4.rotateX(-Math.PI/4 - 0.3)
    treePart4.position.y = 5;
    treePart4.position.z = -1.8
    tree.add(treePart4);
    const treePart5 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    treePart5.rotateX(-Math.PI/4)
    treePart5.rotateZ(Math.PI/3)
    treePart5.position.y = 7.5;
    treePart5.position.z = -0.7
    treePart5.position.x = -1.8
    tree.add(treePart5);
    const treePart6 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial({color: 0xff0000, map: new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80")}));
    treePart6.rotateZ(-Math.PI/4)
    treePart6.position.y = 8.3;
    treePart6.position.x = 1.4
    tree.add(treePart6)

    // Folhas
    const leaves = new THREE.TextureLoader().load("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80");
    leaves.wrapS = THREE.RepeatWrapping;
    leaves.wrapT = THREE.RepeatWrapping;
    leaves.repeat.set(3,3)
    const treePart7 = new THREE.Mesh(new THREE.SphereGeometry(2, 25, 13), new THREE.MeshPhongMaterial({color:0x00FF00, map: leaves }))
    const treePart8 = treePart7.clone();
    const treePart9 = treePart7.clone();
    const treePart10 = treePart7.clone();
    treePart7.position.y = 5.5;
    treePart7.position.z = -2.5;
    tree.add(treePart7);
    treePart8.position.y = 9.5;
    treePart8.position.x = 3;
    tree.add(treePart8);
    treePart9.position.y = 9.5;
    treePart9.position.z = 3;
    tree.add(treePart9);
    treePart10.position.y = 9;
    treePart10.position.x = -3;
    treePart10.position.z = -1.5;
    tree.add(treePart10);
    scene.add(tree);
    tree.position.x = posX;
    tree.position.z = posZ;

    tree.rotateY(Math.floor(Math.random() * Math.PI));

    treeBase.castShadow = true;
    treePart2.castShadow = true;
    treePart3.castShadow = true;
    treePart4.castShadow = true;
    treePart5.castShadow = true;
    treePart6.castShadow = true;
    treePart7.castShadow = true;
    treePart8.castShadow = true;
    treePart9.castShadow = true;
    treePart10.castShadow = true;
}

function createFence(scene){
    const fence = new THREE.Group();
    const fencePart1 = new THREE.Group();

    const part1 = new THREE.Shape();
    part1.moveTo(0,0);
    part1.lineTo(0,2);
    part1.lineTo(0.2,2.5);
    part1.lineTo(0.4,2);
    part1.lineTo(0.4,0);
    part1.lineTo(0,0);
    
    const geometry = new THREE.ExtrudeBufferGeometry([part1], {
        steps: 5,
        depth: 0.1,
        bevelEnabled: false
    })

    var wood = new THREE.TextureLoader().load("https://images.unsplash.com/photo-1582231675377-b17f783ce211?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=648&q=80");
    wood.wrapS = THREE.RepeatWrapping;
    wood.wrapT = THREE.RepeatWrapping;
    wood.repeat.set(0.4,0.4);
    
    var first = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xc07341, map: wood }))
    fencePart1.add(first);

    var second = first.clone()
    second.translateX(0.43);
    fencePart1.add(second)

    var third = second.clone()
    third.translateX(0.43);
    fencePart1.add(third)

    var forth = third.clone()
    forth.translateX(0.43);
    fencePart1.add(forth)

    var connector = new THREE.Shape();
    connector.moveTo(0,1.15);
    connector.lineTo(0,1.30);
    connector.lineTo(1.72, 1.30);
    connector.lineTo(1.72, 1.15);
    connector.lineTo(0, 1.15);
    
    const geometry2 = new THREE.ExtrudeBufferGeometry([connector], {
        steps: 5,
        depth: 0.05,
        bevelEnabled: false
    })
    
    var connectors = new THREE.Mesh(geometry2, new THREE.MeshPhongMaterial({color: 0xc07341, map: wood}))
    fencePart1.add(connectors);
    connectors.translateZ(-0.1);

    fence.add(fencePart1)
    
    var fence1Part2 = fencePart1.clone();
    fence1Part2.translateX(1.72);
    fencePart1.add(fence1Part2)

    var fence1Part3 = fencePart1.clone();
    fence1Part3.translateX(2* 1.72);
    fencePart1.add(fence1Part3)

    var fence1Part4 = fencePart1.clone();
    fence1Part4.translateX(4*1.72);
    fencePart1.add(fence1Part4)
    
    var fencePart5 = fencePart1.clone();
    var fencePart4 = fencePart1.clone();
    var fencePart6 = fencePart1.clone();

    var fence1Part5 = fencePart1.clone();
    fence1Part5.translateX(8*1.72);
    fencePart1.add(fence1Part5)


    var fence1Part6 = fence1Part5.clone();
    fence1Part6.translateX(8*1.72);
    fencePart1.add(fence1Part6)
    
    var fencePart2 = fencePart1.clone();
    var fencePart3 = fencePart1.clone();

    var fence4Part2 = fence1Part5.clone();
    fence4Part2.translateX(8*1.72);
    fencePart4.add(fence4Part2);

   /*  var fence4Part3 = fence1Part5.clone();
    fence4Part3.translateX(8*1.72);
    fencePart4.add(fence4Part3); */
    
    fencePart1.rotateY(Math.PI/2);
    fencePart1.translateX(-21.2);
    fencePart1.translateZ(21.2);
    fencePart2.rotateY(-Math.PI/2);
    fencePart2.translateX(-20);
    fencePart2.translateZ(20)
    fencePart3.rotateY(Math.PI);
    fencePart3.translateX(-21.2)
    fencePart3.translateZ(20)
    fencePart4.translateX(-20)
    fencePart4.translateZ(21.2)
    fencePart5.rotateY(-Math.PI/2);
    fencePart5.translateX(7.5);
    fencePart5.translateZ(-7.5);
    fencePart6.rotateY(Math.PI/2);
    fencePart6.translateX(-21.2)
    fencePart6.translateZ(-6.3)

    fence.add(fencePart2)
    fence.add(fencePart3)
    fence.add(fencePart4)
    fence.add(fencePart5)
    fence.add(fencePart6)
    scene.add(fence);
    

}

function createHouse(scene, height, width, depth, color, posX, posZ, horizontal){
    const house = new THREE.Group();
    
    var wallOverlay = new THREE.TextureLoader().load('https://i.imgur.com/lrznAwVb.jpg')
    wallOverlay.wrapS = THREE.RepeatWrapping;
    wallOverlay.wrapT = THREE.RepeatWrapping;

    // Wall Shapes
    const tiltWallShape = new THREE.Shape();
    tiltWallShape.moveTo(0, 0);
    tiltWallShape.lineTo(width/2, 0);
    tiltWallShape.lineTo(width/2, height - 0.5);
    tiltWallShape.lineTo(0, height);
    tiltWallShape.lineTo(0, 0);
    const tiltWallGeometry = new THREE.ExtrudeBufferGeometry([ tiltWallShape ], {
        steps: 1,
        depth: .2,
        bevelEnabled: false,
        curveSegments: 32
    });

    const tiltWallShape2 = new THREE.Shape();
    tiltWallShape2.moveTo(0, 0);
    tiltWallShape2.lineTo(depth+0.2, 0);
    tiltWallShape2.lineTo(depth+0.2, height - 0.5);
    tiltWallShape2.lineTo(0, height - 0.5);
    tiltWallShape2.lineTo(0, 0);
    const tiltWallGeometry2 = new THREE.ExtrudeBufferGeometry([ tiltWallShape2 ], {
        steps: 1,
        depth: .2,
        bevelEnabled: false,
        curveSegments: 32
    });

    // House Walls
    const tiltWallA = new THREE.Mesh(tiltWallGeometry, new THREE.MeshPhongMaterial({ color: color, map: wallOverlay }));
    house.add(tiltWallA)

    const tiltWallB = tiltWallA.clone();
    tiltWallB.rotateY(Math.PI);
    tiltWallB.translateZ(-0.2);
    house.add(tiltWallB)

    const tiltWallC = tiltWallA.clone();
    tiltWallC.translateZ(-depth);
    house.add(tiltWallC);

    const tiltWallD = tiltWallB.clone();
    tiltWallD.translateZ(depth);
    house.add(tiltWallD);

    const tiltWallE = new THREE.Mesh(
        tiltWallGeometry2, new THREE.MeshPhongMaterial({color: color, map: wallOverlay })
    );
    
    house.add(tiltWallE);
    tiltWallE.translateX(width/2)
    tiltWallE.translateZ(0.2)
    tiltWallE.rotateY(Math.PI/2);

    const tiltWallF = tiltWallE.clone();
    tiltWallF.translateZ(-width);
    house.add(tiltWallF);

    // Entrance Door
    /* const doorShape = new THREE.Path();
    doorShape.moveTo(0, 0);
    doorShape.lineTo(2, 0);
    doorShape.lineTo(2, 1.5);
    doorShape.bezierCurveTo(2,2.5,0,2.5,0,1.5);
    doorShape.lineTo(0, 0);
   
    var doorHole = new THREE.Mesh(doorShape,new THREE.MeshStandardMaterial({ color: 0xFF0000}))
    house.add(doorHole) */

    // Roof Shape
    const tiltRoofShape = new THREE.Shape();
    tiltRoofShape.moveTo(0, 0);
    tiltRoofShape.lineTo(height+0.5, 0);
    tiltRoofShape.lineTo(height+0.5, depth +1);
    tiltRoofShape.lineTo(0, depth+1);
    tiltRoofShape.lineTo(0, 0);
    const tiltRoofGeometry = new THREE.ExtrudeBufferGeometry([ tiltRoofShape ], {
        steps: 1,
        depth: .2,
        bevelEnabled: false,
        curveSegments: 32
    });
    var roofOverlay = new THREE.TextureLoader().load('https://i.imgur.com/qblNfOO.jpeg.jpg')
    roofOverlay.wrapS = THREE.RepeatWrapping;
    roofOverlay.wrapT = THREE.RepeatWrapping;

    var chimneyOverlay = new THREE.TextureLoader().load('https://i.imgur.com/qblNfOO.jpeg.jpg');
    chimneyOverlay.wrapS = THREE.RepeatWrapping;
    chimneyOverlay.wrapT = THREE.RepeatWrapping;
    chimneyOverlay.repeat.set(3,3)


    const roofA = new THREE.Mesh(tiltRoofGeometry, new THREE.MeshPhongMaterial({ color: 0xff0000, map: roofOverlay }));
    const roofB = roofA.clone()
    roofA.rotateX(Math.PI/2)
    roofA.rotateY(0.15)
    roofA.translateY(-depth-0.4)
    roofA.translateX(-width/2+0.22)
    roofA.translateZ(-height-0.2)
    house.add(roofA);
    
    
    roofB.rotateX(Math.PI/2)
    roofB.rotateY(-0.15)
    roofB.translateY(-depth-0.4)
    roofB.translateX(-0.52)
    roofB.translateZ(-height-0.22)
    house.add(roofB)

    

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1,1.5,1), new THREE.MeshPhongMaterial({map: wallOverlay}))
    chimney.position.y = 4.5;
    chimney.position.x = -2.5;
    chimney.position.z = -2;
    house.add(chimney);
    const chimneyTop = new THREE.Mesh(new THREE.ConeGeometry(1.2,0.5,4), new THREE.MeshPhongMaterial({color: 0xFF0000, map: chimneyOverlay}))
    chimneyTop.position.y = 5.5;
    chimneyTop.position.x = -2.5;
    chimneyTop.position.z = -2;
    chimneyTop.rotateY(Math.PI/4)
    house.add(chimneyTop);

    scene.add(house);


    if(horizontal){ 
        house.rotateY(-Math.PI/2)
        house.position.x = posX;
        house.position.z = posZ;
    }

    tiltWallA.castShadow = true;
    tiltWallB.castShadow = true;
    tiltWallC.castShadow = true;
    tiltWallD.castShadow = true;
    tiltWallE.castShadow = true;
    tiltWallF.castShadow = true;
    roofA.castShadow = true;
    roofB.castShadow = true;
    roofA.receiveShadow = true;
    roofB.receiveShadow = true;
    chimney.castShadow = true;
    chimneyTop.castShadow = true;
}

function CreateWheels(){
    const geometry = new THREE.BoxBufferGeometry(0.6, 0.6, 1.65);
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.castShadow = true;
    return wheel;
}

function createCar() {
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
        new THREE.MeshPhongMaterial({ color: 0x0000ff, map: new THREE.TextureLoader().load("https://images.squarespace-cdn.com/content/v1/541d868ce4b0c158abe9c5f3/1478627110609-TNJRVO41UEIS2E7ZQEC9/image-asset.png?format=1000w") })
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
    
    
    cabin.castShadow = true;
    backWheel.castShadow = true;
    frontWheel.castShadow = true;
    main.castShadow = true;
    car.rotateY(Math.PI/2);
    return car;
}