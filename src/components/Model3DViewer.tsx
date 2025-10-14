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
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={1}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
      <Suspense fallback={<LoadingFallback />} />
    </div>
  );
}
