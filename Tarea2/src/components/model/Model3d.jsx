import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const Model3D = ({ position, playAnimation }) => {
  const [model, setModel] = useState(null);
  const [mixer, setMixer] = useState(null);
  const [animations, setAnimations] = useState([]);
  const modelRef = useRef();

  useEffect(() => {
    const loader = new FBXLoader();
    const animationFiles = [
      '/Standing Idle.fbx',
      '/Left Strafe.fbx',
      '/Right Strafe.fbx',
      '/Kneeling Down.fbx',
      '/Jump.fbx'
    ];

    animationFiles.forEach((file) => {
      loader.load(file, (loadedModel) => {
        loadedModel.scale.set(0.1, 0.1, 0.1);
        const animationMixer = new THREE.AnimationMixer(loadedModel);
        setMixer(animationMixer);


        loadedModel.animations.forEach((anim) => {
          anim.fileName = file;
          console.log(`Animación encontrada: ${anim.name} en el archivo: ${file}`);
        });

        setModel(loadedModel);
        setAnimations((prevAnimations) => [...prevAnimations, ...loadedModel.animations]);

        if (loadedModel.animations.length > 0) {
          const action = animationMixer.clipAction(loadedModel.animations[0]);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        }
      });
    });
  }, []);

  useEffect(() => {
    if (mixer && playAnimation && model) {
      mixer.stopAllAction();

      const animation = animations.find((anim) => anim.fileName === playAnimation);

      if (animation) {

        const action = mixer.clipAction(animation);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      } else {
        console.error(`No se encontró la animación: ${playAnimation}`);
      }
    }
  }, [playAnimation, mixer, model, animations]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    if (model && modelRef.current) {

      modelRef.current.position.set(position.x, position.y, 0);
      
    }
  });

  return (
    <>
      {model && (
        <primitive object={model} ref={modelRef} />
      )}
    </>
  );
};

const Scene = ({ position, playAnimation }) => {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <OrbitControls />
      <Model3D position={position} playAnimation={playAnimation} />
    </Canvas>
  );
};

export default Scene;
