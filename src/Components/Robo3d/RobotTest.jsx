// src/components/RobotScene.jsx
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, Loader } from "@react-three/drei";
import * as THREE from "three";
import "./Robo3D.css";

// ✅ Your correct import method
import robotUrl from "../../assets/robo.glb";

//
// 1) Robot loader — ensures face_aim_constrain exists
//
function Robot({ targetNodeName = "face_aim_constrain" }) {
  const { scene } = useGLTF(robotUrl);
  const targetRef = useRef(null);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!targetRef.current && obj.name === targetNodeName) {
        targetRef.current = obj;
      }
    });

    if (!targetRef.current) {
      const helper = new THREE.Object3D();
      helper.name = targetNodeName;
      scene.add(helper);
      targetRef.current = helper;
      console.warn("Created helper node:", targetNodeName);
    }

    // Debug: uncomment to print all node names:
    // scene.traverse(o => console.log("NODE =>", o.name));
  }, [scene, targetNodeName]);

  return <primitive object={scene} />;
}

//
// 2) FollowCursor — moves invisible target with cursor
//
function FollowCursor({ targetNodeName = "face_aim_constrain", distance = 2 }) {
  const { camera, scene } = useThree();
  const vec = new THREE.Vector3();

  useFrame(({ mouse }) => {
    const target = scene.getObjectByName(targetNodeName);
    if (!target) return;

    vec.set(mouse.x, mouse.y, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize().multiplyScalar(distance).add(camera.position);

    if (target.parent) {
      const parentInv = new THREE.Matrix4().copy(target.parent.matrixWorld).invert();
      const local = vec.clone().applyMatrix4(parentInv);
      target.position.lerp(local, 0.25);
    } else {
      target.position.lerp(vec, 0.25);
    }
  });

  return null;
}

//
// 3) HeadLookAt — rotates HEAD node toward target
//
function HeadLookAt({
  targetNodeName = "face_aim_constrain",
  headName = "HEAD", // confirmed by designer
  strength = 0.15,
  maxYawDeg = 40,
  maxPitchDeg = 20,
}) {
  const { scene } = useThree();
  const headRef = useRef(null);
  const targetRef = useRef(null);
  const baseQuatRef = useRef(null);
  const targetWorld = new THREE.Vector3();

  const maxYaw = THREE.MathUtils.degToRad(maxYawDeg);
  const maxPitch = THREE.MathUtils.degToRad(maxPitchDeg);

  useEffect(() => {
    headRef.current = scene.getObjectByName(headName);
    targetRef.current = scene.getObjectByName(targetNodeName);

    console.log("[HeadLookAt] head =", headRef.current?.name);
    console.log("[HeadLookAt] target =", targetRef.current?.name);

    if (!headRef.current) {
      console.warn(`[HeadLookAt] HEAD node not found (expected: '${headName}')`);
      return;
    }
    if (!targetRef.current) {
      console.warn("[HeadLookAt] Target node not found:", targetNodeName);
      return;
    }

    baseQuatRef.current = headRef.current.quaternion.clone();
  }, [scene, headName, targetNodeName]);

  useFrame(() => {
    const head = headRef.current;
    const target = targetRef.current;
    const baseQuat = baseQuatRef.current;
    if (!head || !target || !baseQuat) return;

    target.getWorldPosition(targetWorld);

    const targetLocal = head.worldToLocal(targetWorld.clone());
    targetLocal.normalize();

    const yaw = Math.atan2(targetLocal.x, targetLocal.z);
    const pitch = Math.atan2(targetLocal.y, targetLocal.z);

    const clampedYaw = THREE.MathUtils.clamp(yaw, -maxYaw, maxYaw);
    const clampedPitch = THREE.MathUtils.clamp(pitch, -maxPitch, maxPitch);

    const euler = new THREE.Euler(clampedPitch, clampedYaw, 0, "YXZ");
    const offsetQuat = new THREE.Quaternion().setFromEuler(euler);

    const finalQuat = baseQuat.clone().multiply(offsetQuat);

    head.quaternion.slerp(finalQuat, strength);
  });

  return null;
}

//
// 4) Main Scene
//
export default function RobotScene() {
  return (
    <div className="robo3dParent" style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 1.4, 5], fov: 35 }}>
        <ambientLight intensity={2} color="#d8d4f8" />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Suspense fallback={<Html center>Loading Robot…</Html>}>
          <group position={[0, -0.35, 0]} scale={0.2} rotation={[0, Math.PI, 0]}>
            <Robot />
          </group>

          <FollowCursor />

          <HeadLookAt
            targetNodeName="face_aim_constrain"
            headName="HEAD"
            strength={0.15}
            maxYawDeg={40}
            maxPitchDeg={20}
          />
        </Suspense>

        <OrbitControls enablePan={true} enableRotate={true} enableZoom={false} />
      </Canvas>

      <Loader />
    </div>
  );
}
