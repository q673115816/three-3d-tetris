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
        this.initLight()
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
        this.camera.position.set(200, 400, 200)
        this.camera.lookAt(this.scene.position)
    }

    initLight() {
        this.scene.add(new THREE.AmbientLight(0x404040))
        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(100, 400, 100)

        this.scene.add(light)
    }

    initModel() {
        this.scene.add(new THREE.GridHelper(200))
        this.scene.add(new THREE.AxesHelper(200))
        this.createCube()
    }

    createCube() {
        
        const cubeGeomatry = new THREE.BoxGeometry(10, 10, 10)
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaccee,
        })
        const cube = new THREE.Mesh(cubeGeomatry, cubeMaterial)
        cube.position.set(
            THREE.MathUtils.randFloatSpread(100),
            100,
            THREE.MathUtils.randFloatSpread(100),
        )
        cube.name = 'cube'
        this.scene.add(cube)
    }

    initControl() {

    }

    render() {
        this.renderer.render(this.scene, this.camera)
        this.scene.traverse((e) => {
            if(e.name === 'cube') {
                e.position.y -= 0.3
                if(e.position.y < 0) {
                    this.scene.remove(e)
                    this.createCube()
                }
            }
        })
    }

    animate() {
        this.render()

        requestAnimationFrame(() => this.animate())
    }
}

new Draw()