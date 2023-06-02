import * as THREE from 'three';
import {
    PointerLockControls
} from 'PointerLockControls';
import {
    GUI
} from 'https://cdn.skypack.dev/dat.gui';
import {
    TWEEN
} from 'TWEENJS';

document.addEventListener('DOMContentLoaded', Start);


var map;

var mapState = window.localStorage.getItem('map');
if (mapState !== null) {

    map = parseInt(mapState, 10);
} else {
    map = 1;
}
console.log(map);



var cena = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;


document.body.appendChild(renderer.domElement);


var camaraPerspetiva = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.2,
    500
);

var camaraOrtografica = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
);

camaraOrtografica.position.set(0, 200, 0); // Adjust the Y position to move the camera above the scene
camaraOrtografica.up.set(0, 0, -1); // Set the up direction to point downwards

var zoomFactor;



if (map == 1) {
    zoomFactor = 0.02;
    camaraOrtografica.top = 20;
    camaraOrtografica.bottom = -window.innerHeight * zoomFactor / 2;
    camaraOrtografica.left = -window.innerWidth * zoomFactor / 2;
    camaraOrtografica.right = window.innerWidth * zoomFactor / 2;
} else if (map == 2) {
    zoomFactor = 0.05;
    camaraOrtografica.top = 35;
    camaraOrtografica.bottom = -window.innerHeight * zoomFactor / 2;
    camaraOrtografica.left = -window.innerWidth * zoomFactor / 2;
    camaraOrtografica.right = window.innerWidth * zoomFactor / 2;
} else {
    camaraOrtografica.top = 45;
    camaraOrtografica.bottom = -100;
    camaraOrtografica.left = -70;
    camaraOrtografica.right = 50;
}


camaraOrtografica.rotation.x = -Math.PI / 2; // Rotate the camera to look straight down
camaraOrtografica.updateProjectionMatrix();


// Offset used to have a 3rd person view to the sphere;
var cameraOffset = new THREE.Vector3(2, 15, 0);


//Esfera
var sphere = new THREE.SphereGeometry(1, 64, 32);
var textura = new THREE.TextureLoader().load('./Images/marbleText.jpg');
var materialtextura = new THREE.MeshLambertMaterial({
    map: textura
});
var meshsphere = new THREE.Mesh(sphere, materialtextura);
meshsphere.castShadow = true;
camaraOrtografica.lookAt(meshsphere.position);



//Goal Form and Textures
var goalgeometry = new THREE.BoxGeometry(1, 1, 1);
var goaltexture = new THREE.TextureLoader().load('./Images/textura_goal.jpeg');
var goaltexture2 = new THREE.TextureLoader().load('./Images/redgoal_texture.avif');
var materialtexturaGoal = new THREE.MeshLambertMaterial({
    map: goaltexture,
    wireframe: false
});
var materialtexturaGoal2 = new THREE.MeshLambertMaterial({
    map: goaltexture2,
    wireframe: false
});

var spikegeometry = new THREE.ConeGeometry(1, 2, 64);
var spiketexture = new THREE.TextureLoader().load('./Images/spike_texture.jpg');
var spikemeshmaterial = new THREE.MeshLambertMaterial({
    map: spiketexture,
    wireframe: false
});

//Textura do cubo frágil
var textura_cubofrágil = new THREE.TextureLoader().load('./Images/textura-cubofragil.avif');

// --------------------------------------------------------------------- TUTORIAL MAP -----------------------------------------
var groundgeometryTGR = new THREE.BoxGeometry(10, 0.25, 20);

var groundtextureT = new THREE.TextureLoader().load('./Images/gorundtutorial.jpeg');
groundtextureT.wrapS = THREE.RepeatWrapping;
groundtextureT.wrapT = THREE.RepeatWrapping;
groundtextureT.repeat.set(5, 5);
var walltextureT = new THREE.TextureLoader().load('./Images/images(1).jpeg');
walltextureT.wrapS = THREE.RepeatWrapping;
walltextureT.wrapT = THREE.RepeatWrapping;
walltextureT.repeat.set(20, 20);
var materialtexturaGT = new THREE.MeshLambertMaterial({
    map: groundtextureT,
    wireframe: false
});



var uvAttribute = groundgeometryTGR.getAttribute('uv');

uvAttribute.setXY(0, 1, 0.05);
uvAttribute.setXY(1, 0, 0.05);
uvAttribute.setXY(2, 1, 0);
uvAttribute.setXY(3, 0, 0);

uvAttribute.setXY(4, 1, 0.05);
uvAttribute.setXY(5, 0, 0.05);
uvAttribute.setXY(6, 1, 0);
uvAttribute.setXY(7, 0, 0);

uvAttribute.setXY(8, 1, 1);
uvAttribute.setXY(9, 0, 1);
uvAttribute.setXY(10, 1, 0);
uvAttribute.setXY(11, 0, 0);

uvAttribute.setXY(12, 1, 1);
uvAttribute.setXY(13, 0, 1);
uvAttribute.setXY(14, 1, 0);
uvAttribute.setXY(15, 0, 0);

uvAttribute.setXY(16, 1, 0.05);
uvAttribute.setXY(17, 0, 0.05);
uvAttribute.setXY(18, 1, 0);
uvAttribute.setXY(19, 0, 0);

uvAttribute.setXY(20, 1, 0.05);
uvAttribute.setXY(21, 0, 0.05);
uvAttribute.setXY(22, 1, 0);
uvAttribute.setXY(23, 0, 0);

groundgeometryTGR.uvsNeedUpdate = true;
groundgeometryTGR.receiveShadow = true;


var meshgroundT = new THREE.Mesh(groundgeometryTGR, materialtexturaGT);
meshgroundT.position.set(0, -3, -3);
meshgroundT.receiveShadow = true;


var wallgeometryfrbk = new THREE.BoxGeometry(8, 1, 1);
var wallobstacles = new THREE.BoxGeometry(5, 1, 1);
var wallgeometrysides = new THREE.BoxGeometry(1, 1, 20);
var materialtxturaWT2 = new THREE.MeshLambertMaterial({
    map: walltextureT,
    wireframe: false
});



var uvAttributeWSides = wallgeometrysides.getAttribute('uv');
//Direita
uvAttributeWSides.setXY(0, 1, 0.05);
uvAttributeWSides.setXY(1, 0, 0.05);
uvAttributeWSides.setXY(2, 1, 0);
uvAttributeWSides.setXY(3, 0, 0);
//Esquerda
uvAttributeWSides.setXY(4, 1, 0.05);
uvAttributeWSides.setXY(5, 0, 0.05);
uvAttributeWSides.setXY(6, 1, 0);
uvAttributeWSides.setXY(7, 0, 0);
//Cima
uvAttributeWSides.setXY(8, 0.05, 1);
uvAttributeWSides.setXY(9, 0, 1);
uvAttributeWSides.setXY(10, 0.05, 0);
uvAttributeWSides.setXY(11, 0, 0);
//Baixo
uvAttributeWSides.setXY(12, 0.05, 1);
uvAttributeWSides.setXY(13, 0, 1);
uvAttributeWSides.setXY(14, 0.05, 0);
uvAttributeWSides.setXY(15, 0, 0);
//Frente
uvAttributeWSides.setXY(16, 0.05, 1);
uvAttributeWSides.setXY(17, 0, 1);
uvAttributeWSides.setXY(18, 0.05, 0);
uvAttributeWSides.setXY(19, 0, 0);
//Trás
uvAttributeWSides.setXY(20, 0.05, 0.05);
uvAttributeWSides.setXY(21, 0, 0.05);
uvAttributeWSides.setXY(22, 0.05, 0);
uvAttributeWSides.setXY(23, 0, 0);

wallgeometrysides.uvsNeedUpdate = true;

var uvAttributeWFrBk = wallgeometryfrbk.getAttribute('uv');
//Direita
uvAttributeWFrBk.setXY(0, 0.05, 0.05);
uvAttributeWFrBk.setXY(1, 0, 0.05);
uvAttributeWFrBk.setXY(2, 0.05, 0);
uvAttributeWFrBk.setXY(3, 0, 0);
//Esquerda
uvAttributeWFrBk.setXY(4, 0.05, 0.05);
uvAttributeWFrBk.setXY(5, 0, 0.05);
uvAttributeWFrBk.setXY(6, 0.05, 0);
uvAttributeWFrBk.setXY(7, 0, 0);
//Cima
uvAttributeWFrBk.setXY(8, 0.4, 0.05);
uvAttributeWFrBk.setXY(9, 0, 0.05);
uvAttributeWFrBk.setXY(10, 0.4, 0);
uvAttributeWFrBk.setXY(11, 0, 0);
//Baixo
uvAttributeWFrBk.setXY(12, 0.4, 0.05);
uvAttributeWFrBk.setXY(13, 0, 0.05);
uvAttributeWFrBk.setXY(14, 0.4, 0);
uvAttributeWFrBk.setXY(15, 0, 0);
//Frente
uvAttributeWFrBk.setXY(16, 0.40, 0.05);
uvAttributeWFrBk.setXY(17, 0, 0.05);
uvAttributeWFrBk.setXY(18, 0.40, 0);
uvAttributeWFrBk.setXY(19, 0, 0);
//Trás
uvAttributeWFrBk.setXY(20, 0.4, 0.05);
uvAttributeWFrBk.setXY(21, 0, 0.05);
uvAttributeWFrBk.setXY(22, 0.4, 0);
uvAttributeWFrBk.setXY(23, 0, 0);

wallgeometryfrbk.uvsNeedUpdate = true;

var uvAttributeWOb = wallobstacles.getAttribute('uv');
//Direita
uvAttributeWOb.setXY(0, 0.05, 0.05);
uvAttributeWOb.setXY(1, 0, 0.05);
uvAttributeWOb.setXY(2, 0.05, 0);
uvAttributeWOb.setXY(3, 0, 0);
//Esquerda
uvAttributeWOb.setXY(4, 0.05, 0.05);
uvAttributeWOb.setXY(5, 0, 0.05);
uvAttributeWOb.setXY(6, 0.05, 0);
uvAttributeWOb.setXY(7, 0, 0);
//Cima
uvAttributeWOb.setXY(8, 0.2, 0.05);
uvAttributeWOb.setXY(9, 0, 0.05);
uvAttributeWOb.setXY(10, 0.2, 0);
uvAttributeWOb.setXY(11, 0, 0);
//Baixo
uvAttributeWOb.setXY(12, 0.2, 0.05);
uvAttributeWOb.setXY(13, 0, 0.05);
uvAttributeWOb.setXY(14, 0.2, 0);
uvAttributeWOb.setXY(15, 0, 0);
//Frente
uvAttributeWOb.setXY(16, 0.2, 0.05);
uvAttributeWOb.setXY(17, 0, 0.05);
uvAttributeWOb.setXY(18, 0.2, 0);
uvAttributeWOb.setXY(19, 0, 0);
//Trás
uvAttributeWOb.setXY(20, 0.2, 0.05);
uvAttributeWOb.setXY(21, 0, 0.05);
uvAttributeWOb.setXY(22, 0.2, 0);
uvAttributeWOb.setXY(23, 0, 0);

wallobstacles.uvsNeedUpdate = true;

var meshwallRT = new THREE.Mesh(wallgeometrysides, materialtxturaWT2);
meshwallRT.position.set(-4.50, -2.4, -3);

var meshwallLT = new THREE.Mesh(wallgeometrysides, materialtxturaWT2);
meshwallLT.position.set(4.50, -2.4, -3);

var meshwallFR = new THREE.Mesh(wallgeometryfrbk, materialtxturaWT2);
meshwallFR.position.set(0, -2.4, 6.5);

var meshwallBK = new THREE.Mesh(wallgeometryfrbk, materialtxturaWT2);
meshwallBK.position.set(0, -2.4, -12.5);

var meshgoal = new THREE.Mesh(goalgeometry, materialtexturaGoal);
meshgoal.position.set(-3.5, -2.4, 5.5);

var obs1T = new THREE.Mesh(wallobstacles, materialtxturaWT2);
obs1T.position.set(1.5, -2.4, -4.5);

var obs2T = new THREE.Mesh(wallobstacles, materialtxturaWT2);
obs2T.position.set(-1.5, -2.4, 1.5);

var materialsTutNiv = [wallgeometryfrbk, wallobstacles, wallgeometrysides, materialtxturaWT2, goalgeometry, groundgeometryTGR]

var parent_tutorial = new THREE.Object3D();
parent_tutorial.add(meshgroundT);
parent_tutorial.add(meshsphere);
parent_tutorial.add(meshwallRT);
parent_tutorial.add(meshwallLT);
parent_tutorial.add(meshwallFR);
parent_tutorial.add(meshwallBK);
parent_tutorial.add(meshgoal);
parent_tutorial.add(obs1T);
parent_tutorial.add(obs2T);

//Fim do mapa Tutorial - parent_tutorial is a complex object, composed by the ground, and the walls.
// --------------------------------------------------------------------- TUTORIAL MAP -----------------------------------------

// --------------------------------------------------------------------- EASY MAP ---------------------------------------------
var groundgeometryEs = new THREE.BoxGeometry(30, 0.25, 60);
var wallgeometryBKEs = new THREE.BoxGeometry(30, 2, 2);
var wallgeometryRTEs = new THREE.BoxGeometry(56, 2, 2);
var wallgeometryLTEs = new THREE.BoxGeometry(52, 2, 2);
var wallgeometryFREs = new THREE.BoxGeometry(22, 2, 2);
var obs1geometryES = new THREE.BoxGeometry(8, 2, 2);
var obs2geometryES = new THREE.BoxGeometry(10, 2, 2);
var obs3geometryES = new THREE.BoxGeometry(2, 2, 2);
var fragilecube = new THREE.BoxGeometry(2, 2, 2);
var moveblePlatform = new THREE.BoxGeometry(1, 2, 5);



