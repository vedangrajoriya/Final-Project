import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleSphere } from './ParticleSphere';

export const SceneBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      {/* Background radial gradient to give infinite depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-60"></div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#000000', 5, 15]} />
        <ParticleSphere />
      </Canvas>
    </div>
  );
};
