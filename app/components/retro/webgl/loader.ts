import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { BASE_PATH } from "../basePath";

type Assists = {
  screenMesh: THREE.Mesh;
  computerMesh: THREE.Mesh;
  crtMesh: THREE.Mesh;
  keyboardMesh: THREE.Mesh;
  shadowPlaneMesh: THREE.Mesh;
  bakeTexture: THREE.Texture;
  bakeFloorTexture: THREE.Texture;
  publicPixelFont: Font;
  chillFont: Font;
  environmentMapTexture: THREE.CubeTexture;
};

/**
 * Progress reporting is a callback now rather than direct DOM writes, so the
 * host React component owns the loading overlay and its markup.
 */
export type LoaderElements = {
  onProgress?: (loaded: number, total: number, url: string) => void;
  onLoaded?: () => void;
};

function loadAssists(
  elements: LoaderElements,
  callback: (assists: Assists) => any
) {
  const assists: any = {};
  const { onProgress, onLoaded } = elements;

  const manager = new THREE.LoadingManager();

  manager.onLoad = function () {
    onProgress?.(1, 1, "");
    // Small beat so the progress bar visibly reaches 100% before the overlay
    // clears — the original used the same delay.
    window.setTimeout(() => {
      onLoaded?.();
      callback(assists as Assists);
    }, 200);
  };

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    onProgress?.(itemsLoaded, itemsTotal, url);
  };

  manager.onError = function (url) {
    console.error(`[retro] failed to load asset: ${url}`);
  };

  // Fonts
  const fontLoader = new FontLoader(manager);
  fontLoader.load(`${BASE_PATH}/fonts/public-pixel.json`, (font) => {
    assists.publicPixelFont = font;
  });
  fontLoader.load(`${BASE_PATH}/fonts/chill.json`, (font) => {
    assists.chillFont = font;
  });

  // Texture

  // Texture
  const textureLoader = new THREE.TextureLoader(manager);
  textureLoader.load(`${BASE_PATH}/textures/bake-quality-5.jpg`, (tex) => {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
    assists.bakeTexture = tex;
  });

  textureLoader.load(`${BASE_PATH}/textures/bake_floor-quality-3.jpg`, (tex) => {
    tex.flipY = false;
    tex.encoding = THREE.sRGBEncoding;
    assists.bakeFloorTexture = tex;
  });

  const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

  cubeTextureLoader.load(
    [
      `${BASE_PATH}/textures/environmentMap/px.jpg`,
      `${BASE_PATH}/textures/environmentMap/nx.jpg`,
      `${BASE_PATH}/textures/environmentMap/py.jpg`,
      `${BASE_PATH}/textures/environmentMap/ny.jpg`,
      `${BASE_PATH}/textures/environmentMap/pz.jpg`,
      `${BASE_PATH}/textures/environmentMap/nz.jpg`,
    ],
    (tex) => {
      assists.environmentMapTexture = tex;
    }
  );

  // Mesh
  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.load(`${BASE_PATH}/models/Commodore710_33.5.glb`, (gltf) => {
    assists.screenMesh = gltf.scene.children.find((m) => m.name === "Screen");
    assists.computerMesh = gltf.scene.children.find(
      (m) => m.name === "Computer"
    );
    assists.crtMesh = gltf.scene.children.find((m) => m.name === "CRT");
    assists.keyboardMesh = gltf.scene.children.find(
      (m) => m.name === "Keyboard"
    );
    assists.shadowPlaneMesh = gltf.scene.children.find(
      (m) => m.name === "ShadowPlane"
    );
 
  });
}

export { loadAssists };
export type { Assists };