var groundtextureES = new THREE.TextureLoader().load('./Images/images.jpeg');
groundtextureES.wrapS = THREE.RepeatWrapping;
groundtextureES.wrapT = THREE.RepeatWrapping;
groundtextureES.repeat.set(8, 10);
var walltextureEs = new THREE.TextureLoader().load('./Images/texturawall.jpeg');
walltextureEs.wrapS = THREE.RepeatWrapping;
walltextureEs.wrapT = THREE.RepeatWrapping;
walltextureEs.repeat.set(20, 1);
var walltextureEs2 = new THREE.TextureLoader().load('./Images/texturawall2.jpeg');
walltextureEs2.wrapS = THREE.RepeatWrapping;
walltextureEs2.wrapT = THREE.RepeatWrapping;
walltextureEs2.repeat.set(2, 1);


var materialcubofrágil = new THREE.MeshLambertMaterial({
    map: textura_cubofrágil
});
var groundmeshmaterialEs = new THREE.MeshLambertMaterial({
    map: groundtextureES,
    wireframe: false
});
var wallmeshmaterialEs = new THREE.MeshLambertMaterial({
    map: walltextureEs,
    wireframe: false
});
var wallmeshmaterialEs2 = new THREE.MeshLambertMaterial({
    map: walltextureEs2,
    wireframe: false
});
var uvAttributeEs = groundgeometryEs.getAttribute('uv');
var fallWallMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
});



uvAttributeEs.setXY(0, 0.1, 0.05);
uvAttributeEs.setXY(1, 0, 0.05);
uvAttributeEs.setXY(2, 0.1, 0);
uvAttributeEs.setXY(3, 0, 0);

uvAttributeEs.setXY(4, 1, 0.05);
uvAttributeEs.setXY(5, 0, 0.05);
uvAttributeEs.setXY(6, 1, 0);
uvAttributeEs.setXY(7, 0, 0);

uvAttributeEs.setXY(8, 1, 1);
uvAttributeEs.setXY(9, 0, 1);
uvAttributeEs.setXY(10, 1, 0);
uvAttributeEs.setXY(11, 0, 0);

uvAttributeEs.setXY(12, 1, 1);
uvAttributeEs.setXY(13, 0, 1);
uvAttributeEs.setXY(14, 1, 0);
uvAttributeEs.setXY(15, 0, 0);

uvAttributeEs.setXY(16, 1, 0.05);
uvAttributeEs.setXY(17, 0, 0.05);
uvAttributeEs.setXY(18, 1, 0);
uvAttributeEs.setXY(19, 0, 0);

uvAttributeEs.setXY(20, 1, 0.05);
uvAttributeEs.setXY(21, 0, 0.05);
uvAttributeEs.setXY(22, 1, 0);
uvAttributeEs.setXY(23, 0, 0);

groundgeometryEs.uvsNeedUpdate = true;

var uvAttributeBkwallEs = wallgeometryBKEs.getAttribute('uv');

//Direita
uvAttributeBkwallEs.setXY(0, 0.05, 1);
uvAttributeBkwallEs.setXY(1, 0, 1);
uvAttributeBkwallEs.setXY(2, 0.05, 0);
uvAttributeBkwallEs.setXY(3, 0, 0);
//Esquerda
uvAttributeBkwallEs.setXY(4, 0.05, 1);
uvAttributeBkwallEs.setXY(5, 0, 1);
uvAttributeBkwallEs.setXY(6, 0.05, 0);
uvAttributeBkwallEs.setXY(7, 0, 0);
//Cima
uvAttributeBkwallEs.setXY(8, 0.5, 1);
uvAttributeBkwallEs.setXY(9, 0, 1);
uvAttributeBkwallEs.setXY(10, 0.5, 0);
uvAttributeBkwallEs.setXY(11, 0, 0);
//Baixo
uvAttributeBkwallEs.setXY(12, 0.5, 1);
uvAttributeBkwallEs.setXY(13, 0, 1);
uvAttributeBkwallEs.setXY(14, 0.5, 0);
uvAttributeBkwallEs.setXY(15, 0, 0);
//Frente
uvAttributeBkwallEs.setXY(16, 0.5, 1);
uvAttributeBkwallEs.setXY(17, 0, 1);
uvAttributeBkwallEs.setXY(18, 0.5, 0);
uvAttributeBkwallEs.setXY(19, 0, 0);
//Trás
uvAttributeBkwallEs.setXY(20, 0.5, 1);
uvAttributeBkwallEs.setXY(21, 0, 1);
uvAttributeBkwallEs.setXY(22, 0.5, 0);
uvAttributeBkwallEs.setXY(23, 0, 0);

wallgeometryBKEs.uvsNeedUpdate = true;

var uvAttributeRTwallEs = wallgeometryRTEs.getAttribute('uv');
//Direita
uvAttributeRTwallEs.setXY(0, 0.05, 1);
uvAttributeRTwallEs.setXY(1, 0, 1);
uvAttributeRTwallEs.setXY(2, 0.05, 0);
uvAttributeRTwallEs.setXY(3, 0, 0);
//Esquerda
uvAttributeRTwallEs.setXY(4, 0.05, 1);
uvAttributeRTwallEs.setXY(5, 0, 1);
uvAttributeRTwallEs.setXY(6, 0.05, 0);
uvAttributeRTwallEs.setXY(7, 0, 0);
//Cima
uvAttributeRTwallEs.setXY(8, 0.5, 1);
uvAttributeRTwallEs.setXY(9, 0, 1);
uvAttributeRTwallEs.setXY(10, 0.5, 0);
uvAttributeRTwallEs.setXY(11, 0, 0);
//Baixo
uvAttributeRTwallEs.setXY(12, 0.5, 1);
uvAttributeRTwallEs.setXY(13, 0, 1);
uvAttributeRTwallEs.setXY(14, 0.5, 0);
uvAttributeRTwallEs.setXY(15, 0, 0);
//Frente
uvAttributeRTwallEs.setXY(16, 0.5, 1);
uvAttributeRTwallEs.setXY(17, 0, 1);
uvAttributeRTwallEs.setXY(18, 0.5, 0);
uvAttributeRTwallEs.setXY(19, 0, 0);
//Trás
uvAttributeRTwallEs.setXY(20, 0.5, 1);
uvAttributeRTwallEs.setXY(21, 0, 1);
uvAttributeRTwallEs.setXY(22, 0.5, 0);
uvAttributeRTwallEs.setXY(23, 0, 0);

wallgeometryRTEs.uvsNeedUpdate = true;

var uvAttributeFRwallEs = wallgeometryFREs.getAttribute('uv');

//Direita
uvAttributeFRwallEs.setXY(0, 0.05, 1);
uvAttributeFRwallEs.setXY(1, 0, 1);
uvAttributeFRwallEs.setXY(2, 0.05, 0);
uvAttributeFRwallEs.setXY(3, 0, 0);
//Esquerda
uvAttributeFRwallEs.setXY(4, 0.05, 1);
uvAttributeFRwallEs.setXY(5, 0, 1);
uvAttributeFRwallEs.setXY(6, 0.05, 0);
uvAttributeFRwallEs.setXY(7, 0, 0);
//Cima
uvAttributeFRwallEs.setXY(8, 0.35, 1);
uvAttributeFRwallEs.setXY(9, 0, 1);
uvAttributeFRwallEs.setXY(10, 0.35, 0);
uvAttributeFRwallEs.setXY(11, 0, 0);
//Baixo
uvAttributeFRwallEs.setXY(12, 0.35, 1);
uvAttributeFRwallEs.setXY(13, 0, 1);
uvAttributeFRwallEs.setXY(14, 0.35, 0);
uvAttributeFRwallEs.setXY(15, 0, 0);
//Frente
uvAttributeFRwallEs.setXY(16, 0.7, 0.05);
uvAttributeFRwallEs.setXY(17, 0, 0.05);
uvAttributeFRwallEs.setXY(18, 0.7, 0);
uvAttributeFRwallEs.setXY(19, 0, 0);
//Trás
uvAttributeFRwallEs.setXY(20, 0.35, 1);
uvAttributeFRwallEs.setXY(21, 0, 1);
uvAttributeFRwallEs.setXY(22, 0.35, 0);
uvAttributeFRwallEs.setXY(23, 0, 0);

wallgeometryFREs.uvsNeedUpdate = true;

var uvAttributeLTwallEs = wallgeometryLTEs.getAttribute('uv');
//Direita
uvAttributeLTwallEs.setXY(0, 0.05, 1);
uvAttributeLTwallEs.setXY(1, 0, 1);
uvAttributeLTwallEs.setXY(2, 0.05, 0);
uvAttributeLTwallEs.setXY(3, 0, 0);
//Esquerda
uvAttributeLTwallEs.setXY(4, 0.05, 1);
uvAttributeLTwallEs.setXY(5, 0, 1);
uvAttributeLTwallEs.setXY(6, 0.05, 0);
uvAttributeLTwallEs.setXY(7, 0, 0);
//Cima
uvAttributeLTwallEs.setXY(8, 0.5, 1);
uvAttributeLTwallEs.setXY(9, 0, 1);
uvAttributeLTwallEs.setXY(10, 0.5, 0);
uvAttributeLTwallEs.setXY(11, 0, 0);
//Baixo
uvAttributeLTwallEs.setXY(12, 0.5, 1);
uvAttributeLTwallEs.setXY(13, 0, 1);
uvAttributeLTwallEs.setXY(14, 0.5, 0);
uvAttributeLTwallEs.setXY(15, 0, 0);
//Frente
uvAttributeLTwallEs.setXY(16, 0.5, 1);
uvAttributeLTwallEs.setXY(17, 0, 1);
uvAttributeLTwallEs.setXY(18, 0.5, 0);
uvAttributeLTwallEs.setXY(19, 0, 0);
//Trás
uvAttributeLTwallEs.setXY(20, 0.5, 1);
uvAttributeLTwallEs.setXY(21, 0, 1);
uvAttributeLTwallEs.setXY(22, 0.5, 0);
uvAttributeLTwallEs.setXY(23, 0, 0);

wallgeometryLTEs.uvsNeedUpdate = true;

var uvAttributeobs1Es = obs1geometryES.getAttribute('uv');

//Direita
uvAttributeobs1Es.setXY(0, 0.05, 1);
uvAttributeobs1Es.setXY(1, 0, 1);
uvAttributeobs1Es.setXY(2, 0.05, 0);
uvAttributeobs1Es.setXY(3, 0, 0);
//Esquerda
uvAttributeobs1Es.setXY(4, 0.05, 1);
uvAttributeobs1Es.setXY(5, 0, 1);
uvAttributeobs1Es.setXY(6, 0.05, 0);
uvAttributeobs1Es.setXY(7, 0, 0);
//Cima
uvAttributeobs1Es.setXY(8, 0.2, 1);
uvAttributeobs1Es.setXY(9, 0, 1);
uvAttributeobs1Es.setXY(10, 0.2, 0);
uvAttributeobs1Es.setXY(11, 0, 0);
//Baixo
uvAttributeobs1Es.setXY(12, 0.2, 1);
uvAttributeobs1Es.setXY(13, 0, 1);
uvAttributeobs1Es.setXY(14, 0.2, 0);
uvAttributeobs1Es.setXY(15, 0, 0);
//Frente
uvAttributeobs1Es.setXY(16, 0.2, 1);
uvAttributeobs1Es.setXY(17, 0, 1);
uvAttributeobs1Es.setXY(18, 0.2, 0);
uvAttributeobs1Es.setXY(19, 0, 0);
//Trás
uvAttributeobs1Es.setXY(20, 0.2, 1);
uvAttributeobs1Es.setXY(21, 0, 1);
uvAttributeobs1Es.setXY(22, 0.2, 0);
uvAttributeobs1Es.setXY(23, 0, 0);

obs1geometryES.uvsNeedUpdate = true;

var uvAttributeobs2Es = obs2geometryES.getAttribute('uv');

//Direita
uvAttributeobs2Es.setXY(0, 0.05, 1);
uvAttributeobs2Es.setXY(1, 0, 1);
uvAttributeobs2Es.setXY(2, 0.05, 0);
uvAttributeobs2Es.setXY(3, 0, 0);
//Esquerda
uvAttributeobs2Es.setXY(4, 0.05, 1);
uvAttributeobs2Es.setXY(5, 0, 1);
uvAttributeobs2Es.setXY(6, 0.05, 0);
uvAttributeobs2Es.setXY(7, 0, 0);
//Cima
uvAttributeobs2Es.setXY(8, 0.25, 1);
uvAttributeobs2Es.setXY(9, 0, 1);
uvAttributeobs2Es.setXY(10, 0.25, 0);
uvAttributeobs2Es.setXY(11, 0, 0);
//Baixo
uvAttributeobs2Es.setXY(12, 0.25, 1);
uvAttributeobs2Es.setXY(13, 0, 1);
uvAttributeobs2Es.setXY(14, 0.25, 0);
uvAttributeobs2Es.setXY(15, 0, 0);
//Frente
uvAttributeobs2Es.setXY(16, 0.25, 1);
uvAttributeobs2Es.setXY(17, 0, 1);
uvAttributeobs2Es.setXY(18, 0.25, 0);
uvAttributeobs2Es.setXY(19, 0, 0);
//Trás
uvAttributeobs2Es.setXY(20, 0.25, 1);
uvAttributeobs2Es.setXY(21, 0, 1);
uvAttributeobs2Es.setXY(22, 0.25, 0);
uvAttributeobs2Es.setXY(23, 0, 0);

obs2geometryES.uvsNeedUpdate = true;

var uvAttributeobs3Es = obs3geometryES.getAttribute('uv');

//Direita
uvAttributeobs3Es.setXY(0, 0.05, 1);
uvAttributeobs3Es.setXY(1, 0, 1);
uvAttributeobs3Es.setXY(2, 0.05, 0);
uvAttributeobs3Es.setXY(3, 0, 0);
//Esquerda
uvAttributeobs3Es.setXY(4, 0.05, 1);
uvAttributeobs3Es.setXY(5, 0, 1);
uvAttributeobs3Es.setXY(6, 0.05, 0);
uvAttributeobs3Es.setXY(7, 0, 0);
//Cima
uvAttributeobs3Es.setXY(8, 0.05, 1);
uvAttributeobs3Es.setXY(9, 0.05, 1);
uvAttributeobs3Es.setXY(10, 0.1, 0);
uvAttributeobs3Es.setXY(11, 0.05, 0);
//Baixo
uvAttributeobs3Es.setXY(12, 0.05, 1);
uvAttributeobs3Es.setXY(13, 0, 1);
uvAttributeobs3Es.setXY(14, 0.05, 0);
uvAttributeobs3Es.setXY(15, 0, 0);
//Frente
uvAttributeobs3Es.setXY(16, 0.05, 1);
uvAttributeobs3Es.setXY(17, 0, 1);
uvAttributeobs3Es.setXY(18, 0.05, 0);
uvAttributeobs3Es.setXY(19, 0, 0);
//Trás
uvAttributeobs3Es.setXY(20, 0.05, 1);
uvAttributeobs3Es.setXY(21, 0, 1);
uvAttributeobs3Es.setXY(22, 0.05, 0);
uvAttributeobs3Es.setXY(23, 0, 0);

