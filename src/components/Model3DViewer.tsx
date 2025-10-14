import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface Model3DViewerProps {
  modelUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
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
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.5}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
            zoomSpeed={1.5}
            rotateSpeed={1}
            panSpeed={1}
            autoRotate={false}
            autoRotateSpeed={2}
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