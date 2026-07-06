import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useLayoutEffect, useRef, useState, memo } from "react";
import "./RoboFix.css";
import roboModel from "../../assets/Robot_Rigging_Fix8.glb";

/* ================================
   ENTRY ANIMATION CONTROLLER
   (NO BLOOM ANIMATION)
================================ */
function EntryAnimationController({
  progressRef,
  dirLightRef,
  pointLightRef,
}) {
  useFrame(() => {
    if (progressRef.current < 0.999) {
      progressRef.current = THREE.MathUtils.lerp(
        progressRef.current,
        1,
        0.05
      );
    }

    const p = progressRef.current;

    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(0, 0.5, p);
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = THREE.MathUtils.lerp(0, 10, p);
    }
  });

  return null;
}

/* ================================
   ROBOT MODEL
================================ */
const Robot = memo(function Robot({ isHovering, progressRef }) {
  const { scene } = useGLTF(roboModel);
  const headRef = useRef(null);
 const visualXOffset = -1.4; // 👈 tweak once, done forever
  useLayoutEffect(() => {
  // 🔹 Always reset first (prevents refresh / hot-reload bugs)
  scene.position.set(0, 0, 0);

  // 🔹 Apply initial scale first
  scene.scale.setScalar(2.6);

  // 🔹 Force transforms update
  scene.updateMatrixWorld(true);

  // 🔹 Calculate bounding box AFTER scale
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());

  // 🔹 VISUAL centering (X only)

scene.position.x = -center.x + visualXOffset;

  // 🔹 Keep YOUR Y logic (this was already correct visually)
  scene.position.y = -3.8;

  scene.traverse((node) => {
    if (node.name === "Head") headRef.current = node;

    if (node.isMesh && node.material) {
      node.material.transparent = true;
      node.material.opacity = 0;

      if (node.material.map) {
        node.material.map.anisotropy = 16;
        node.material.map.needsUpdate = true;
      }
    }
  });
}, [scene]);


  useFrame(({ mouse }) => {
    const p = progressRef.current;

    // SCALE
    scene.scale.setScalar(THREE.MathUtils.lerp(2.2, 2, p));

    // OPACITY
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material.opacity = p;
      }
    });

    // HEAD FOLLOW
    if (!isHovering || !headRef.current) return;

    const x = THREE.MathUtils.clamp(mouse.x, -0.4, 0.4);
    const y = THREE.MathUtils.clamp(mouse.y, -0.3, 0.3);

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      x*2,
      0.1
    );

    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      -y, 
      0.1
    );
  });

  return <primitive object={scene} />;
});

/* ================================
   MAIN COMPONENT
================================ */
export default function RoboFix() {
  const [isHovering, setIsHovering] = useState(false);

  const progressRef = useRef(0);
  const dirLightRef = useRef();
  const pointLightRef = useRef();

  return (
    <div
      className="roboWrapper"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: [0, -1, 8], fov: 35 }}
      >
        <ambientLight intensity={1} />

        <directionalLight
          ref={dirLightRef}
          position={[0, 0, 1]}
          color="#ffba58ff"
          intensity={0}
        />

        <pointLight
          ref={pointLightRef}
          position={[0, 3, 2]}
          color="#ffba58ff"
          intensity={0}
          distance={20}
        />

        {/* STATIC BLOOM (SAFE) */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={6}
          />
        </EffectComposer>

        <EntryAnimationController
          progressRef={progressRef}
          dirLightRef={dirLightRef}
          pointLightRef={pointLightRef}
        />

        <Robot isHovering={isHovering} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
