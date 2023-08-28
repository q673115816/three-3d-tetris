import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
class Draw {
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        antialias: true,

    })
    scene: THREE.Scene = new THREE.Scene
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    control: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    constructor() {
        this.initRenderer()
        this.initScene()
        this.initCamera()
        this.initModel()
        this.initControl()
        this.animate()
    }

    initRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x333333)
        document.body.append(this.renderer.domElement)
    }

    initScene() {

    }

    initCamera() {
        this.camera.position.set(25, 50, 100)
        this.camera.lookAt(this.scene.position)
    }

    initModel() {
        this.scene.add(new THREE.GridHelper(100))
        this.scene.add(new THREE.AxesHelper(100))
    }

    initControl() {

    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        this.render()

        requestAnimationFrame(() => this.animate())
    }
}

new Draw()