import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface PanoramaViewerProps {
  imageUrl: string;
}

function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
  const texture = new THREE.TextureLoader().load(imageUrl);
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function PanoramaViewer({ imageUrl }: PanoramaViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <PanoramaSphere imageUrl={imageUrl} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.5}
          minDistance={0.1}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
}
