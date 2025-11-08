import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Center, Bounds } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

interface Model3DViewerProps {
  modelUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera, controls } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (scene && camera && controls) {
      controlsRef.current = controls;
      
      // Calculate bounding box to understand model size
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // Normalize model scale if it's too large or too small
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 5 / maxDim : 1;
      scene.scale.setScalar(scale);
      
      // Recalculate after scaling
      box.setFromObject(scene);
      box.getCenter(center);
      
      // Position camera to view the model
      const distance = maxDim * 1.5;
      camera.position.set(distance, distance * 0.5, distance);
      camera.lookAt(center);
      
      // Set controls target to model center
      if (controls && 'target' in controls) {
        (controls as any).target.copy(center);
        (controls as any).update();
      }
    }
  }, [scene, camera, controls, url]);
  
  return <primitive object={scene} />;
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
}

export default function Model3DViewer({ modelUrl }: Model3DViewerProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 1);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <Model url={modelUrl} />
            </Center>
          </Bounds>
          <OrbitControls
            makeDefault
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={50}
            zoomSpeed={1.5}
            rotateSpeed={1}
            panSpeed={1}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      <Suspense fallback={<LoadingFallback />} />
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-md">
        <p>🖱️ Left Click + Drag: Rotate</p>
        <p>🖱️ Right Click + Drag: Pan</p>
        <p>🖱️ Scroll: Zoom In/Out</p>
      </div>
    </div>
  );
}