obs3geometryES.uvsNeedUpdate = true;

var uvAttributePlatform = moveblePlatform.getAttribute('uv');
//Direita
uvAttributePlatform.setXY(0, 1, 1);
uvAttributePlatform.setXY(1, 0, 1);
uvAttributePlatform.setXY(2, 1, 0);
uvAttributePlatform.setXY(3, 0, 0);
//Esquerda
uvAttributePlatform.setXY(4, 1, 1);
uvAttributePlatform.setXY(5, 0, 1);
uvAttributePlatform.setXY(6, 1, 0);
uvAttributePlatform.setXY(7, 0, 0);
//Cima
uvAttributePlatform.setXY(8, 0.2, 1);
uvAttributePlatform.setXY(9, 0, 1);
uvAttributePlatform.setXY(10, 0.2, 0);
uvAttributePlatform.setXY(11, 0, 0);
//Baixo
uvAttributePlatform.setXY(12, 0.2, 1);
uvAttributePlatform.setXY(13, 0, 1);
uvAttributePlatform.setXY(14, 0.2, 0);
uvAttributePlatform.setXY(15, 0, 0);
//Frente
uvAttributePlatform.setXY(16, 0.2, 1);
uvAttributePlatform.setXY(17, 0, 1);
uvAttributePlatform.setXY(18, 0.2, 0);
uvAttributePlatform.setXY(19, 0, 0);
//Trás
uvAttributePlatform.setXY(20, 0.2, 1);
uvAttributePlatform.setXY(21, 0, 1);
uvAttributePlatform.setXY(22, 0.2, 0);
uvAttributePlatform.setXY(23, 0, 0);

moveblePlatform.uvsNeedUpdate = true;

var meshgroundEs = new THREE.Mesh(groundgeometryEs, groundmeshmaterialEs);
meshgroundEs.position.z = 0;
meshgroundEs.position.y = 0;
meshgroundEs.position.x = 0;

var meshBkwallEs = new THREE.Mesh(wallgeometryBKEs, wallmeshmaterialEs);
meshBkwallEs.position.z = -29;
meshBkwallEs.position.y = 1.1;
meshBkwallEs.position.x = 0;

var meshRTwallEs = new THREE.Mesh(wallgeometryRTEs, wallmeshmaterialEs);
meshRTwallEs.position.z = 0;
meshRTwallEs.position.y = 1.1;
meshRTwallEs.position.x = -14;
meshRTwallEs.rotateY(Math.PI / 2);

var meshFRwallEs = new THREE.Mesh(wallgeometryFREs, wallmeshmaterialEs);
meshFRwallEs.position.z = 29;
meshFRwallEs.position.y = 1.1;
meshFRwallEs.position.x = 0;

var meshLTwallEs = new THREE.Mesh(wallgeometryLTEs, wallmeshmaterialEs);
meshLTwallEs.position.z = 4;
meshLTwallEs.position.y = 1.1;
meshLTwallEs.position.x = 14;
meshLTwallEs.rotateY(Math.PI / 2);

var fallWallEs = new THREE.Mesh(wallgeometryLTEs, wallmeshmaterialEs);
fallWallEs.position.z = -4;
fallWallEs.position.y = 1.1;
fallWallEs.position.x = 19;
fallWallEs.rotateY(Math.PI / 2);

fallWallEs.material = fallWallMaterial;


var meshobs1Es = new THREE.Mesh(obs1geometryES, wallmeshmaterialEs);
meshobs1Es.position.z = -19;
meshobs1Es.position.y = 1.1;
meshobs1Es.position.x = -9;

var meshobs2Es = new THREE.Mesh(obs2geometryES, wallmeshmaterialEs);
meshobs2Es.position.z = -17;
meshobs2Es.position.y = 1.1;
meshobs2Es.position.x = 8;

var spike1Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike1Es.position.z = -19;
spike1Es.position.y = 1.1;
spike1Es.position.x = -4;
spike1Es.rotateZ(-Math.PI / 2);

var meshobs3Es = new THREE.Mesh(obs3geometryES, wallmeshmaterialEs);
meshobs3Es.position.z = 4;
meshobs3Es.position.y = 1.1;
meshobs3Es.position.x = 0.5;

var meshPlatformEs = new THREE.Mesh(moveblePlatform, wallmeshmaterialEs2);
meshPlatformEs.position.z = -23;
meshPlatformEs.position.y = 1.9;
meshPlatformEs.position.x = -1;

var meshobs4Es = new THREE.Mesh(obs2geometryES, wallmeshmaterialEs);
meshobs4Es.position.z = 17;
meshobs4Es.position.y = 1.1;
meshobs4Es.position.x = 8;

var meshgoalEs = new THREE.Mesh(goalgeometry, materialtexturaGoal2);
meshgoalEs.position.z = 18.5;
meshgoalEs.position.y = 1.6;
meshgoalEs.position.x = 11.5;

var spike2Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike2Es.position.z = -17;
spike2Es.position.y = 1.1;
spike2Es.position.x = -12;
spike2Es.rotateZ(-Math.PI / 2);

var spike3Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike3Es.position.z = -15;
spike3Es.position.y = 1.1;
spike3Es.position.x = -12;
spike3Es.rotateZ(-Math.PI / 2);

var spike4Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike4Es.position.z = -13;
spike4Es.position.y = 1.1;
spike4Es.position.x = -12;
spike4Es.rotateZ(-Math.PI / 2);

var spike5Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike5Es.position.z = -11;
spike5Es.position.y = 1.1;
spike5Es.position.x = -12;
spike5Es.rotateZ(-Math.PI / 2);

var spike6Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike6Es.position.z = -9;
spike6Es.position.y = 1.1;
spike6Es.position.x = -12;
spike6Es.rotateZ(-Math.PI / 2);

var spike7Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike7Es.position.z = -7;
spike7Es.position.y = 1.1;
spike7Es.position.x = -12;
spike7Es.rotateZ(-Math.PI / 2);

var spike8Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike8Es.position.z = -5;
spike8Es.position.y = 1.1;
spike8Es.position.x = -12;
spike8Es.rotateZ(-Math.PI / 2);

var spike9Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike9Es.position.z = -3;
spike9Es.position.y = 1.1;
spike9Es.position.x = -12;
spike9Es.rotateZ(-Math.PI / 2);

var spike10Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike10Es.position.z = -1;
spike10Es.position.y = 1.1;
spike10Es.position.x = -12;
spike10Es.rotateZ(-Math.PI / 2);

var spike11Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike11Es.position.z = 1;
spike11Es.position.y = 1.1;
spike11Es.position.x = -12;
spike11Es.rotateZ(-Math.PI / 2);

var spike12Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike12Es.position.z = 3;
spike12Es.position.y = 1.1;
spike12Es.position.x = -12;
spike12Es.rotateZ(-Math.PI / 2);

var spike13Es = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike13Es.position.z = 5;
spike13Es.position.y = 1.1;
spike13Es.position.x = -12;
spike13Es.rotateZ(-Math.PI / 2);

var meshfragilecubeEs = new THREE.Mesh(fragilecube, materialcubofrágil);
meshfragilecubeEs.position.z = 29;
meshfragilecubeEs.position.y = 1.1;
meshfragilecubeEs.position.x = -12;

var cubewallEs = new THREE.Mesh(obs3geometryES, wallmeshmaterialEs);
cubewallEs.position.z = 29;
cubewallEs.position.y = 1.1;
cubewallEs.position.x = -14;

var materialsEasNiv = [groundgeometryEs, wallgeometryBKEs, wallgeometryRTEs, wallgeometryFREs, wallgeometryLTEs,
    obs1geometryES, obs2geometryES, obs3geometryES, moveblePlatform, spikegeometry, goalgeometry, fragilecube
];

var parent_easy = new THREE.Object3D();
parent_easy.add(meshgroundEs);
parent_easy.add(meshBkwallEs);
parent_easy.add(meshRTwallEs);
parent_easy.add(meshFRwallEs);
parent_easy.add(meshLTwallEs);
parent_easy.add(meshobs1Es);
parent_easy.add(meshobs2Es);
parent_easy.add(spike1Es);
parent_easy.add(meshobs3Es);
parent_easy.add(meshPlatformEs);
parent_easy.add(meshobs4Es);
parent_easy.add(meshgoalEs);
parent_easy.add(spike2Es);
parent_easy.add(spike3Es);
parent_easy.add(spike4Es);
parent_easy.add(spike5Es);
parent_easy.add(spike6Es);
parent_easy.add(spike7Es);
parent_easy.add(spike8Es);
parent_easy.add(spike9Es);
parent_easy.add(spike10Es);
parent_easy.add(spike11Es);
parent_easy.add(spike12Es);
parent_easy.add(spike13Es);
parent_easy.add(meshfragilecubeEs);
parent_easy.add(cubewallEs);
parent_easy.add(fallWallEs);



//Mapa Medium
var groundgeometryMd = new THREE.BoxGeometry(20, 0.25, 20);
var groundgeometryMd2 = new THREE.BoxGeometry(8, 0.25, 12);
var wallgeometryMd1 = new THREE.BoxGeometry(20, 2, 2);
var wallgeometryMd2 = new THREE.BoxGeometry(18, 2, 2);
var wallgeometryMd3 = new THREE.BoxGeometry(4.2, 2, 2);
var wallgeometryMd4 = new THREE.BoxGeometry(5.825, 2, 2);
var wallgeometryMd5 = new THREE.BoxGeometry(10, 2, 2);
var wallgeometryMd6 = new THREE.BoxGeometry(14, 2, 2);
var wallgeometryMd7 = new THREE.BoxGeometry(6, 2, 2);
var platformgeometryMd = new THREE.BoxGeometry(8, 2, 1);
var platformgeometryMd2 = new THREE.BoxGeometry(1, 2, 4);
var wallgeometryMd8 = new THREE.BoxGeometry(4, 2, 2);
var wallgeometryMd9 = new THREE.BoxGeometry(6.18, 2, 2);
var wallgeometryMd10 = new THREE.BoxGeometry(5.82, 2, 2);
var gategeometryMd = new THREE.BoxGeometry(4, 2, 1);
var cubeobsgeometryMd = new THREE.BoxGeometry(2, 2, 2);

var texturawall = new THREE.TextureLoader().load('./Images/download.jpeg');
texturawall.wrapS = THREE.RepeatWrapping;
texturawall.wrapT = THREE.RepeatWrapping;
texturawall.repeat.set(6, 1);
var materialtexturawall = new THREE.MeshLambertMaterial({
    map: texturawall,
    wireframe: false
});

var texture_Md = new THREE.TextureLoader().load('./Images/dark_tiles_texture.jpg');
texture_Md.wrapS = THREE.RepeatWrapping;
texture_Md.wrapT = THREE.RepeatWrapping;
texture_Md.repeat.set(2, 2);
var materialtexturaFloorMd = new THREE.MeshLambertMaterial({
    map: texture_Md,
    wireframe: false
});

var gate_texture = new THREE.TextureLoader().load('./Images/gate_texture.jpeg');
var materialtexturagate = new THREE.MeshLambertMaterial({
    map: gate_texture,
    wireframe: false
});

var uvAttributeMd = groundgeometryMd.getAttribute('uv');
//Direita
uvAttributeMd.setXY(0, 1, 0.05);
uvAttributeMd.setXY(1, 0, 0.05);
uvAttributeMd.setXY(2, 1, 0);
uvAttributeMd.setXY(3, 0, 0);
//Esquerda
uvAttributeMd.setXY(4, 1, 0.05);
uvAttributeMd.setXY(5, 0, 0.05);
uvAttributeMd.setXY(6, 1, 0);
uvAttributeMd.setXY(7, 0, 0);
//Cima
uvAttributeMd.setXY(8, 1, 1);
uvAttributeMd.setXY(9, 0, 1);
uvAttributeMd.setXY(10, 1, 0);
uvAttributeMd.setXY(11, 0, 0);
//Baixo
uvAttributeMd.setXY(12, 1, 1);
uvAttributeMd.setXY(13, 0, 1);
uvAttributeMd.setXY(14, 1, 0);
uvAttributeMd.setXY(15, 0, 0);
//Frente
uvAttributeMd.setXY(16, 1, 0.05);
uvAttributeMd.setXY(17, 0, 0.05);
uvAttributeMd.setXY(18, 1, 0);
uvAttributeMd.setXY(19, 0, 0);
//Trás
uvAttributeMd.setXY(20, 1, 0.05);
uvAttributeMd.setXY(21, 0, 0.05);
uvAttributeMd.setXY(22, 1, 0);
uvAttributeMd.setXY(23, 0, 0);

groundgeometryMd.uvsNeedUpdate = true;

var uvAttributeMd2 = groundgeometryMd2.getAttribute('uv');

uvAttributeMd2.setXY(0, 0.6, 0.05);
uvAttributeMd2.setXY(1, 0, 0.05);
uvAttributeMd2.setXY(2, 0.6, 0);
uvAttributeMd2.setXY(3, 0, 0);

uvAttributeMd2.setXY(4, 0.6, 0.05);
uvAttributeMd2.setXY(5, 0, 0.05);
uvAttributeMd2.setXY(6, 0.6, 0);
uvAttributeMd2.setXY(7, 0, 0);

uvAttributeMd2.setXY(8, 0.4, 0.6);
uvAttributeMd2.setXY(9, 0, 0.6);
uvAttributeMd2.setXY(10, 0.4, 0);
uvAttributeMd2.setXY(11, 0, 0);

uvAttributeMd2.setXY(12, 0.4, 0.6);
uvAttributeMd2.setXY(13, 0, );
uvAttributeMd2.setXY(14, 0.4, 0);
uvAttributeMd2.setXY(15, 0, 0);

