"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();


        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(0, 10, 5);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // NEW --- Control for the camera
        // ************************** //
        sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true;

        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const lightParent = new THREE.Object3D();
        
        const sunLight = new THREE.PointLight('rgb(255, 255, 255)', 1.2, 200);
        sunLight.position.set(0, 50, 0);
        sceneElements.sceneGraph.add(sunLight);

        // Setup shadow properties for the spotlight
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.name = "sunLight";
        
        lightParent.add(sunLight)

        var sunText = new THREE.TextureLoader().load( 'https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg' )
        const sunGeom = new THREE.SphereGeometry(3.2,30,30)
        const sun = new THREE.Mesh(sunGeom, new THREE.MeshBasicMaterial({map: sunText}))
        lightParent.add(sun)
        sun.position.y = 50
        sun.name = "sun"
        lightParent.name = "lightParent"
        const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('https://pbs.twimg.com/media/CMdOmV9W8AA5--n?format=png&name=medium')}))
        moon.position.y = -50
        moon.name = "moon";
        lightParent.add(moon)

        sceneElements.sceneGraph.add(lightParent)
        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(255, 255, 150)', 1.0);
        renderer.setSize(width, height);

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};