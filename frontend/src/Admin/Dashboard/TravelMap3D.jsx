import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

const TravelMap3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Get the parent container's dimensions
    const container = mountRef.current;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = 350; // Fixed height or you can make it dynamic

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup with adjusted aspect ratio
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 100, 250);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.maxDistance = 600;
    controls.minDistance = 150;
    controls.rotateSpeed = 2;
    controlsRef.current = controls;

    const group = new THREE.Group();
    scene.add(group);
    group.rotation.y = 2;

    let subgroups = [];
    let airplane = new THREE.Group();
    new OBJLoader().load("https://assets.codepen.io/127738/Airplane_model2.obj", (obj) => {
      airplane = obj;
      console.log(airplane)
      const mat = new THREE.MeshPhongMaterial({ emissive: 0xffffff, emissiveIntensity: 0.3 });
      airplane.children.forEach((child) => {
        child.geometry.scale(0.013, 0.013, 0.013);
        child.geometry.translate(0, 122, 0);
        child.material = mat;
      });
      let angles = [0.3, 1.3, 2.14, 2.6];
      let speeds = [0.008, 0.01, 0.014, 0.02];
      let rotations = [0, 2.6, 1.5, 4];
      for (let i = 0; i < 4; i++) {
        const g = new THREE.Group();
        g.speed = speeds[i];
        subgroups.push(g);
        group.add(g);
        const g2 = new THREE.Group();
        let _airplane = airplane.clone();
        g.add(g2);
        g2.add(_airplane);
        g2.rotation.x = rotations[i];
        g.rotation.y = angles[i];
        if (i < 2) {
          _airplane.children[0].geometry = airplane.children[0].geometry.clone().rotateY(Math.PI);
        }
      }
    });

    let sampler = [];
    let earth = null;
    let paths = [];
    new OBJLoader().load("https://assets.codepen.io/127738/NOVELO_EARTH.obj", (obj) => {
      earth = obj.children[0];
      earth.geometry.scale(0.35, 0.35, 0.35);
      earth.geometry.translate(0, -133, 0);
      let positions = Array.from(earth.geometry.attributes.position.array).splice(0, 3960 * 3);
      const landGeom = new THREE.BufferGeometry();
      landGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const land = new THREE.Mesh(landGeom);
      positions = Array.from(earth.geometry.attributes.position.array).splice(3960 * 3, 540 * 3);
      const waterGeom = new THREE.BufferGeometry();
      waterGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      waterGeom.computeVertexNormals();
      const waterMat = new THREE.MeshLambertMaterial({ color: 0x0da9c3, transparent: true, opacity: 1 });
      const water = new THREE.Mesh(waterGeom, waterMat);
      group.add(water);
      scene.add(new THREE.HemisphereLight(0xccffff, 0x000033, 1));
      sampler = new MeshSurfaceSampler(land).build();
      for (let i = 0; i < 24; i++) {
        const path = new Path(sampler);
        paths.push(path);
        group.add(path.line);
      }
      renderer.setAnimationLoop(render);
    });

    class Path {
      constructor(sampler) {
        this.geometry = new THREE.BufferGeometry();
        this.line = new THREE.Line(this.geometry, new THREE.LineBasicMaterial({ color: 0xbbde2d, transparent: true, opacity: 0.6 }));
        this.vertices = [];
        const tempPosition = new THREE.Vector3();
        sampler.sample(tempPosition);
        this.previousPoint = tempPosition.clone();
      }
      update() {
        const tempPosition = new THREE.Vector3();
        let pointFound = false;
        while (!pointFound) {
          sampler.sample(tempPosition);
          if (tempPosition.distanceTo(this.previousPoint) < 12) {
            this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
            this.previousPoint = tempPosition.clone();
            pointFound = true;
          }
        }
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));
      }
    }

    function render() {
      group.rotation.y += 0.001;
      subgroups.forEach((g) => {
        g.children[0].rotation.x += g.speed * (g.reverse ? -1 : 1);
      });
      paths.forEach((path) => {
        if (path.vertices.length < 35000) {
          path.update();
        }
      });
      controls.update();
      renderer.render(scene, camera);
    }

    // Update the resize handler
    const handleResize = () => {
      const newWidth = container.getBoundingClientRect().width;
      const newHeight = 350; // Keep fixed height or make dynamic

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      controls.handleResize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      controlsRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="map-container bg-white rounded-lg shadow-lg p-4 mt-6"
      style={{
        width: '100%',
        height: '350px', // Fixed height
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Optional loading overlay
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 loading-overlay">
        <span className="text-blue-500">Loading 3D Map...</span>
      </div> */}
    </div>
  );
};

export default TravelMap3D;
