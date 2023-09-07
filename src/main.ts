import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import Stats from 'three/examples/jsm/libs/stats.module'
import CustomMesh from './customMesh'
import { clamp, debounce } from 'lodash-es'
class Draw {
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        antialias: true,

    })
    scene: THREE.Scene = new THREE.Scene
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    control: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    stats: Stats = new Stats()
    mixer: THREE.AnimationMixer
    clock = new THREE.Clock()
    boxSize = 20
    tick = 0
    keyControl = {
        r: false,
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    }
    keyControlMap = {
        ArrowUp: 'x',
        ArrowDown: 'x',
        ArrowLeft: 'z',
        ArrowRight: 'z',
    }
    keyControlMapValue = {
        ArrowUp: -1,
        ArrowDown: 1,
        ArrowLeft: 1,
        ArrowRight: -1,
    }
    constructor() {
        this.initRenderer()
        this.initScene()
        this.initCamera()
        this.initLight()
        this.initModel()
        this.initStats()
        this.initControl()
        this.initKeydown()
        this.initWindow()
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
        this.scene.add(new THREE.GridHelper(this.boxSize * 10))
        this.scene.add(new THREE.AxesHelper(this.boxSize * 10))
        this.addMesh()
    }

    addMesh() {
        this.createLBlock()
    }

    createCube() {

        const cubeGeomatry = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize)

        const cubeMaterials: Array<THREE.Material> = []
        for (let i = 0; i < 6; i++) {
            cubeMaterials.push(
                new THREE.MeshPhongMaterial({
                    color: 0xffffff * Math.random(),
                })
            )
        }
        const cube = new CustomMesh(cubeGeomatry, cubeMaterials)

        this.meshInitPosition(cube)
        this.scene.add(cube)
    }

    meshInitPosition(mesh) {
        mesh.position.set(
            (THREE.MathUtils.randFloatSpread(10) | 0) * this.boxSize,
            10 * this.boxSize,
            (THREE.MathUtils.randFloatSpread(10) | 0) * this.boxSize,
        )
        mesh.name = 'cube'
    }

    createLBlock() {
        const vector3List = [
            [0, 0, 0],
            [this.boxSize, 0, 0],
            [-this.boxSize, 0, 0],
            [-this.boxSize, this.boxSize, 0],
        ]
        const geometries = []
        for(const vector3 of vector3List) {
        const cellGeometry = new THREE.BoxGeometry(
            this.boxSize,
            this.boxSize,
            this.boxSize,
            )
            cellGeometry.translate(...vector3)
            geometries.push(cellGeometry)
        }
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff * Math.random(),
        })
        const lblock = new THREE.Mesh(mergeGeometries(geometries), material)
        this.meshInitPosition(lblock)
        this.scene.add(lblock)
    }

    initStats() {
        document.body.append(this.stats.dom)
    }


    initControl() {
        this.control.maxDistance = 600
        this.control.minDistance = 200

    }

    initKeydown() {
        const createSetKey = (bool: boolean) => {
            return ({ key }) => {
                console.log(key)
                if (key in this.keyControl) {
                    this.keyControl[key] = bool
                }
            }
        }
        window.addEventListener('keydown', createSetKey(true))
        window.addEventListener('keyup', createSetKey(false))
    }

    initWindow() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        })
    }

    roll(e) {
        for (const key in this.keyControlMap) {
            if (!this.keyControl[key]) continue

            e.rotation[this.keyControlMap[key]] += this.keyControlMapValue[key] * Math.PI / 2
        }
    }

    move(e) {
        for (const key in this.keyControlMap) {
            if (!this.keyControl[key]) continue

            e.position[this.keyControlMap[key]] += this.keyControlMapValue[key] * this.boxSize
            e.position[this.keyControlMap[key]] = clamp(
                e.position[this.keyControlMap[key]],
                -5 * this.boxSize,
                5 * this.boxSize,
            )
        }
    }

    debounceMove(e) {
        return debounce(() => this.move(e), 10)
    }

    render(t = 0) {
        this.renderer.render(this.scene, this.camera)
        this.scene.traverse((e) => {
            if (e.name === 'cube' && e.status !== 'finish') {
                if (this.keyControl.r) {
                    this.roll(e)
                } else {
                    this.move(e)
                }
                if (t - this.tick >= 1000) {
                    e.position.y -= this.boxSize
                    this.tick = t


                }
                if (e.position.y < 0) {
                    e.status = 'finish'
                    e.position.y = 0
                    this.addMesh()
                }
            }
        })
    }

    animate(t = 0) {
        this.render(t)
        this.stats.update()
        this.control.update()
        this.mixer?.update(this.clock.getDelta())
        requestAnimationFrame((t) => this.animate(t))
    }
}

new Draw()