uvAttributeMd2.setXY(16, 0.4, 0.05);
uvAttributeMd2.setXY(17, 0, 0.05);
uvAttributeMd2.setXY(18, 0.4, 0);
uvAttributeMd2.setXY(19, 0, 0);

uvAttributeMd2.setXY(20, 0.4, 0.05);
uvAttributeMd2.setXY(21, 0, 0.05);
uvAttributeMd2.setXY(22, 0.4, 0);
uvAttributeMd2.setXY(23, 0, 0);

groundgeometryMd2.uvsNeedUpdate = true;

var uvAttributewallMd = wallgeometryMd1.getAttribute('uv');
//Direita
uvAttributewallMd.setXY(0, 0.2, 1);
uvAttributewallMd.setXY(1, 0, 1);
uvAttributewallMd.setXY(2, 0.2, 0);
uvAttributewallMd.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd.setXY(4, 0.2, 1);
uvAttributewallMd.setXY(5, 0, 1);
uvAttributewallMd.setXY(6, 0.2, 0);
uvAttributewallMd.setXY(7, 0, 0);
//Cima
uvAttributewallMd.setXY(8, 1, 1);
uvAttributewallMd.setXY(9, 0, 1);
uvAttributewallMd.setXY(10, 1, 0);
uvAttributewallMd.setXY(11, 0, 0);
//Baixo
uvAttributewallMd.setXY(12, 1, 1);
uvAttributewallMd.setXY(13, 0, 1);
uvAttributewallMd.setXY(14, 1, 0);
uvAttributewallMd.setXY(15, 0, 0);
//Frente
uvAttributewallMd.setXY(16, 1, 1);
uvAttributewallMd.setXY(17, 0, 1);
uvAttributewallMd.setXY(18, 1, 0);
uvAttributewallMd.setXY(19, 0, 0);
//Trás
uvAttributewallMd.setXY(20, 1, 1);
uvAttributewallMd.setXY(21, 0, 1);
uvAttributewallMd.setXY(22, 1, 0);
uvAttributewallMd.setXY(23, 0, 0);

wallgeometryMd1.uvsNeedUpdate = true;

var uvAttributewallMd2 = wallgeometryMd2.getAttribute('uv');

//Direita
uvAttributewallMd2.setXY(0, 0.2, 1);
uvAttributewallMd2.setXY(1, 0, 1);
uvAttributewallMd2.setXY(2, 0.2, 0);
uvAttributewallMd2.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd2.setXY(4, 0.2, 1);
uvAttributewallMd2.setXY(5, 0, 1);
uvAttributewallMd2.setXY(6, 0.2, 0);
uvAttributewallMd2.setXY(7, 0, 0);
//Cima
uvAttributewallMd2.setXY(8, 1, 1);
uvAttributewallMd2.setXY(9, 0, 1);
uvAttributewallMd2.setXY(10, 1, 0);
uvAttributewallMd2.setXY(11, 0, 0);
//Baixo
uvAttributewallMd2.setXY(12, 1, 1);
uvAttributewallMd2.setXY(13, 0, 1);
uvAttributewallMd2.setXY(14, 1, 0);
uvAttributewallMd2.setXY(15, 0, 0);
//Frente
uvAttributewallMd2.setXY(16, 1, 1);
uvAttributewallMd2.setXY(17, 0, 1);
uvAttributewallMd2.setXY(18, 1, 0);
uvAttributewallMd2.setXY(19, 0, 0);
//Trás
uvAttributewallMd2.setXY(20, 1, 1);
uvAttributewallMd2.setXY(21, 0, 1);
uvAttributewallMd2.setXY(22, 1, 0);
uvAttributewallMd2.setXY(23, 0, 0);

wallgeometryMd2.uvsNeedUpdate = true;

var uvAttributewallMd3 = wallgeometryMd3.getAttribute('uv');

//Direita
uvAttributewallMd3.setXY(0, 0.2, 1);
uvAttributewallMd3.setXY(1, 0, 1);
uvAttributewallMd3.setXY(2, 0.2, 0);
uvAttributewallMd3.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd3.setXY(4, 0.2, 1);
uvAttributewallMd3.setXY(5, 0, 1);
uvAttributewallMd3.setXY(6, 0.2, 0);
uvAttributewallMd3.setXY(7, 0, 0);
//Cima
uvAttributewallMd3.setXY(8, 0.3, 1);
uvAttributewallMd3.setXY(9, 0, 1);
uvAttributewallMd3.setXY(10, 0.3, 0);
uvAttributewallMd3.setXY(11, 0, 0);
//Baixo
uvAttributewallMd3.setXY(12, 0.3, 1);
uvAttributewallMd3.setXY(13, 0, 1);
uvAttributewallMd3.setXY(14, 0.3, 0);
uvAttributewallMd3.setXY(15, 0, 0);
//Frente
uvAttributewallMd3.setXY(16, 0.3, 1);
uvAttributewallMd3.setXY(17, 0, 1);
uvAttributewallMd3.setXY(18, 0.3, 0);
uvAttributewallMd3.setXY(19, 0, 0);
//Trás
uvAttributewallMd3.setXY(20, 0.3, 1);
uvAttributewallMd3.setXY(21, 0, 1);
uvAttributewallMd3.setXY(22, 0.3, 0);
uvAttributewallMd3.setXY(23, 0, 0);

wallgeometryMd3.uvsNeedUpdate = true;

var uvAttributewallMd4 = wallgeometryMd4.getAttribute('uv');

//Direita
uvAttributewallMd4.setXY(0, 0.2, 1);
uvAttributewallMd4.setXY(1, 0, 1);
uvAttributewallMd4.setXY(2, 0.2, 0);
uvAttributewallMd4.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd4.setXY(4, 0.2, 1);
uvAttributewallMd4.setXY(5, 0, 1);
uvAttributewallMd4.setXY(6, 0.2, 0);
uvAttributewallMd4.setXY(7, 0, 0);
//Cima
uvAttributewallMd4.setXY(8, 0.4, 1);
uvAttributewallMd4.setXY(9, 0, 1);
uvAttributewallMd4.setXY(10, 0.4, 0);
uvAttributewallMd4.setXY(11, 0, 0);
//Baixo
uvAttributewallMd4.setXY(12, 0.4, 1);
uvAttributewallMd4.setXY(13, 0, 1);
uvAttributewallMd4.setXY(14, 0.4, 0);
uvAttributewallMd4.setXY(15, 0, 0);
//Frente
uvAttributewallMd4.setXY(16, 0.4, 1);
uvAttributewallMd4.setXY(17, 0, 1);
uvAttributewallMd4.setXY(18, 0.4, 0);
uvAttributewallMd4.setXY(19, 0, 0);
//Trás
uvAttributewallMd4.setXY(20, 0.4, 1);
uvAttributewallMd4.setXY(21, 0, 1);
uvAttributewallMd4.setXY(22, 0.4, 0);
uvAttributewallMd4.setXY(23, 0, 0);

wallgeometryMd4.uvsNeedUpdate = true;

var uvAttributewallMd5 = wallgeometryMd5.getAttribute('uv');

//Direita
uvAttributewallMd5.setXY(0, 0.2, 1);
uvAttributewallMd5.setXY(1, 0, 1);
uvAttributewallMd5.setXY(2, 0.2, 0);
uvAttributewallMd5.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd5.setXY(4, 0.2, 1);
uvAttributewallMd5.setXY(5, 0, 1);
uvAttributewallMd5.setXY(6, 0.2, 0);
uvAttributewallMd5.setXY(7, 0, 0);
//Cima
uvAttributewallMd5.setXY(8, 0.4, 1);
uvAttributewallMd5.setXY(9, 0, 1);
uvAttributewallMd5.setXY(10, 0.4, 0);
uvAttributewallMd5.setXY(11, 0, 0);
//Baixo
uvAttributewallMd5.setXY(12, 0.4, 1);
uvAttributewallMd5.setXY(13, 0, 1);
uvAttributewallMd5.setXY(14, 0.4, 0);
uvAttributewallMd5.setXY(15, 0, 0);
//Frente
uvAttributewallMd5.setXY(16, 0.4, 1);
uvAttributewallMd5.setXY(17, 0, 1);
uvAttributewallMd5.setXY(18, 0.4, 0);
uvAttributewallMd5.setXY(19, 0, 0);
//Trás
uvAttributewallMd5.setXY(20, 0.4, 1);
uvAttributewallMd5.setXY(21, 0, 1);
uvAttributewallMd5.setXY(22, 0.4, 0);
uvAttributewallMd5.setXY(23, 0, 0);

wallgeometryMd5.uvsNeedUpdate = true;

var uvAttributeplatformMd = platformgeometryMd.getAttribute('uv');

//Direita
uvAttributeplatformMd.setXY(0, 0.2, 0.5);
uvAttributeplatformMd.setXY(1, 0, 0.5);
uvAttributeplatformMd.setXY(2, 0.2, 0);
uvAttributeplatformMd.setXY(3, 0, 0);
//Esquerda
uvAttributeplatformMd.setXY(4, 0.2, 0.5);
uvAttributeplatformMd.setXY(5, 0, 0.5);
uvAttributeplatformMd.setXY(6, 0.2, 0);
uvAttributeplatformMd.setXY(7, 0, 0);
//Cima
uvAttributeplatformMd.setXY(8, 0.4, 0.5);
uvAttributeplatformMd.setXY(9, 0, 0.5);
uvAttributeplatformMd.setXY(10, 0.4, 0);
uvAttributeplatformMd.setXY(11, 0, 0);
//Baixo
uvAttributeplatformMd.setXY(12, 0.4, 0.5);
uvAttributeplatformMd.setXY(13, 0, 0.5);
uvAttributeplatformMd.setXY(14, 0.4, 0);
uvAttributeplatformMd.setXY(15, 0, 0);
//Frente
uvAttributeplatformMd.setXY(16, 0.4, 1);
uvAttributeplatformMd.setXY(17, 0, 1);
uvAttributeplatformMd.setXY(18, 0.4, 0);
uvAttributeplatformMd.setXY(19, 0, 0);
//Trás
uvAttributeplatformMd.setXY(20, 0.4, 1);
uvAttributeplatformMd.setXY(21, 0, 1);
uvAttributeplatformMd.setXY(22, 0.4, 0);
uvAttributeplatformMd.setXY(23, 0, 0);

platformgeometryMd.uvsNeedUpdate = true;

var uvAttributewallMd6 = wallgeometryMd6.getAttribute('uv');

//Direita
uvAttributewallMd6.setXY(0, 0.2, 1);
uvAttributewallMd6.setXY(1, 0, 1);
uvAttributewallMd6.setXY(2, 0.2, 0);
uvAttributewallMd6.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd6.setXY(4, 0.2, 1);
uvAttributewallMd6.setXY(5, 0, 1);
uvAttributewallMd6.setXY(6, 0.2, 0);
uvAttributewallMd6.setXY(7, 0, 0);
//Cima
uvAttributewallMd6.setXY(8, 0.4, 1);
uvAttributewallMd6.setXY(9, 0, 1);
uvAttributewallMd6.setXY(10, 0.4, 0);
uvAttributewallMd6.setXY(11, 0, 0);
//Baixo
uvAttributewallMd6.setXY(12, 0.4, 1);
uvAttributewallMd6.setXY(13, 0, 1);
uvAttributewallMd6.setXY(14, 0.4, 0);
uvAttributewallMd6.setXY(15, 0, 0);
//Frente
uvAttributewallMd6.setXY(16, 0.4, 1);
uvAttributewallMd6.setXY(17, 0, 1);
uvAttributewallMd6.setXY(18, 0.4, 0);
uvAttributewallMd6.setXY(19, 0, 0);
//Trás
uvAttributewallMd6.setXY(20, 0.4, 1);
uvAttributewallMd6.setXY(21, 0, 1);
uvAttributewallMd6.setXY(22, 0.4, 0);
uvAttributewallMd6.setXY(23, 0, 0);

wallgeometryMd6.uvsNeedUpdate = true;

var uvAttributewallMd7 = wallgeometryMd7.getAttribute('uv');

//Direita
uvAttributewallMd7.setXY(0, 0.2, 1);
uvAttributewallMd7.setXY(1, 0, 1);
uvAttributewallMd7.setXY(2, 0.2, 0);
uvAttributewallMd7.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd7.setXY(4, 0.2, 1);
uvAttributewallMd7.setXY(5, 0, 1);
uvAttributewallMd7.setXY(6, 0.2, 0);
uvAttributewallMd7.setXY(7, 0, 0);
//Cima
uvAttributewallMd7.setXY(8, 0.3, 1);
uvAttributewallMd7.setXY(9, 0, 1);
uvAttributewallMd7.setXY(10, 0.3, 0);
uvAttributewallMd7.setXY(11, 0, 0);
//Baixo
uvAttributewallMd7.setXY(12, 0.3, 1);
uvAttributewallMd7.setXY(13, 0, 1);
uvAttributewallMd7.setXY(14, 0.3, 0);
uvAttributewallMd7.setXY(15, 0, 0);
//Frente
uvAttributewallMd7.setXY(16, 0.3, 1);
uvAttributewallMd7.setXY(17, 0, 1);
uvAttributewallMd7.setXY(18, 0.3, 0);
uvAttributewallMd7.setXY(19, 0, 0);
//Trás
uvAttributewallMd7.setXY(20, 0.3, 1);
uvAttributewallMd7.setXY(21, 0, 1);
uvAttributewallMd7.setXY(22, 0.3, 0);
uvAttributewallMd7.setXY(23, 0, 0);

wallgeometryMd7.uvsNeedUpdate = true;

var uvAttributewallMd8 = wallgeometryMd8.getAttribute('uv');

