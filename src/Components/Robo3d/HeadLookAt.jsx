function HeadLookAt({
  targetNodeName = "face_aim_constrain",
  headBoneName = "head_last",   // yaha bone ka naam change karke test kar sakta
  strength = 0.15,              // 0.1–0.2 smooth, 1.0 instant
}) {
  const { scene } = useThree();
  const headRef = useRef(null);
  const targetRef = useRef(null);

  const headPos = new THREE.Vector3();
  const targetPos = new THREE.Vector3();
  const lookMat = new THREE.Matrix4();
  const worldQuat = new THREE.Quaternion();
  const parentQuat = new THREE.Quaternioon();

  // ek baar head & target node find karo
  useEffect(() => {
    headRef.current = scene.getObjectByName(headBoneName) || null;
    targetRef.current = scene.getObjectByName(targetNodeName) || null;

    console.log("[HeadLookAt] head:", headRef.current?.name, "target:", targetRef.current?.name);

    if (!headRef.current) {
      console.warn("[HeadLookAt] Head bone not found. Try 'head' ya 'head_parentConstraint1'");
    }
    if (!targetRef.current) {
      console.warn("[HeadLookAt] Target node not found:", targetNodeName);
    }
  }, [scene, headBoneName, targetNodeName]);

  useFrame(() => {
    const head = headRef.current;
    const target = targetRef.current;
    if (!head || !target) return;

    // world space positions
    head.getWorldPosition(headPos);
    target.getWorldPosition(targetPos);

    // world rotation so head looks at target
    lookMat.lookAt(headPos, targetPos, head.up);
    worldQuat.setFromRotationMatrix(lookMat);

    // world -> local space (parent ka rotation remove karo)
    if (head.parent) {
      head.parent.getWorldQuaternion(parentQuat);
      parentQuat.invert();
      worldQuat.premultiply(parentQuat);
    }

    // smooth rotation
    head.quaternion.slerp(worldQuat, strength);
  });

  return null;
}
