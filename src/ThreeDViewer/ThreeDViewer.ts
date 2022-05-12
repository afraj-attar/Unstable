import * as THREE from "three";
import { TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

class ThreeDViewer {

    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private sizes: { width: number, height: number };
    private controls: OrbitControls;

    private cursor = {
        x: 0,
        y: 0
    };

    constructor(canvasId: string) {

        /**
         * Initialize Scene
         */
        this.scene = new THREE.Scene();

        /**
         * Initialize Renderer
         */
        let canvas = document.getElementById(canvasId);
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = canvasId;
        }

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(2);
        document.body.appendChild(this.renderer.domElement);

        /**
         * Initialize Camera
         */
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);

        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.5));


        /**
         * Add Orbit Controls
         */
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.04;

        this.camera.position.set(0, 0, 5);
        this.controls.update();


        window.addEventListener('resize', () => {
            this.resize();
        });

        this.animate();

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5;
            this.cursor.y = event.clientY / this.sizes.height - 0.5;
        });

        /**
         * For Debugging Purposes
         */
        this.addToGlobalVariables();

    }


    addToGlobalVariables(): void {

        //@ts-ignore
        window.THREE = THREE;

        //@ts-ignore
        window.scene = this.scene;

        //@ts-ignore
        window.camera = this.camera;

    }

    fitToView(): void {

        const bBox = new THREE.Box3();
        bBox.setFromObject(this.scene);

        const center = new THREE.Vector3();
        bBox.getCenter(center);

        const size = new THREE.Vector3();
        bBox.getSize(size);

        const directionVector = new THREE.Vector3(1, 1, 1);

        const distance = bBox.min.distanceTo(bBox.max);

        this.controls.reset();
        this.controls.target.copy(center);

        this.camera.position.copy(center.clone().addScaledVector(directionVector.normalize(), distance));
        this.camera.lookAt(center);
        this.camera.updateProjectionMatrix();

    }

    resize(): void {

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.controls.update();

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(2);

    }

    addScene(): void {

        const textureLoader = new TextureLoader();
        const textTexture = textureLoader.load('./texture.jpg');
        const texture = textureLoader.load('./1.png');

        const fontLoader = new FontLoader();
        fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {

            const textGeom = new TextGeometry('         Creative \n 3D Web Developer', {
                font: font,
                size: 0.6,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelOffset: 0,
                bevelSegments: 3,
                bevelSize: 0.02,
                bevelThickness: 0.03,
            });
            textGeom.center();

            const material = new THREE.MeshMatcapMaterial({ matcap: textTexture });
            const text = new THREE.Mesh(textGeom, material);
            this.scene.add(text);

            this.addShapes(new THREE.MeshMatcapMaterial({ matcap: texture }));

        });

    }

    addShapes(material: THREE.Material): void {

        const torusGeom = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
        const boxGeom = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2, 16, 16);

        for (let i = 0; i < 1000; i++) {

            let mesh;
            if (i % 2 === 0)
                mesh = new THREE.Mesh(torusGeom, material);
            else {
                mesh = new THREE.Mesh(boxGeom, material);
            }

            mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

            const scale = Math.random();
            mesh.scale.set(scale, scale, scale);

            this.scene.add(mesh);
        }

    }

    animate(): void {

        // Camera
        const cameraTarget = { x: this.cursor.x * 40, y: - this.cursor.y * 40 };
        this.camera.position.x += (cameraTarget.x - this.camera.position.x) * 0.05;
        this.camera.position.y += (cameraTarget.y - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));

    }

}

export { ThreeDViewer };