//Direita
uvAttributewallMd8.setXY(0, 0.2, 1);
uvAttributewallMd8.setXY(1, 0, 1);
uvAttributewallMd8.setXY(2, 0.2, 0);
uvAttributewallMd8.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd8.setXY(4, 0.2, 1);
uvAttributewallMd8.setXY(5, 0, 1);
uvAttributewallMd8.setXY(6, 0.2, 0);
uvAttributewallMd8.setXY(7, 0, 0);
//Cima
uvAttributewallMd8.setXY(8, 0.2, 1);
uvAttributewallMd8.setXY(9, 0, 1);
uvAttributewallMd8.setXY(10, 0.2, 0);
uvAttributewallMd8.setXY(11, 0, 0);
//Baixo
uvAttributewallMd8.setXY(12, 0.2, 1);
uvAttributewallMd8.setXY(13, 0, 1);
uvAttributewallMd8.setXY(14, 0.2, 0);
uvAttributewallMd8.setXY(15, 0, 0);
//Frente
uvAttributewallMd8.setXY(16, 0.2, 1);
uvAttributewallMd8.setXY(17, 0, 1);
uvAttributewallMd8.setXY(18, 0.2, 0);
uvAttributewallMd8.setXY(19, 0, 0);
//Trás
uvAttributewallMd8.setXY(20, 0.2, 1);
uvAttributewallMd8.setXY(21, 0, 1);
uvAttributewallMd8.setXY(22, 0.2, 0);
uvAttributewallMd8.setXY(23, 0, 0);

wallgeometryMd8.uvsNeedUpdate = true;

var uvAttributewallMd9 = wallgeometryMd9.getAttribute('uv');

//Direita
uvAttributewallMd9.setXY(0, 0.2, 1);
uvAttributewallMd9.setXY(1, 0, 1);
uvAttributewallMd9.setXY(2, 0.2, 0);
uvAttributewallMd9.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd9.setXY(4, 0.2, 1);
uvAttributewallMd9.setXY(5, 0, 1);
uvAttributewallMd9.setXY(6, 0.2, 0);
uvAttributewallMd9.setXY(7, 0, 0);
//Cima
uvAttributewallMd9.setXY(8, 0.3, 1);
uvAttributewallMd9.setXY(9, 0, 1);
uvAttributewallMd9.setXY(10, 0.3, 0);
uvAttributewallMd9.setXY(11, 0, 0);
//Baixo
uvAttributewallMd9.setXY(12, 0.3, 1);
uvAttributewallMd9.setXY(13, 0, 1);
uvAttributewallMd9.setXY(14, 0.3, 0);
uvAttributewallMd9.setXY(15, 0, 0);
//Frente
uvAttributewallMd9.setXY(16, 0.3, 1);
uvAttributewallMd9.setXY(17, 0, 1);
uvAttributewallMd9.setXY(18, 0.3, 0);
uvAttributewallMd9.setXY(19, 0, 0);
//Trás
uvAttributewallMd9.setXY(20, 0.3, 1);
uvAttributewallMd9.setXY(21, 0, 1);
uvAttributewallMd9.setXY(22, 0.3, 0);
uvAttributewallMd9.setXY(23, 0, 0);

wallgeometryMd9.uvsNeedUpdate = true;

var uvAttributewallMd10 = wallgeometryMd10.getAttribute('uv');

//Direita
uvAttributewallMd10.setXY(0, 0.2, 1);
uvAttributewallMd10.setXY(1, 0, 1);
uvAttributewallMd10.setXY(2, 0.2, 0);
uvAttributewallMd10.setXY(3, 0, 0);
//Esquerda
uvAttributewallMd10.setXY(4, 0.2, 1);
uvAttributewallMd10.setXY(5, 0, 1);
uvAttributewallMd10.setXY(6, 0.2, 0);
uvAttributewallMd10.setXY(7, 0, 0);
//Cima
uvAttributewallMd10.setXY(8, 0.3, 1);
uvAttributewallMd10.setXY(9, 0, 1);
uvAttributewallMd10.setXY(10, 0.3, 0);
uvAttributewallMd10.setXY(11, 0, 0);
//Baixo
uvAttributewallMd10.setXY(12, 0.3, 1);
uvAttributewallMd10.setXY(13, 0, 1);
uvAttributewallMd10.setXY(14, 0.3, 0);
uvAttributewallMd10.setXY(15, 0, 0);
//Frente
uvAttributewallMd10.setXY(16, 0.3, 1);
uvAttributewallMd10.setXY(17, 0, 1);
uvAttributewallMd10.setXY(18, 0.3, 0);
uvAttributewallMd10.setXY(19, 0, 0);
//Trás
uvAttributewallMd10.setXY(20, 0.3, 1);
uvAttributewallMd10.setXY(21, 0, 1);
uvAttributewallMd10.setXY(22, 0.3, 0);
uvAttributewallMd10.setXY(23, 0, 0);

wallgeometryMd10.uvsNeedUpdate = true;

var uvAttributeplatformMd2 = platformgeometryMd2.getAttribute('uv');

//Direita
uvAttributeplatformMd2.setXY(0, 0.2, 1);
uvAttributeplatformMd2.setXY(1, 0, 1);
uvAttributeplatformMd2.setXY(2, 0.2, 0);
uvAttributeplatformMd2.setXY(3, 0, 0);
//Esquerda
uvAttributeplatformMd2.setXY(4, 0.2, 1);
uvAttributeplatformMd2.setXY(5, 0, 1);
uvAttributeplatformMd2.setXY(6, 0.2, 0);
uvAttributeplatformMd2.setXY(7, 0, 0);
//Cima
uvAttributeplatformMd2.setXY(8, 0.1, 1);
uvAttributeplatformMd2.setXY(9, 0, 1);
uvAttributeplatformMd2.setXY(10, 0.1, 0);
uvAttributeplatformMd2.setXY(11, 0, 0);
//Baixo
uvAttributeplatformMd2.setXY(12, 0.1, 1);
uvAttributeplatformMd2.setXY(13, 0, 1);
uvAttributeplatformMd2.setXY(14, 0.1, 0);
uvAttributeplatformMd2.setXY(15, 0, 0);
//Frente
uvAttributeplatformMd2.setXY(16, 0.1, 1);
uvAttributeplatformMd2.setXY(17, 0, 1);
uvAttributeplatformMd2.setXY(18, 0.1, 0);
uvAttributeplatformMd2.setXY(19, 0, 0);
//Trás
uvAttributeplatformMd2.setXY(20, 0.1, 1);
uvAttributeplatformMd2.setXY(21, 0, 1);
uvAttributeplatformMd2.setXY(22, 0.1, 0);
uvAttributeplatformMd2.setXY(23, 0, 0);

platformgeometryMd2.uvsNeedUpdate = true;

var uvAttributecubeMd = cubeobsgeometryMd.getAttribute('uv');

//Direita
uvAttributecubeMd.setXY(0, 0.2, 1);
uvAttributecubeMd.setXY(1, 0, 1);
uvAttributecubeMd.setXY(2, 0.2, 0);
uvAttributecubeMd.setXY(3, 0, 0);
//Esquerda
uvAttributecubeMd.setXY(4, 0.2, 1);
uvAttributecubeMd.setXY(5, 0, 1);
uvAttributecubeMd.setXY(6, 0.2, 0);
uvAttributecubeMd.setXY(7, 0, 0);
//Cima
uvAttributecubeMd.setXY(8, 0.2, 1);
uvAttributecubeMd.setXY(9, 0, 1);
uvAttributecubeMd.setXY(10, 0.2, 0);
uvAttributecubeMd.setXY(11, 0, 0);
//Baixo
uvAttributecubeMd.setXY(12, 0.2, 1);
uvAttributecubeMd.setXY(13, 0, 1);
uvAttributecubeMd.setXY(14, 0.2, 0);
uvAttributecubeMd.setXY(15, 0, 0);
//Frente
uvAttributecubeMd.setXY(16, 0.2, 1);
uvAttributecubeMd.setXY(17, 0, 1);
uvAttributecubeMd.setXY(18, 0.2, 0);
uvAttributecubeMd.setXY(19, 0, 0);
//Trás
uvAttributecubeMd.setXY(20, 0.2, 1);
uvAttributecubeMd.setXY(21, 0, 1);
uvAttributecubeMd.setXY(22, 0.2, 0);
uvAttributecubeMd.setXY(23, 0, 0);

cubeobsgeometryMd.uvsNeedUpdate = true;

var meshgroundMd = new THREE.Mesh(groundgeometryMd, materialtexturaFloorMd);
meshgroundMd.position.z = 0;
meshgroundMd.position.y = 0;
meshgroundMd.position.x = 0;

var meshgroundMd2 = new THREE.Mesh(groundgeometryMd2, materialtexturaFloorMd);
meshgroundMd2.position.z = 16;
meshgroundMd2.position.y = 0;
meshgroundMd2.position.x = 0.18;

var meshgroundMd3 = new THREE.Mesh(groundgeometryMd, materialtexturaFloorMd);
meshgroundMd3.position.z = 32;
meshgroundMd3.position.y = 0;
meshgroundMd3.position.x = 0;

var meshgroundMd4 = new THREE.Mesh(groundgeometryMd, materialtexturaFloorMd);
meshgroundMd4.position.z = 52;
meshgroundMd4.position.y = 0;
meshgroundMd4.position.x = 0;

var meshgroundMd5 = new THREE.Mesh(groundgeometryMd2, materialtexturaFloorMd);
meshgroundMd5.position.z = 52;
meshgroundMd5.position.y = 0;
meshgroundMd5.position.x = -16;
meshgroundMd5.rotateY(Math.PI / 2);

var meshgroundMd6 = new THREE.Mesh(groundgeometryMd2, materialtexturaFloorMd);
meshgroundMd6.position.z = 42;
meshgroundMd6.position.y = 0;
meshgroundMd6.position.x = -18;

var meshgroundMd7 = new THREE.Mesh(groundgeometryMd2, materialtexturaFloorMd);
meshgroundMd7.position.z = 32;
meshgroundMd7.position.y = 0;
meshgroundMd7.position.x = -20;
meshgroundMd7.rotateY(Math.PI / 2);

var meshgroundMd8 = new THREE.Mesh(groundgeometryMd, materialtexturaFloorMd);
meshgroundMd8.position.z = 26;
meshgroundMd8.position.y = 0;
meshgroundMd8.position.x = -36;

var meshwallMd = new THREE.Mesh(wallgeometryMd1, materialtexturawall);
meshwallMd.position.z = -9;
meshwallMd.position.y = 1.125;
meshwallMd.position.x = 0;

var meshwallMd2 = new THREE.Mesh(wallgeometryMd2, materialtexturawall);
meshwallMd2.position.z = 1;
meshwallMd2.position.y = 1.125;
meshwallMd2.position.x = -9;
meshwallMd2.rotateY(Math.PI / 2);

var meshwallMd3 = new THREE.Mesh(wallgeometryMd3, materialtexturawall);
meshwallMd3.position.z = 9;
meshwallMd3.position.y = 1.125;
meshwallMd3.position.x = -5.9;

var meshwallMd4 = new THREE.Mesh(wallgeometryMd4, materialtexturawall);
meshwallMd4.position.z = 9;
meshwallMd4.position.y = 1.125;
meshwallMd4.position.x = 7.087;

var meshwallMd5 = new THREE.Mesh(wallgeometryMd5, materialtexturawall);
meshwallMd5.position.z = 3;
meshwallMd5.position.y = 1.125;
meshwallMd5.position.x = 9;
meshwallMd5.rotateY(Math.PI / 2);

var meshwallplatformMd = new THREE.Mesh(platformgeometryMd, materialtexturawall);
meshwallplatformMd.position.z = -2;
meshwallplatformMd.position.y = 1.125;
meshwallplatformMd.position.x = -4;

var spike1Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike1Md.position.z = -1.5;
spike1Md.position.y = 0;
spike1Md.position.x = -3;
spike1Md.rotateX(-Math.PI / 2);

var spike2Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike2Md.position.z = -1.5;
spike2Md.position.y = 0;
spike2Md.position.x = -1;
spike2Md.rotateX(-Math.PI / 2);

var spike3Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike3Md.position.z = -1.5;
spike3Md.position.y = 0;
spike3Md.position.x = 1;
spike3Md.rotateX(-Math.PI / 2);

var spike4Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike4Md.position.z = -1.5;
spike4Md.position.y = 0;
spike4Md.position.x = 3;
spike4Md.rotateX(-Math.PI / 2);

var meshfragilecubeMd = new THREE.Mesh(fragilecube, materialcubofrágil);
meshfragilecubeMd.position.z = 4.5;
meshfragilecubeMd.position.y = 1.125;
meshfragilecubeMd.position.x = -3;

var spike5Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike5Md.position.z = 2;
spike5Md.position.y = 0;
spike5Md.position.x = 7;
spike5Md.rotateX(Math.PI / 2);

var meshwallMd6 = new THREE.Mesh(wallgeometryMd6, materialtexturawall);
meshwallMd6.position.z = -1;
meshwallMd6.position.y = 1.125;
meshwallMd6.position.x = -3;
meshwallMd6.rotateY(Math.PI / 2);

var meshwallMd7 = new THREE.Mesh(wallgeometryMd6, materialtexturawall);
meshwallMd7.position.z = -1;
meshwallMd7.position.y = 1.125;
meshwallMd7.position.x = 3;
meshwallMd7.rotateY(Math.PI / 2);

var meshcubeobs = new THREE.Mesh(cubeobsgeometryMd, materialtexturawall);
meshcubeobs.position.z = -5;
meshcubeobs.position.y = 1.125;
meshcubeobs.position.x = 0;

var meshwallMd8 = new THREE.Mesh(wallgeometryMd1, materialtexturawall);
meshwallMd8.position.z = 9;
meshwallMd8.position.y = 1.125;
meshwallMd8.position.x = 0;

var meshwallMd9 = new THREE.Mesh(wallgeometryMd1, materialtexturawall);
meshwallMd9.position.z = 0;
meshwallMd9.position.y = 1.125;
meshwallMd9.position.x = -9;
meshwallMd9.rotateY(Math.PI / 2);

var meshwallMd10 = new THREE.Mesh(wallgeometryMd7, materialtexturawall);
meshwallMd10.position.z = -7;
meshwallMd10.position.y = 1.125;
meshwallMd10.position.x = -9;
meshwallMd10.rotateY(Math.PI / 2);

var meshwallMd11 = new THREE.Mesh(wallgeometryMd8, materialtexturawall);
meshwallMd11.position.z = 6;
meshwallMd11.position.y = 1.125;
meshwallMd11.position.x = -9;
meshwallMd11.rotateY(Math.PI / 2);

