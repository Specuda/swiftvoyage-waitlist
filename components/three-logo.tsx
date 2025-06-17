"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeLogoProps {
  modelPath: string;
  className?: string;
  animationState: 'idle' | 'takingOff' | 'returning';
  onAnimationComplete?: () => void;
  onClick?: () => void;
}

export default function ThreeLogo({ 
  modelPath, 
  className = "", 
  animationState,
  onAnimationComplete,
  onClick 
}: ThreeLogoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = 96; // 24 * 4 (w-24 = 96px)
    const height = 96;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Additional fill light
    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);

    mountRef.current.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Load the model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Configure model
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance materials if needed
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.envMapIntensity = 0.5;
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMapIntensity = 0.5;
              }
            }
          }
        });

        // Auto-scale and center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 9 / maxDim; // Adjust this value to fit your design
        
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        
        scene.add(model);
        modelRef.current = model;
        setIsLoaded(true);
        
        // Position camera
        camera.position.set(0, 10, 4);
        camera.lookAt(0, 0, 0);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
      }
    );

    // Animate function
    const animate = () => {
      if (sceneRef.current && rendererRef.current && cameraRef.current) {
        // Subtle idle rotation
        if (modelRef.current && animationState === 'idle') {
          modelRef.current.rotation.y += 0.005;
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  // Handle animation states
  useEffect(() => {
    if (!modelRef.current || !isLoaded) return;

    const model = modelRef.current;
    
    // Reset any ongoing animations
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    const animateModel = () => {
      switch (animationState) {
        case 'takingOff':
          // Animate takeoff
          const takeoffDuration = 1500;
          const startTime = Date.now();
          
          const animateTakeoff = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / takeoffDuration, 1);
            
            // Easing function for smooth animation
            const easeIn = progress * progress;
            
            model.position.y = easeIn * 5;
            model.position.x = easeIn * 2;
            model.rotation.z = -easeIn * Math.PI / 6;
            model.scale.setScalar(1 - easeIn * 0.7);
            
            if (progress < 1) {
              requestAnimationFrame(animateTakeoff);
            } else {
              onAnimationComplete?.();
            }
          };
          animateTakeoff();
          break;
          
        case 'returning':
          // Animate return
          const returnDuration = 2000;
          const returnStartTime = Date.now();
          
          // Start from off-screen position
          model.position.set(-3, -6, 0);
          model.rotation.set(0, 0, Math.PI / 4);
          model.scale.setScalar(0.3);
          
          const animateReturn = () => {
            const elapsed = Date.now() - returnStartTime;
            const progress = Math.min(elapsed / returnDuration, 1);
            
            // Easing function for smooth landing
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            model.position.y = -6 + easeOut * 6;
            model.position.x = -3 + easeOut * 3;
            model.rotation.z = Math.PI / 4 - easeOut * Math.PI / 4;
            model.scale.setScalar(0.3 + easeOut * 0.7);
            
            if (progress < 1) {
              requestAnimationFrame(animateReturn);
            } else {
              onAnimationComplete?.();
            }
          };
          animateReturn();
          break;
          
        case 'idle':
        default:
          // Reset to idle position
          model.position.set(0, 0, 0);
          model.rotation.set(0, 0, 0);
          model.scale.setScalar(1);
          break;
      }
    };

    animateModel();
  }, [animationState, isLoaded, onAnimationComplete]);

  // Handle click events
  const handleClick = () => {
    if (animationState === 'idle') {
      onClick?.();
    }
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="text-red-500 text-sm">Failed to load 3D model</div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className={`${className} cursor-pointer select-none`}
      onClick={handleClick}
      style={{
        width: '96px',
        height: '96px',
        filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))'
      }}
    />
  );
}