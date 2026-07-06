// src/components/RobotScene.jsx
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, Loader } from "@react-three/drei";
import * as THREE from "three";
import "./Robo3D.css";

// GLB import (your correct path)
import robotUrl from "../../assets/robo.glb";

//
// 1) Robot – model load + target node ensure
//
function Robot({ targetNodeName = "face_aim_constrain" }) {
  const { scene } = useGLTF(robotUrl);
  const targetRef = useRef(null);

  useEffect(() => {
    // target node dhoondo
    scene.traverse((obj) => {
      if (!targetRef.current && obj.name === targetNodeName) {
        targetRef.current = obj;
      }
    });

    // agar export me nahi mila, to helper node create karo
    if (!targetRef.current) {
      const helper = new THREE.Object3D();
      helper.name = targetNodeName;
      scene.add(helper);
      targetRef.current = helper;
      console.warn("Created helper node:", targetNodeName);
    }

    // Debug ke liye node names dekhna ho to:
    // scene.traverse(o => console.log("NODE:", o.name));
  }, [scene, targetNodeName]);

  return <primitive object={scene} />;
}

//
// 2) FollowCursor – target node ko cursor ke 3D point tak le jana
//
function FollowCursor({ targetNodeName = "face_aim_constrain", distance = 2 }) {
  const { camera, scene } = useThree();
  const vec = new THREE.Vector3();

  useFrame(({ mouse }) => {
    const target = scene.getObjectByName(targetNodeName);
    if (!target) return;

    // mouse (NDC -1..1) -> world position
    vec.set(mouse.x, mouse.y, 0.5);
    vec.unproject(camera);
    vec
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)
      .add(camera.position);

    // smooth lerp
    if (target.parent) {
      const parentInv = new THREE.Matrix4()
        .copy(target.parent.matrixWorld)
        .invert();
      const local = vec.clone().applyMatrix4(parentInv);
      target.position.lerp(local, 0.25);
    } else {
      target.position.lerp(vec, 0.25);
    }
  });

  return null;
}

//
// 3) HeadLookAt – "HEAD" node ko limited angle se target ki taraf ghumana
//
function HeadLookAt({
  targetNodeName = "face_aim_constrain",
  headBoneName = "Head", // ✅ designer ne confirm kiya ye hi head node hai
  strength = 0.15,
  maxYawDeg = 40, // left-right max angle (degrees)
  maxPitchDeg = 20, // up-down max angle (degrees)
}) {
  const { scene } = useThree();
  const headRef = useRef(null);
  const targetRef = useRef(null);
  const baseQuatRef = useRef(null); // original head orientation

  const targetWorld = new THREE.Vector3();
  const maxYaw = THREE.MathUtils.degToRad(maxYawDeg);
  const maxPitch = THREE.MathUtils.degToRad(maxPitchDeg);

  useEffect(() => {
    headRef.current = scene.getObjectByName(headBoneName) || null;
    targetRef.current = scene.getObjectByName(targetNodeName) || null;

    console.log("[HeadLookAt] head =", headRef.current?.name);
    console.log("[HeadLookAt] target =", targetRef.current?.name);

    if (!headRef.current) {
      console.warn("[HeadLookAt] Head node not found (expected 'HEAD')");
      return;
    }
    if (!targetRef.current) {
      console.warn("[HeadLookAt] Target node not found:", targetNodeName);
      return;
    }

    // original orientation store kar lo
    baseQuatRef.current = headRef.current.quaternion.clone();
  }, [scene, headBoneName, targetNodeName]);

  useFrame(() => {
    const head = headRef.current;
    const target = targetRef.current;
    const baseQuat = baseQuatRef.current;
    if (!head || !target || !baseQuat) return;

    // target ka world pos
    target.getWorldPosition(targetWorld);

    // target ko head ke local space me le aao
    const targetLocal = head.worldToLocal(targetWorld.clone());
    targetLocal.normalize();

    // local direction se yaw/pitch nikaalo
    const yaw = Math.atan2(targetLocal.x, targetLocal.z); // left-right
    const pitch = Math.atan2(targetLocal.y, targetLocal.z); // up-down

    // clamp taaki head piche 180° na ghoome
    const clampedYaw = THREE.MathUtils.clamp(yaw, -maxYaw, maxYaw);
    const clampedPitch = THREE.MathUtils.clamp(pitch, -maxPitch, maxPitch);

    // clamped angles se local rotation banao
    const euler = new THREE.Euler(clampedPitch, clampedYaw, 0, "YXZ");
    const offsetQuat = new THREE.Quaternion().setFromEuler(euler);

    // final rotation = basePose * offset
    const finalQuat = baseQuat.clone().multiply(offsetQuat);

    // smooth slerp
    head.quaternion.slerp(finalQuat, strength);
  });

  return null;
}

//
// 4) Main scene component
//
export default function RobotScene() {
  return (
    <div className="robo3dParent">
      <Canvas camera={{ position: [0, 1.4, 5], fov: 5 }}>
        {/* Lights */}
        <ambientLight intensity={3} color={"rgba(216, 212, 248, 1)"} />
        <directionalLight position={[5, 5, 5]} intensity={3} />

        <Suspense fallback={<Html center>Loading Robot…</Html>}>
          {/* Robot placement */}
          <group
            position={[0, -0.35, 0]}
            scale={0.2}
            rotation={[0, Math.PI, 0]}
          >
            <Robot />
          </group>

          {/* Cursor → target point */}
          <FollowCursor />

          {/* HEAD (head) → target ki taraf limited angle se dekhe */}
          <HeadLookAt
            targetNodeName="face_aim_constrain"
            headBoneName="HEAD"
            strength={0.15}
            maxYawDeg={40}
            maxPitchDeg={20}
          />
        </Suspense>

        {/* Camera: rotate ON/ OFF as you like */}
        <OrbitControls enablePan={true} enableRotate={true} enableZoom={false} />
      </Canvas>

      <Loader />
    </div>
  );
}