var meshwallMd12 = new THREE.Mesh(wallgeometryMd1, materialtexturawall);
meshwallMd12.position.z = 0;
meshwallMd12.position.y = 1.125;
meshwallMd12.position.x = 9;
meshwallMd12.rotateY(Math.PI / 2);

var meshwallMd13 = new THREE.Mesh(wallgeometryMd2, materialtexturawall);
meshwallMd13.position.z = -1;
meshwallMd13.position.y = 1.125;
meshwallMd13.position.x = 9;
meshwallMd13.rotateY(Math.PI / 2);

var meshwallMd14 = new THREE.Mesh(wallgeometryMd9, materialtexturawall);
meshwallMd14.position.z = -9;
meshwallMd14.position.y = 1.125;
meshwallMd14.position.x = -4.91;

var meshwallMd15 = new THREE.Mesh(wallgeometryMd10, materialtexturawall);
meshwallMd15.position.z = -9;
meshwallMd15.position.y = 1.125;
meshwallMd15.position.x = 5.09;

var meshwallMd16 = new THREE.Mesh(wallgeometryMd7, materialtexturawall);
meshwallMd16.position.z = 5;
meshwallMd16.position.y = 1.125;
meshwallMd16.position.x = 3;
meshwallMd16.rotateY(Math.PI / 2);

var meshwallMd17 = new THREE.Mesh(wallgeometryMd6, materialtexturawall);
meshwallMd17.position.z = 1;
meshwallMd17.position.y = 1.125;
meshwallMd17.position.x = -3;
meshwallMd17.rotateY(Math.PI / 2);

var meshgateMd = new THREE.Mesh(gategeometryMd, materialtexturagate);
meshgateMd.position.z = 0;
meshgateMd.position.y = 1.125;
meshgateMd.position.x = -8.5;
meshgateMd.rotateY(Math.PI / 2);

var spike6Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike6Md.position.z = 2;
spike6Md.position.y = 0;
spike6Md.position.x = 7;
spike6Md.rotateX(Math.PI / 2);

var spike7Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike7Md.position.z = 2;
spike7Md.position.y = 0;
spike7Md.position.x = 5;
spike7Md.rotateX(Math.PI / 2);

var spike8Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike8Md.position.z = 2;
spike8Md.position.y = 0;
spike8Md.position.x = 3;
spike8Md.rotateX(Math.PI / 2);

var spike9Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike9Md.position.z = 2;
spike9Md.position.y = 0;
spike9Md.position.x = 1;
spike9Md.rotateX(Math.PI / 2);

var spike10Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike10Md.position.z = 2;
spike10Md.position.y = 0;
spike10Md.position.x = -1;
spike10Md.rotateX(Math.PI / 2);

var meshobsMd = new THREE.Mesh(wallgeometryMd8, materialtexturawall);
meshobsMd.position.z = 2;
meshobsMd.position.y = 1.125;
meshobsMd.position.x = 5.4;
meshobsMd.scale.set(1.3, 1, 1);

var meshwallplatformMd2 = new THREE.Mesh(platformgeometryMd2, materialtexturawall);
meshwallplatformMd2.position.z = -2;
meshwallplatformMd2.position.y = 1.125;
meshwallplatformMd2.position.x = 0;
meshwallplatformMd2.scale.set(1, 1, 1);

var meshwallplatformMd3 = new THREE.Mesh(platformgeometryMd, materialtexturawall);
meshwallplatformMd3.position.z = 0;
meshwallplatformMd3.position.y = 1.125;
meshwallplatformMd3.position.x = -4;

var meshobsMd2 = new THREE.Mesh(wallgeometryMd8, materialtexturawall)
meshobsMd2.position.z = 4;
meshobsMd2.position.y = 1.125;
meshobsMd2.position.x = 6;
meshobsMd2.scale.set(1.3, 1, 1);

var meshfragilecubeMd3 = new THREE.Mesh(fragilecube, materialcubofrágil);
meshfragilecubeMd3.position.z = 5;
meshfragilecubeMd3.position.y = 1.125;
meshfragilecubeMd3.position.x = -7;

var meshbutton = new THREE.Mesh(fragilecube, materialtexturagate);
meshbutton.position.z = 4;
meshbutton.position.y = 1.125;
meshbutton.position.x = 2.4;

var spike11Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike11Md.position.z = -2;
spike11Md.position.y = 0;
spike11Md.position.x = 1;
spike11Md.rotateX(-Math.PI / 2);

var spike12Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike12Md.position.z = -2;
spike12Md.position.y = 0;
spike12Md.position.x = 0;
spike12Md.rotateX(-Math.PI / 2);

var spike14Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike14Md.position.z = -2;
spike14Md.position.y = 0;
spike14Md.position.x = -2;
spike14Md.rotateX(-Math.PI / 2);

var spike13Md = new THREE.Mesh(spikegeometry, spikemeshmaterial);
spike13Md.position.z = -2;
spike13Md.position.y = 0;
spike13Md.position.x = -4;
spike13Md.rotateX(-Math.PI / 2);

var meshwallMd18 = new THREE.Mesh(wallgeometryMd2, materialtexturawall);
meshwallMd18.position.z = 3;
meshwallMd18.position.y = 1.125;
meshwallMd18.position.x = -3;
meshwallMd18.rotateY(Math.PI / 2);

var meshwallMd19 = new THREE.Mesh(wallgeometryMd6, materialtexturawall);
meshwallMd19.position.z = 1;
meshwallMd19.position.y = 1.125;
meshwallMd19.position.x = 3;
meshwallMd19.rotateY(Math.PI / 2);

var meshwallMd20 = new THREE.Mesh(wallgeometryMd7, materialtexturawall);
meshwallMd20.position.z = 5;
meshwallMd20.position.y = 1.125;
meshwallMd20.position.x = 0;
meshwallMd20.scale.set(1 + (1 / 3), 1, 1);

var meshwallMd21 = new THREE.Mesh(wallgeometryMd5, materialtexturawall);
meshwallMd21.position.z = -1;
meshwallMd21.position.y = 1.125;
meshwallMd21.position.x = 3;
meshwallMd21.rotateY(Math.PI / 2);

var meshwallMd22 = new THREE.Mesh(wallgeometryMd8, materialtexturawall);
meshwallMd22.position.z = -3;
meshwallMd22.position.y = 1.125;
meshwallMd22.position.x = -3;
meshwallMd22.rotateY(Math.PI / 2);
meshwallMd22.scale.set(1.5, 1, 1);

var meshwallMd23 = new THREE.Mesh(wallgeometryMd1, materialtexturawall);
meshwallMd23.position.z = 9;
meshwallMd23.position.y = 1.125;
meshwallMd23.position.x = 0;

var meshwallMd24 = new THREE.Mesh(wallgeometryMd6, materialtexturawall);
meshwallMd24.position.z = -3;
meshwallMd24.position.y = 1.125;
meshwallMd24.position.x = 9;
meshwallMd24.rotateY(Math.PI / 2);

var meshobsMd3 = new THREE.Mesh(wallgeometryMd5, materialtexturawall);
meshobsMd3.position.z = 3;
meshobsMd3.position.y = 1.125;
meshobsMd3.position.x = 3;
meshobsMd3.rotateY(Math.PI / 2);

var meshwallplatformMd4 = new THREE.Mesh(platformgeometryMd2, materialtexturawall);
meshwallplatformMd4.position.z = 6;
meshwallplatformMd4.position.y = 1.125;
meshwallplatformMd4.position.x = -9.5;

var meshwallplatformMd5 = new THREE.Mesh(platformgeometryMd, materialtexturawall);
meshwallplatformMd5.position.z = -9.5;
meshwallplatformMd5.position.y = 1.125;
meshwallplatformMd5.position.x = -2;
meshwallplatformMd5.scale.set(1 / 2, 1, 1);

var meshgoalMd = new THREE.Mesh(goalgeometry, materialtexturaGoal2);
meshgoalMd.position.z = 7.5;
meshgoalMd.position.y = 0.6125;
meshgoalMd.position.x = -8.5;

var materialsMedNiv = [groundgeometryMd, groundgeometryMd2, wallgeometryMd1, wallgeometryMd2, wallgeometryMd3, wallgeometryMd4, wallgeometryMd5, wallgeometryMd6, wallgeometryMd7,
    wallgeometryMd8, wallgeometryMd9, wallgeometryMd10, platformgeometryMd, platformgeometryMd2, spikegeometry, fragilecube, cubeobsgeometryMd, gategeometryMd,
    goalgeometry
]

var parent_medium = new THREE.Object3D();
parent_medium.add(meshgroundMd);
parent_medium.add(meshgroundMd2);
parent_medium.add(meshgroundMd3);
parent_medium.add(meshgroundMd4);
parent_medium.add(meshgroundMd5);
parent_medium.add(meshgroundMd6);
parent_medium.add(meshgroundMd7);
parent_medium.add(meshgroundMd8);
parent_medium.add(meshwallMd2);
parent_medium.add(meshwallMd);
parent_medium.add(meshwallMd3);
parent_medium.add(meshwallMd4);
parent_medium.add(meshwallMd5);
parent_medium.add(meshwallplatformMd);
parent_medium.add(meshfragilecubeMd);
meshwallplatformMd.add(spike1Md);
meshwallplatformMd.add(spike2Md);
meshwallplatformMd.add(spike3Md);
meshwallplatformMd.add(spike4Md);
meshwallMd.add(spike5Md);
meshgroundMd2.add(meshwallMd6);
meshgroundMd2.add(meshwallMd7);
meshgroundMd3.add(meshcubeobs);
meshgroundMd4.add(meshwallMd8);
meshgroundMd3.add(meshwallMd9);
meshgroundMd4.add(meshwallMd10);
meshgroundMd4.add(meshwallMd11);
meshgroundMd3.add(meshwallMd12);
meshgroundMd4.add(meshwallMd13);
meshgroundMd3.add(meshwallMd14);
meshgroundMd3.add(meshwallMd15);
meshgroundMd5.add(meshwallMd16);
meshgroundMd5.add(meshwallMd17);
meshgroundMd4.add(meshgateMd);
meshwallMd9.add(spike6Md);
meshwallMd9.add(spike7Md);
meshwallMd9.add(spike8Md);
meshwallMd9.add(spike9Md);
meshwallMd9.add(spike10Md);
meshgroundMd3.add(meshobsMd);
meshgroundMd4.add(meshobsMd2);
meshgroundMd3.add(meshwallplatformMd2);
meshgroundMd4.add(meshwallplatformMd3);
meshgroundMd4.add(meshfragilecubeMd3);
meshgroundMd4.add(meshbutton);
meshwallMd13.add(spike11Md);
meshwallMd8.add(spike12Md);
meshwallMd8.add(spike13Md);
meshwallMd8.add(spike14Md);
meshgroundMd6.add(meshwallMd18);
meshgroundMd6.add(meshwallMd19);
meshgroundMd7.add(meshwallMd20);
meshgroundMd7.add(meshwallMd21);
meshgroundMd7.add(meshwallMd22);
meshgroundMd8.add(meshwallMd23);
meshgroundMd8.add(meshwallMd24);
meshgroundMd8.add(meshobsMd3);
meshgroundMd8.add(meshwallplatformMd4);
meshgroundMd8.add(meshwallplatformMd5);
meshgroundMd8.add(meshgoalMd);

//Fim do Mapa Medium

// Tilting and collision mechanism:
//
//
//
// -------------------------------------------------------------------------------
var isRolling = false; // Flag to track if the ball is rolling

var initialForce = new THREE.Vector3(); // Initial force applied to the meshsphere
var targetForce = new THREE.Vector3(); // Target force to reach gradually
var maxForce = 1.5; // Maximum force magnitude

var forceIncrement = 0.005; // Increment factor for force magnitude


// Inclinaison de la plateforme
document.addEventListener("keydown", onDocumentKeyDown, false);


