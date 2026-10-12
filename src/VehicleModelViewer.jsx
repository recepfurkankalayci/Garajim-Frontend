import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function disposeModel(model) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();

  model.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (!object.material) return;

    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value);
      });
    });
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

function VehicleModelViewer({ modelUrl, modelName, rotation }) {
  const canvasRef = useRef(null);
  const modelGroupRef = useRef(null);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let animationFrame;
    let loadedModel;
    let ground;
    let groundMaterial;
    let modelGroup;
    let renderer;
    let resizeObserver;

    const showError = (error) => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      if (loadedModel) {
        disposeModel(loadedModel);
        loadedModel = null;
      }
      ground?.geometry.dispose();
      ground = null;
      groundMaterial?.dispose();
      groundMaterial = null;
      renderer?.dispose();
      renderer = null;
      if (modelGroupRef.current === modelGroup) modelGroupRef.current = null;
      window.requestAnimationFrame(() => {
        if (disposed) return;
        setLoadError(error instanceof Error ? error.message : '3B görüntüleyici başlatılamadı.');
        setIsLoading(false);
      });
    };

    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFShadowMap;

      const scene = new Scene();
      const camera = new PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(5.8, 3.4, 7.5);

      modelGroup = new Group();
      modelGroupRef.current = modelGroup;
      scene.add(modelGroup);

      scene.add(new HemisphereLight(0xe8f0ff, 0x342025, 2.1));

      const keyLight = new DirectionalLight(0xffeee4, 3.2);
      keyLight.position.set(-4, 8, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.0002;
      scene.add(keyLight);

      const fillLight = new DirectionalLight(0xc5d9ff, 1.4);
      fillLight.position.set(5, 3, -4);
      scene.add(fillLight);

      groundMaterial = new ShadowMaterial({ opacity: 0.24 });
      ground = new Mesh(new PlaneGeometry(40, 40), groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const render = () => {
        if (disposed) return;
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(render);
      };
      render();

      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          if (disposed) {
            disposeModel(gltf.scene);
            return;
          }

          const bounds = new Box3().setFromObject(gltf.scene);
          const size = bounds.getSize(new Vector3());
          const center = bounds.getCenter(new Vector3());
          const largestDimension = Math.max(size.x, size.y, size.z);

          if (!largestDimension) {
            disposeModel(gltf.scene);
            showError(new Error(`${modelName} modeli boş veya geçersiz.`));
            return;
          }

          const scale = 6.2 / largestDimension;
          gltf.scene.scale.setScalar(scale);
          gltf.scene.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
          gltf.scene.traverse((object) => {
            if (object.isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          modelGroup.add(gltf.scene);
          loadedModel = gltf.scene;
          ground.position.y = 0.015;
          camera.lookAt(0, size.y * scale * 0.38, 0);
          setIsLoading(false);
        },
        undefined,
        (error) => {
          if (disposed) return;
          const details = error instanceof Error ? error.message : 'Model dosyası indirilemedi.';
          showError(new Error(`${modelName} 3B modeli yüklenemedi. ${details}`));
        },
      );
    } catch (error) {
      showError(error);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      if (loadedModel) disposeModel(loadedModel);
      ground?.geometry.dispose();
      groundMaterial?.dispose();
      renderer?.dispose();
      modelGroupRef.current = null;
    };
  }, [modelName, modelUrl]);

  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.rotation.y = MathUtils.degToRad(rotation);
  }, [rotation]);

  return (
    <div className="home-car-view">
      <canvas ref={canvasRef} className="home-model-canvas" aria-hidden="true" />
      {isLoading && <span className="home-model-status" role="status">3B model yükleniyor…</span>}
      {loadError && <span className="home-model-error" role="alert">{loadError}</span>}
    </div>
  );
}

export default VehicleModelViewer;
