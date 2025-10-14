import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
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
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={50}
            zoomSpeed={1.2}
            rotateSpeed={0.8}
            panSpeed={0.8}
            autoRotate={false}
            autoRotateSpeed={2}
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
