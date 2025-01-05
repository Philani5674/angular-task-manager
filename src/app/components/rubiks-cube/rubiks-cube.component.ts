import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { SceneService } from './scene.service';
import { CubeletService } from './cubelet.service';
import { CUBE_CONFIG } from './constants';

@Component({
  selector: 'app-rubiks-cube',
  standalone: true,
  providers: [SceneService, CubeletService],
  template: `
    <canvas #rendererCanvas></canvas>
  `,
  styles: [`
    canvas {
      width: 100%;
      height: 800px;
      display: block;
    }
  `]
})
export class RubiksCubeComponent implements OnDestroy {
  @ViewChild('rendererCanvas') rendererCanvas!: ElementRef<HTMLCanvasElement>;
  
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Group;
  private animationId!: number;

  constructor(
    private sceneService: SceneService,
    private cubeletService: CubeletService
  ) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.createCube();
    this.animate();
  }

  private initThree(): void {
    this.scene = this.sceneService.setupScene();
    this.camera = this.sceneService.setupCamera(250 / 250);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(250, 250);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private createCube(): void {
    this.cube = new THREE.Group();
    
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubelet = this.cubeletService.createCubelet(x, y, z);
          this.cube.add(cubelet);
        }
      }
    }

    this.scene.add(this.cube);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    this.cube.rotation.y += CUBE_CONFIG.ROTATION_SPEED;
    this.cube.rotation.x += CUBE_CONFIG.ROTATION_SPEED * 0.7;

    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer?.dispose();
    this.scene?.clear();
  }
}