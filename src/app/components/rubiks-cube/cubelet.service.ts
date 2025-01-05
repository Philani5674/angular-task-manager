import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { COLORS, CUBE_CONFIG } from './constants';

@Injectable()
export class CubeletService {
  createCubelet(x: number, y: number, z: number): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      CUBE_CONFIG.SIZE,
      CUBE_CONFIG.SIZE,
      CUBE_CONFIG.SIZE,
      1, 1, 1
    );

    // Bevel the edges
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    );

    const materials = [
      this.createMaterial(x === 1 ? COLORS.RED : 0x000000),    // Right
      this.createMaterial(x === -1 ? COLORS.ORANGE : 0x000000), // Left
      this.createMaterial(y === 1 ? COLORS.WHITE : 0x000000),   // Top
      this.createMaterial(y === -1 ? COLORS.YELLOW : 0x000000), // Bottom
      this.createMaterial(z === 1 ? COLORS.GREEN : 0x000000),   // Front
      this.createMaterial(z === -1 ? COLORS.BLUE : 0x000000),   // Back
    ];

    const cubelet = new THREE.Mesh(geometry, materials);
    cubelet.position.set(
      x * (CUBE_CONFIG.SIZE + CUBE_CONFIG.GAP),
      y * (CUBE_CONFIG.SIZE + CUBE_CONFIG.GAP),
      z * (CUBE_CONFIG.SIZE + CUBE_CONFIG.GAP)
    );
    
    cubelet.add(line);
    return cubelet;
  }

  private createMaterial(color: number): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0,
      roughness: 0.8,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      flatShading: false
    });
  }
}