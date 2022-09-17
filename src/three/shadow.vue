<!--<script src="main.js"></script>-->
<template>
    <div class="content">
        <div class="content-main" ref="mainDom">
            <div class="container" ref="container"></div>
        </div>
    </div>

</template>

<script setup>
    import * as THREE from "three";
    import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
    import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
    // 导入dat.gui
    import * as dat from "dat.gui";
    import {ref, onMounted, nextTick} from "vue";

    // 目标：灯光与阴影
    // 灯光阴影
    // 1、材质要满足能够对光照有反应
    // 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
    // 3、设置光照投射阴影 directionalLight.castShadow = true;
    // 4、设置物体投射阴影 sphere.castShadow = true;
    // 5、设置物体接收阴影 plane.receiveShadow = true;

    const gui = new dat.GUI();

    const container = ref(null);
    const mainDom = ref(null);
    /**==============start 初始化===================*/
        // 场景
    const scene = new THREE.Scene()
    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // 设置相机位置
    camera.position.set(0, 0, 10);
    // 坐标辅助器
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    /**==============end 初始化===================*/
    /**==============start 几何体===================*/
        // 球体
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshStandardMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, material);
    // 投射阴影
    sphere.castShadow = true;
    scene.add(sphere);

    // 创建平面
    const planeGeometry = new THREE.PlaneBufferGeometry(50, 50);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    // 接收阴影
    plane.receiveShadow = true;
    scene.add(plane);

    /**==============end 几何体===================*/

    /**==============start 环境光===================*/
        // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);
    //直线光源
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(5, 5, 5);
    // directionalLight.castShadow = true;
    // // 设置阴影贴图模糊度
    // directionalLight.shadow.radius = 20;
    // // 设置阴影贴图的分辨率
    // directionalLight.shadow.mapSize.set(4096, 4096);
    // // console.log(directionalLight.shadow);
    //
    // // 设置平行光投射相机的属性
    // directionalLight.shadow.camera.near = 0.5;
    // directionalLight.shadow.camera.far = 500;
    // directionalLight.shadow.camera.top = 5;
    // directionalLight.shadow.camera.bottom = -5;
    // directionalLight.shadow.camera.left = -5;
    // directionalLight.shadow.camera.right = 5;
    // scene.add(directionalLight);
    //
    // gui.add(directionalLight.shadow.camera, "near")
    //     .min(0)
    //     .max(10)
    //     .step(0.1)
    //     .onChange(() => {
    //         directionalLight.shadow.camera.updateProjectionMatrix();
    //     });

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 5, 5);
    spotLight.castShadow = true;
    spotLight.intensity = 2;

    // 设置阴影贴图模糊度
    spotLight.shadow.radius = 20;
    // 设置阴影贴图的分辨率
    spotLight.shadow.mapSize.set(512, 512);

    // console.log(directionalLight.shadow);
    spotLight.target = sphere;
    spotLight.angle = Math.PI / 6;
    spotLight.distance = 0;
    spotLight.penumbra = 0;
    spotLight.decay = 0;

    // 设置透视相机的属性

    scene.add(spotLight);
    gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
    gui
        .add(spotLight, "angle")
        .min(0)
        .max(Math.PI / 2)
        .step(0.01);
    gui.add(spotLight, "distance").min(0).max(10).step(0.01);
    gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
    gui.add(spotLight, "decay").min(0).max(5).step(0.01);
    /**==============end 环境光===================*/

    const setScene = () => {
        // 初始化渲染器
        const renderer = new THREE.WebGLRenderer();
        // 开启场景中的阴影贴图
        renderer.shadowMap.enabled = true;
        renderer.physicallyCorrectLights = true;
        // 创建轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
        controls.enableDamping = true;
        const render = () => {
            controls.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        };

        window.addEventListener('resize', () => {
            const {clientWidth, clientHeight} = mainDom.value
            // 更新摄像头
            camera.aspect = window.innerWidth / window.innerHeight;
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
            //   更新渲染器
            renderer.setSize(clientWidth, clientHeight);
        });
        nextTick(() => {
            const {clientWidth, clientHeight} = mainDom.value
            renderer.setSize(clientWidth, clientHeight);
            container.value.appendChild(renderer.domElement);
            render()
        })

    }

    // 挂载完毕之后获取dom
    onMounted(() => {
        setScene()
    });
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

</style>

<style scoped>

    .content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: #f0f0f0;
    }

    .content-tab {
        background-color: #fff;
        flex-shrink: 0;
    }

    .content-tab /deep/ .el-tabs__header {
        margin: 0;
    }

    .content-main {
        flex: 1;
        position: relative;
    }

    .load {
        width: 100%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 1);
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .load .load-text {
        color: #fff;
        /*background-color: #fff;*/
        /*border-radius: 5px;*/

    }

    .container {
        /*width: 100%;*/
        /*height: 100%;*/
    }


</style>
