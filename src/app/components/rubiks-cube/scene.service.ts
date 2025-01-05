import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class SceneService {
  setupScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#007bff');

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);


    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);


    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, -2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    return scene;
  }

  setupCamera(aspect: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 0, 0);
    return camera;
  }
}