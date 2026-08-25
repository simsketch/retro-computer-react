import * as THREE from "three";
import ScreenRenderEngine from "./renderEngine";
import ScreenTextEngine from "./textEngine";
import { Assists } from "../loader";
import Terminal, { TerminalElements } from "../../terminal";

export default function Screen(
  assists: Assists,
  renderer: THREE.WebGLRenderer,
  elements: TerminalElements
) {
  const sceneRTT = new THREE.Scene();

  // Geometry
  const backGround = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  backGround.position.set(0.5, -0.5, -0.01);

  const screenTextEngine = ScreenTextEngine(
    assists,
    sceneRTT,
  );

  const screenRenderEngine = ScreenRenderEngine(assists, renderer, sceneRTT);

  const terminal = Terminal(screenTextEngine, elements);

  const tick = (deltaTime: number, elapsedTime: number) => {
    screenRenderEngine.tick(deltaTime, elapsedTime);
    screenTextEngine.tick(deltaTime, elapsedTime);
  };

  return {
    tick,
    screenRenderEngine,
    screenTextEngine,
    dispose: terminal.dispose,
  };
}