function onDocumentKeyDown(event) {
    var rotationSpeed = 0.1; // Adjust the value as per your preference
    var keyCode = event.which;
    var quaternion = new THREE.Quaternion();
    var forceDirection = new THREE.Vector3();

    if (keyCode == 37) {
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 15 * Math.PI / 180);
        forceDirection.set(0, 0, 1);
        if (map === 1) {
            tiltParent(parent_tutorial, quaternion, forceDirection);
        } else if (map === 2) {
            tiltParent(parent_easy, quaternion, forceDirection);
        } else if (map == 3) {
            tiltParent(parent_medium, quaternion, forceDirection);
        }
    } else if (keyCode == 38) {
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 15 * Math.PI / 180);
        forceDirection.set(-1, 0, 0);
        if (map === 1) {
            tiltParent(parent_tutorial, quaternion, forceDirection);
        } else if (map === 2) {
            tiltParent(parent_easy, quaternion, forceDirection);
        } else if (map == 3) {
            tiltParent(parent_medium, quaternion, forceDirection);
        }
    } else if (keyCode == 39) {
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -15 * Math.PI / 180);
        forceDirection.set(0, 0, -1);
        if (map === 1) {
            tiltParent(parent_tutorial, quaternion, forceDirection);
        } else if (map === 2) {
            tiltParent(parent_easy, quaternion, forceDirection);
        } else if (map == 3) {
            tiltParent(parent_medium, quaternion, forceDirection);
        }
    } else if (keyCode == 40) {
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -15 * Math.PI / 180);
        forceDirection.set(1, 0, 0);
        if (map === 1) {
            tiltParent(parent_tutorial, quaternion, forceDirection);
        } else if (map === 2) {
            tiltParent(parent_easy, quaternion, forceDirection);
        } else if (map == 3) {
            tiltParent(parent_medium, quaternion, forceDirection);
        }
    } else {
        return;
    }

    if (isRolling) return;

    isRolling = true;
    initialForce.copy(forceDirection).normalize();
    targetForce.copy(initialForce).multiplyScalar(maxForce);

    var currentForce = initialForce.clone();
    var previousPosition = meshsphere.position.clone();

    var timeElapsed = 0;
    var backwardAnimationPlayed = false;

    function updatePosition() {
        if (!isRolling) return;

        var force = currentForce.clone().multiplyScalar(forceIncrement);
        var newPosition = meshsphere.position.clone().add(force);

        // Collision detection code
        var newBallBoundingBox = new THREE.Box3().setFromObject(meshsphere);

        var wallBoundingBoxesTut = [
            new THREE.Box3().setFromObject(meshwallRT),
            new THREE.Box3().setFromObject(meshwallLT),
            new THREE.Box3().setFromObject(meshwallFR),
            new THREE.Box3().setFromObject(meshwallBK),
            new THREE.Box3().setFromObject(obs1T),
            new THREE.Box3().setFromObject(obs2T),
            new THREE.Box3().setFromObject(meshgoal),
        ]


        var wallBoundingBoxesEas = [
            new THREE.Box3().setFromObject(meshBkwallEs),
            new THREE.Box3().setFromObject(meshRTwallEs),
            new THREE.Box3().setFromObject(meshFRwallEs),
            new THREE.Box3().setFromObject(meshLTwallEs),
            new THREE.Box3().setFromObject(meshobs1Es),
            new THREE.Box3().setFromObject(meshobs2Es),
            new THREE.Box3().setFromObject(meshobs3Es),
            new THREE.Box3().setFromObject(meshobs4Es),
            new THREE.Box3().setFromObject(meshPlatformEs),
            new THREE.Box3().setFromObject(meshgoalEs),
            new THREE.Box3().setFromObject(cubewallEs),
        ];

        var wallBoundingBoxesMed = [
            new THREE.Box3().setFromObject(meshwallMd2),
            new THREE.Box3().setFromObject(meshwallMd),
            new THREE.Box3().setFromObject(meshwallMd3),
            new THREE.Box3().setFromObject(meshwallMd4),
            new THREE.Box3().setFromObject(meshwallMd5),
            new THREE.Box3().setFromObject(meshwallplatformMd),
            new THREE.Box3().setFromObject(meshfragilecubeMd),
            new THREE.Box3().setFromObject(meshwallMd6),
            new THREE.Box3().setFromObject(meshwallMd7),
            new THREE.Box3().setFromObject(meshcubeobs),
            new THREE.Box3().setFromObject(meshwallMd8),
            new THREE.Box3().setFromObject(meshwallMd9),
            new THREE.Box3().setFromObject(meshwallMd10),
            new THREE.Box3().setFromObject(meshwallMd11),
            new THREE.Box3().setFromObject(meshwallMd12),
            new THREE.Box3().setFromObject(meshwallMd13),
            new THREE.Box3().setFromObject(meshwallMd14),
            new THREE.Box3().setFromObject(meshwallMd15),
            new THREE.Box3().setFromObject(meshwallMd16),
            new THREE.Box3().setFromObject(meshwallMd17),
            new THREE.Box3().setFromObject(meshwallMd18),
            new THREE.Box3().setFromObject(meshwallMd19),
            new THREE.Box3().setFromObject(meshwallMd20),
            new THREE.Box3().setFromObject(meshwallMd21),
            new THREE.Box3().setFromObject(meshwallMd22),
            new THREE.Box3().setFromObject(meshwallMd23),
            new THREE.Box3().setFromObject(meshwallMd24),
            new THREE.Box3().setFromObject(meshobsMd3),
            new THREE.Box3().setFromObject(meshwallplatformMd4),
            new THREE.Box3().setFromObject(meshwallplatformMd5),
            new THREE.Box3().setFromObject(meshwallMd24)
        ]

        var meshGoalObject1 = new THREE.Box3().setFromObject(meshgoal);
        var meshGoalObject2 = new THREE.Box3().setFromObject(meshgoalEs);
        var meshGoalObject3 = new THREE.Box3().setFromObject(meshgoalMd);

        var fallwall1 = new THREE.Box3().setFromObject(fallWallEs);

        var spikesObjects2 = [
            new THREE.Box3().setFromObject(spike1Es),
            new THREE.Box3().setFromObject(spike2Es),
            new THREE.Box3().setFromObject(spike3Es),
            new THREE.Box3().setFromObject(spike4Es),
            new THREE.Box3().setFromObject(spike5Es),
            new THREE.Box3().setFromObject(spike6Es),
            new THREE.Box3().setFromObject(spike7Es),
            new THREE.Box3().setFromObject(spike8Es),
            new THREE.Box3().setFromObject(spike9Es),
            new THREE.Box3().setFromObject(spike10Es),
            new THREE.Box3().setFromObject(spike11Es),
            new THREE.Box3().setFromObject(spike12Es),
            new THREE.Box3().setFromObject(spike13Es)
        ];

        var spikesObjects3 = [
            new THREE.Box3().setFromObject(spike1Md),
            new THREE.Box3().setFromObject(spike2Md),
            new THREE.Box3().setFromObject(spike3Md),
            new THREE.Box3().setFromObject(spike4Md),
            new THREE.Box3().setFromObject(spike5Md),
            new THREE.Box3().setFromObject(spike6Md),
            new THREE.Box3().setFromObject(spike7Md),
            new THREE.Box3().setFromObject(spike8Md),
            new THREE.Box3().setFromObject(spike9Md),
            new THREE.Box3().setFromObject(spike10Md),
            new THREE.Box3().setFromObject(spike11Md),
            new THREE.Box3().setFromObject(spike12Md),
            new THREE.Box3().setFromObject(spike13Md),
            new THREE.Box3().setFromObject(spike14Md)
        ]

        var collided = false;

        if (map == 1) {
            for (var i = 0; i < wallBoundingBoxesTut.length; i++) {

                if (newBallBoundingBox.intersectsBox(wallBoundingBoxesTut[i])) {
                    collided = true;

                    if (newBallBoundingBox.intersectsBox(meshGoalObject1)) {
                        window.localStorage.setItem('map', '2');
                        window.location.reload();
                    }
                }
            }
        }
        if (map == 2) {
            for (var i = 0; i < wallBoundingBoxesEas.length; i++) {
                if (newBallBoundingBox.intersectsBox(wallBoundingBoxesEas[i])) {
                    collided = true;

                    if (newBallBoundingBox.intersectsBox(meshGoalObject2)) {

                        window.localStorage.setItem('map', '3');
                        window.location.reload();
                    }
                }
            }

            for (var i = 0; i < spikesObjects2.length; i++) {
                if (newBallBoundingBox.intersectsBox(spikesObjects2[i])) {
                    meshsphere.position.set(11.5, 1, -20);
                }

            }
        } else {
            for (var i = 0; i < wallBoundingBoxesMed.length; i++) {
                if (newBallBoundingBox.intersectsBox(wallBoundingBoxesMed[i])) {
                    collided = true;

                    if (newBallBoundingBox.intersectsBox(meshGoalObject2)) {
                        //remove after 3s block
                  }
                }
            }



            for (var i = 0; i < spikesObjects3.length; i++) {
                if (newBallBoundingBox.intersectsBox(spikesObjects3[i])) {
                    meshsphere.position.set(6.5, 1, 6);
                }
            }
        }
        var isFalling = false;
        if (newBallBoundingBox.intersectsBox(fallwall1)) {
            // Make sure the ball stops moving in all directions
            currentForce.set(0, 0, 0);

            new TWEEN.Tween(meshsphere.position)
                .to({
                    y: meshsphere.position.y - 10
                }, 2000) // adjust as needed
                .easing(TWEEN.Easing.Quadratic.In)
                .onUpdate(function() {
                    // Empty onUpdate function to maintain position update
                })
                .onComplete(function() {
                    isFalling = false; // the ball has finished falling

                    // Show the game over menu after the animation is complete
                    var gameover = document.getElementById('tudo');
                    gameover.classList.remove('hide');
                })
                .start();

            isFalling = true; // the ball is now falling
        }

        if (isFalling) {
            currentForce.set(0, 0, 0);

        } else if (collided) {
            forceIncrement = 0.005; //resets the initial force;

            // Set a fixed bounce back force
            var baseBounceBackForce = new THREE.Vector3(25, 25, 25);

            var bounceBackForceMultiplier = 1 + timeElapsed * (optionsLights.forceSpeed.forceIncrementStep + 1) * 0.05;
            var bounceBackForce = baseBounceBackForce.clone().multiplyScalar(bounceBackForceMultiplier);

            bounceBackForce.multiply(currentForce.clone().negate().normalize());

            bounceBackForce.multiplyScalar(forceIncrement);

            var newPositionAfterCollision = meshsphere.position.clone().add(bounceBackForce);
            if (!backwardAnimationPlayed) {
                new TWEEN.Tween(meshsphere.position)
                    .to(newPositionAfterCollision, 500)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(function() {
                        isRolling = true;
                        backwardAnimationPlayed = true;
                        requestAnimationFrame(updatePosition);
                    });
            }

            isRolling = false;
            // request the next frame after the collision has been resolved
            requestAnimationFrame(updatePosition);
        } else {
            // Update force increment based on time elapsed
            forceIncrement += optionsLights.forceSpeed.forceIncrementStep;

            // Update currentForce magnitude towards the targetForce
            var forceDifference = targetForce.clone().sub(currentForce);
            var forceStep = forceDifference.clone().normalize().multiplyScalar(forceIncrement);
            currentForce.add(forceStep);

            // Update position
            meshsphere.position.copy(newPosition);
            previousPosition.copy(newPosition);

            // Rotate the texture sphere 
            if (keyCode === 37) {
                meshsphere.rotation.x += rotationSpeed;
            }
            if (keyCode === 38) {
                meshsphere.rotation.y += rotationSpeed;
            }
            if (keyCode === 39) {
                meshsphere.rotation.x -= rotationSpeed;
            }
            if (keyCode === 40) {
                meshsphere.rotation.y -= rotationSpeed;
            }

            timeElapsed += 1; // Increase the time elapsed

            requestAnimationFrame(updatePosition);
        }
    }

    updatePosition();
}

function tiltParent(object, endQuaternion, forceDirection) {
    var initialQuaternion = object.quaternion.clone();
    var currentQuaternion = object.quaternion.clone();

    new TWEEN.Tween(currentQuaternion)
        .to(endQuaternion, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
            object.quaternion.copy(currentQuaternion);
            var force = forceDirection.clone().applyQuaternion(object.quaternion);
            force.normalize();

        })
        .onComplete(function() {
            var startQuaternion = object.quaternion.clone();
            setTimeout(function() {
                new TWEEN.Tween(startQuaternion)
                    .to(initialQuaternion, 2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function() {
                        object.quaternion.copy(startQuaternion);
                    })
                    .start();
            }, 1000);
        })
        .start();
}

// -------------------------------------------------------------------------------

const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

var zoomTween = null;
let isDragging = false;
let startPosition = new THREE.Vector2();

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
document.addEventListener('wheel', onDocumentMouseWheel, false); // zoom event 

function onDocumentMouseDown(event) {
    isDragging = true;
    startPosition.set(event.clientX, event.clientY);
}

function onDocumentMouseMove(event) {
    if (isDragging) {
        const endPosition = new THREE.Vector2(event.clientX, event.clientY);
        const delta = endPosition.clone().sub(startPosition);

        // calculate the angle to rotate around the sphere based on the drag distance
        const angleX = -delta.x * 0.001;
        const angleY = delta.y * 0.001;

        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleX);
        cameraOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), angleY);

        const cameraPosition = new THREE.Vector3()
            .copy(cameraOffset)
            .add(meshsphere.position);

        // sets the position of the camera
        controls.getObject().position.copy(cameraPosition);
        controls.getObject().lookAt(meshsphere.position);

        startPosition.copy(endPosition);
    }
}

function onDocumentMouseUp(event) {
    isDragging = false;
}

function onDocumentMouseWheel(event) {
    const zoomDirection = Math.sign(event.deltaY);
    const zoomAmount = 2;

    const cameraDirection = new THREE.Vector3();
    controls.getObject().getWorldDirection(cameraDirection);

    cameraOffset.addScaledVector(cameraDirection, zoomDirection * zoomAmount);

    cameraOffset.y = Math.max(cameraOffset.y, 0);

    const cameraPosition = new THREE.Vector3()
        .copy(cameraOffset)
        .add(meshsphere.position);

    controls.getObject().position.copy(cameraPosition);
    controls.getObject().lookAt(meshsphere.position);
}

var texturedir = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Right.bmp');
var textureesq = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Left.bmp');
var texturecm = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Top.bmp');
var texturebx = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Bottom.bmp');
var texturefr = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Front.bmp');
var textureat = new THREE.TextureLoader().load('./Skybox/skybox_2/Daylight Box_Back.bmp');

var materialArray = [];

materialArray.push(new THREE.MeshBasicMaterial({
    map: texturedir
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: textureesq
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texturecm
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texturebx
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texturefr
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: textureat
}));

for (var i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;


var SkyboxGeo = new THREE.BoxGeometry(200, 200, 200);
var Skybox = new THREE.Mesh(SkyboxGeo, materialArray);
cena.add(Skybox);

var guiControls = {
    currentCamera: camaraPerspetiva,
    changeCamera: function() {
        renderer.render(cena, guiControls.currentCamera); // use currentCamera here
    }
};

// Default light configuration
// ---------------------------
var optionsLights = {
    spotlight: {
        X_position: 20,
        Y_position: 10,
        Z_position: -3
    },
    directional: {
        intensity: 0.75,
        position: {
            X_position: 0,
            Y_position: 1,
            Z_position: 0
        }
    },
    ambiente: {
        intensity: 0.5
    },
    choosenLight: {
        ambient: false,
        spotlight: false,
        directional: true
    },
    forceSpeed: {
        forceIncrementStep: 0.0005
    }
}

// Creation of 3 diferent lights:
//    Ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.castShadow = true;

//    Spot light
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(optionsLights.spotlight.X_position, optionsLights.spotlight.Y_position, optionsLights.spotlight.Z_position);
spotLight.lookAt(meshsphere);

//    Directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, optionsLights.directional.intensity);
directionalLight.castShadow = true;
directionalLight.position.set(optionsLights.directional.position.X_position, optionsLights.directional.position.Y_position, optionsLights.directional.position.Z_position);



var gui = new GUI({
    width: 400
});

var lightFolder = gui.addFolder('Luzes');
lightFolder.add(optionsLights.choosenLight, 'spotlight').name('Spotlight').onChange(function(value) {
    optionsLights.choosenLight.spotlight = value;
});

lightFolder.add(optionsLights.choosenLight, 'ambient').name('Ambiente').onChange(function(value) {
    optionsLights.choosenLight.ambient = value;
});

lightFolder.add(optionsLights.choosenLight, 'directional').name('Direcional').onChange(function(value) {
    optionsLights.choosenLight.directional = value;
});
lightFolder.open();

var spotlightFolder = gui.addFolder('Spotlight');
spotlightFolder.add(optionsLights.spotlight, 'X_position', -50, 50).name('x').onChange(function(value) {
    spotLight.position.x = value;
});

spotlightFolder.add(optionsLights.spotlight, 'Y_position', -10, 10).name('y').onChange(function(value) {
    spotLight.position.y = value;
});

spotlightFolder.add(optionsLights.spotlight, 'Z_position', -50, 50).name('z').onChange(function(value) {
    spotLight.position.z = value;
});

var directionalFolder = gui.addFolder('Ambiente');
directionalFolder.add(optionsLights.directional, 'intensity', 0, 1).name('Intensidade').onChange(function(value) {
    ambientLight.intensity = value;
});

var directionalFolder = gui.addFolder('Direcional');
directionalFolder.add(optionsLights.directional, 'intensity', 0, 1).name('Intensidade').onChange(function(value) {
    directionalLight.intensity = value;
});

directionalFolder.add(optionsLights.directional.position, 'X_position', -30, 30).name('x').onChange(function(value) {
    directionalLight.position.x = value;
});

directionalFolder.add(optionsLights.directional.position, 'Y_position', -1, 1).name('y').onChange(function(value) {
    directionalLight.position.y = value;
});

directionalFolder.add(optionsLights.directional.position, 'Z_position', -10, 10).name('z').onChange(function(value) {
    directionalLight.position.z = value;
});

var simulationFolder = gui.addFolder('Simulation');
simulationFolder.add(optionsLights.forceSpeed, 'forceIncrementStep', 0, 0.02).name('Incremento velocidade').onChange(function(value) {
    optionsLights.forceSpeed.forceIncrementStep = value;
});


gui.add(guiControls, 'changeCamera').name('Mudar Camera').onChange(function() {
    if (guiControls.currentCamera === camaraPerspetiva) {
        guiControls.currentCamera = camaraOrtografica;
    } else {
        guiControls.currentCamera = camaraPerspetiva;
    }
});


function Start() {
    renderer.render(cena, guiControls.currentCamera);

    const cameraPosition = new THREE.Vector3()
        .copy(cameraOffset);

    // sets the position of the camera
    controls.getObject().position.copy(cameraPosition);
    controls.getObject().lookAt(meshsphere.position);

    if (map === 1) {
        MapaTutorial();
    }
    if (map === 2) {
        MapaEasy();
    }
    if (map === 3) {
        MapaMedium();
    }

    // Default
    // Ambient light
    ambientLight.visible = optionsLights.choosenLight.ambient;
    cena.add(ambientLight);

    // Spotlight
    spotLight.visible = optionsLights.choosenLight.spotlight;
    cena.add(spotLight);

    // Directional light
    directionalLight.visible = optionsLights.choosenLight.directional;
    cena.add(directionalLight);

    requestAnimationFrame(loop);
}

function loop() {
    renderer.render(cena, guiControls.currentCamera);
    ambientLight.visible = optionsLights.choosenLight.ambient;
    spotLight.visible = optionsLights.choosenLight.spotlight;
    directionalLight.visible = optionsLights.choosenLight.directional;
    TWEEN.update();
    requestAnimationFrame(loop);
}


function MapaTutorial() {
    meshsphere.position.set(3, -2.4, -10);
    meshsphere.geometry = new THREE.SphereGeometry(0.5);
    cena.add(parent_tutorial);

    let startX = meshgoal.position.x;
    let endX = -1;

    let startZ = meshgoal.position.z;
    let endZ = 3;

    let positionObject = {
        x: startX,
        z: startZ
    };

    let tweenXZ = new TWEEN.Tween(positionObject)
        .to({
            x: endX,
            z: endZ
        }, 4000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(function() {
            meshgoal.position.x = positionObject.x;
            meshgoal.position.z = positionObject.z;
        })
        .onComplete(function() {

            new TWEEN.Tween(positionObject)
                .to({
                    x: startX,
                    z: startZ
                }, 4000)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(function() {
                    meshgoal.position.x = positionObject.x;
                    meshgoal.position.z = positionObject.z;
                })
                .onComplete(function() {

                    tweenXZ.start();
                })
                .start();
        });


    tweenXZ.start();


}

function MapaEasy() {
    materialsTutNiv.forEach(function(material) {
        material.dispose();
    });
    materialsMedNiv.forEach(function(material) {
        material.dispose();
    });

    parent_tutorial.remove(meshsphere);
    parent_easy.add(meshsphere);
    meshsphere.position.set(11.5, 1, -20);
    cena.add(parent_easy);
    // animatePlatform(meshPlatformEs, 'positive', -23, -15, 0.1);
    // animação começo
    let startX = meshPlatformEs.position.x; // Initial x position
    let endX = 10; // End x position

    let startZ = meshPlatformEs.position.z; // Initial z position
    let endZ = -10; // End z position

    let positionObject = {
        x: startX,
        z: startZ
    };

    let tweenXForward = new TWEEN.Tween(positionObject)
        .to({
            x: endX
        }, 4000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
            meshPlatformEs.position.x = positionObject.x;
        })
        .onComplete(function() {
            new TWEEN.Tween(positionObject)
                .to({
                    x: startX
                }, 4000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    meshPlatformEs.position.x = positionObject.x;
                })
                .onComplete(function() {
                    let startRotation = {
                        y: meshPlatformEs.rotation.y
                    }; // Initial rotation
                    let endRotation = {
                        y: meshPlatformEs.rotation.y + Math.PI * 2 / 2
                    }; //  rotation

                    new TWEEN.Tween(startRotation)
                        .to(endRotation, 2000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(function() {
                            meshPlatformEs.rotation.y = startRotation.y;
                        })
                        .onComplete(function() {
                            tweenZForward.start();
                        })
                        .start();
                })
                .start();
        });

    let tweenZForward = new TWEEN.Tween(positionObject)
        .to({
            z: endZ
        }, 4000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
            meshPlatformEs.position.z = positionObject.z;
        })
        .onComplete(function() {
            new TWEEN.Tween(positionObject)
                .to({
                    z: startZ
                }, 4000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    meshPlatformEs.position.z = positionObject.z;
                })
                .onComplete(function() {
                    let startRotation = {
                        y: meshPlatformEs.rotation.y
                    }; // Initial rotation
                    let endRotation = {
                        y: meshPlatformEs.rotation.y - Math.PI * 2 / 2
                    }; //  rotation

                    new TWEEN.Tween(startRotation)
                        .to(endRotation, 2000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate(function() {
                            meshPlatformEs.rotation.y = startRotation.y;
                        })
                        .onComplete(function() {
                            tweenXForward.start();
                        })
                        .start();
                })
                .start();
        });

    // Start the first tween
    tweenXForward.start();

    //CUBo
    // Rotação
    function animateCubeRotation() {
        requestAnimationFrame(animateCubeRotation);

        meshobs3Es.rotation.y += 0.01;
    }

    // Start the rotation
    animateCubeRotation();

    // For movement along the x-axis
    let startCube = meshobs3Es.position.x; // Initial x position
    let endCube = 10; // End x position

    let cubePositionObject = {
        x: startCube
    };

    let cubeTweenForward = new TWEEN.Tween(cubePositionObject)
        .to({
            x: endCube
        }, 5000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
            meshobs3Es.position.x = cubePositionObject.x;
        })
        .onComplete(function() {
            new TWEEN.Tween(cubePositionObject)
                .to({
                    x: startCube
                }, 5000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    meshobs3Es.position.x = cubePositionObject.x;
                })
                .onComplete(function() {
                    cubeTweenForward.start();
                })
                .start();
        });

    // Start the x movement
    cubeTweenForward.start();


    //------Rotação das Spikes ----------
    var spikes = [spike1Es, spike2Es, spike3Es, spike4Es, spike5Es, spike6Es, spike7Es, spike8Es, spike9Es, spike10Es, spike11Es, spike12Es, spike13Es];

    function animateSpikesRotation() {
        requestAnimationFrame(animateSpikesRotation);

        spikes.forEach(function(spike) {
            spike.rotation.x += 0.04;
        });
    }


    animateSpikesRotation();

}


function MapaMedium() {
    parent_easy.remove(meshsphere);

    materialsTutNiv.forEach(function(material) {
        material.dispose();
    });
    materialsEasNiv.forEach(function(material) {
        material.dispose();
    });

    parent_medium.add(meshsphere);
    meshsphere.position.set(6.5, 1, 6);
    cena.add(parent_medium);
    animatePlatformX(meshwallplatformMd5, 'positive', -2, 6, 0.075);
    animatePlatform(meshwallplatformMd4, 'negative', -8, 6, 0.075);
    animatePlatform(meshwallplatformMd2, 'positive', -2, 4, 0.075);
    animatePlatformX(meshwallplatformMd3, 'positive', -4, 4, 0.075);

    var spikes = [spike1Md, spike2Md, spike3Md, spike4Md, spike5Md, spike6Md, spike7Md, spike8Md, spike9Md, spike10Md, spike11Md, spike12Md, spike13Md, spike14Md];

    function animateSpikesRotation() {
        requestAnimationFrame(animateSpikesRotation);

        // Rotate each spike around its own Y-axis
        spikes.forEach(function(spike) {
            spike.rotation.y += 0.03;
        });
    }

    // Start the rotation
    animateSpikesRotation();

    let startX = meshwallplatformMd.position.x; // Initial x position
    let endX = 4; // End x position

    let positionObject = {
        x: startX
    };

    let tweenXForward = new TWEEN.Tween(positionObject)
        .to({
            x: endX
        }, 4000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
            meshwallplatformMd.position.x = positionObject.x;
        })
        .onComplete(function() {
            let startRotation = {
                y: meshwallplatformMd.rotation.y
            }; // Initial rotation
            let endRotation = {
                y: meshwallplatformMd.rotation.y + Math.PI
            }; // 180 degrees rotation

            new TWEEN.Tween(startRotation)
                .to(endRotation, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    meshwallplatformMd.rotation.y = startRotation.y;
                })
                .onComplete(function() {
                    tweenXBackward.start();
                })
                .start();
        });

    let tweenXBackward = new TWEEN.Tween(positionObject)
        .to({
            x: startX
        }, 4000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function() {
            meshwallplatformMd.position.x = positionObject.x;
        })
        .onComplete(function() {
            let startRotation = {
                y: meshwallplatformMd.rotation.y
            }; // Initial rotation
            let endRotation = {
                y: meshwallplatformMd.rotation.y + Math.PI
            }; // 180 degrees rotation

            new TWEEN.Tween(startRotation)
                .to(endRotation, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function() {
                    meshwallplatformMd.rotation.y = startRotation.y;
                })
                .onComplete(function() {
                    tweenXForward.start();
                })
                .start();
        });

    // Start the first tween
    tweenXForward.start();

var startXCube = meshcubeobs.position.x; 
var endXCube = 6; 
var rotationAmountCube = 2 * Math.PI; 


var animationDurationCube = 4000;

var tweenXCube = new TWEEN.Tween(meshcubeobs.position)
    .to({ x: endXCube }, animationDurationCube)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function() {
        tweenRotationCube.start();
    });

var tweenRotationCube = new TWEEN.Tween(meshcubeobs.rotation)
    .to({ y: meshcubeobs.rotation.y + rotationAmountCube }, animationDurationCube)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function() {
        tweenXCubeBack.start();
    });

var tweenXCubeBack = new TWEEN.Tween(meshcubeobs.position)
    .to({ x: startXCube }, animationDurationCube)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(function() {
        meshcubeobs.rotation.y = 0;
        tweenXCube.start();
    });


// Start the animation
tweenXCube.start();

}



// ANIMATIONS : These functions animate meshes, on an axis: Z, X, Y respectively
// ----------------------------------------------------------------------------
function animatePlatform(mesh, direction, minValue, maxValue, speed) {

    if (direction === 'positive') {
        mesh.translateZ(speed);
        if (mesh.position.z >= maxValue) {
            direction = 'negative';
        }
    } else {
        mesh.translateZ(-speed);
        if (mesh.position.z <= minValue) {
            direction = 'positive';
        }
    }

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(function() {
        animatePlatform(mesh, direction, minValue, maxValue, speed);
    });
}

function animatePlatformX(mesh, direction, minValue, maxValue, speed) {

    if (direction === 'positive') {
        mesh.translateX(speed);
        if (mesh.position.x >= maxValue) {
            direction = 'negative';
        }
    } else {
        mesh.translateX(-speed);
        if (mesh.position.x <= minValue) {
            direction = 'positive';
        }
    }

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(function() {
        animatePlatformX(mesh, direction, minValue, maxValue, speed);
    });
}

function animatePlatformY(mesh, direction, minValue, maxValue, speed) {

    if (direction === 'positive') {
        mesh.translateY(speed);
        if (mesh.position.y >= maxValue) {
            direction = 'negative';
        }
    } else {
        mesh.translateY(-speed);
        if (mesh.position.y <= minValue) {
            direction = 'positive';
        }
    }

    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(function() {
        animatePlatformY(mesh, direction, minValue, maxValue, speed);
    });
}

// ----------------------------------------------------------------------------
var menu = document.getElementById('allthethings');
var gameover = document.getElementById('tudo');

document.getElementById("resetLVL").addEventListener("click", resetLevel);
document.getElementById("resetPOS").addEventListener("click", resetPosition);
document.getElementById("optY").addEventListener("click", resetLevelGo);
document.getElementById("optN").addEventListener("click", () => gameover.classList.toggle("hide"));


function resetLevel() {
    // Reset the level
    window.localStorage.setItem('map', '1');
    window.location.reload();
    menu.classList.toggle("hide");

}

function resetPosition() {
    if (map == 1) {
        meshsphere.position.set(3, -2.4, -10);
    } else if (map == 2) {
        meshsphere.position.set(11.5, 1, -20);
    } else {
        meshsphere.position.set(6.5, 1, 6);
    }
    menu.classList.toggle("hide");
}

function resetLevelGo() {
    window.localStorage.setItem('map', '1');
    window.location.reload();
    gameover.classList.toggle("hide");
}