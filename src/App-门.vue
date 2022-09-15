<!--<script src="main.js"></script>-->
<template>
    <div class="content">
        <div class="container" ref="container"></div>
        <div class="load" v-if="loadText!==100">
            <el-progress :width="60" type="circle" :percentage="loadText" >
                <span class="load-text">{{loadText}}%</span>
            </el-progress>

        </div>
    </div>

</template>

<script setup>
    import * as THREE from "three";
    import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
    import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
    // 导入dat.gui
    import * as dat from "dat.gui";
    import {ref, onMounted} from "vue";

    const container = ref(null);

    /**==============start 加载loading===================*/
    const loadText = ref();
    // 单张纹理图的加载
    const onLoad = function () {
        console.log("图片加载完成");
    };
    const onProgress = function (url, num, total) {
        console.log("图片加载完成:", url);
        console.log("图片加载进度:", num);
        console.log("图片总数:", total);
        let value = Number(((num / total) * 100).toFixed(2));
        console.log("加载进度的百分比：", value);
        loadText.value = value;
    };
    const onError = function (e) {
        console.log("图片加载出现错误");
        console.log(e);
    };
    // 设置加载管理器
    const loadingManager = new THREE.LoadingManager(onLoad, onProgress, onError);
    /**==============end 加载loading===================*/


    /**==============start 初始化===================*/
        // 场景
    const scene = new THREE.Scene();
    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // 设置相机位置
    camera.position.z = 3;
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    /**==============end 初始化===================*/


    /** 纹理*/
    const loader = new THREE.TextureLoader(loadingManager)
    const texture = loader.load('./imgs/door/color.jpg')
    const textureAlpha = loader.load('./imgs/door/alpha.jpg')
    const textureAo = loader.load("./imgs/door/ambientOcclusion.jpg");
    //导入置换贴图
    const doorHeightTexture = loader.load("./imgs/door/height.jpg");

    // 导入粗糙度贴图
    const roughnessTexture = loader.load("./imgs/door/roughness.jpg");
    // 导入金属贴图
    const metalnessTexture = loader.load("./imgs/door/metalness.jpg");
    // 导入法线贴图
    const normalTexture = loader.load("./imgs/door/normal.jpg");
    console.log("纹理", texture)

    // 几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
    // const geometry = new THREE.BoxBufferGeometry(1,1,1); //老版本
    /**
     * 材质
     * MeshBasicMaterial 基础的网格材质
     * MeshStandardMaterial 标准的网格材质 更逼真 渲染时间更长
     * */
        // const material = new THREE.MeshBasicMaterial({
    const material = new THREE.MeshStandardMaterial({
            color: '#ffff00',
            map: texture,
            //灰度纹理，它控制着表面的不透明度（黑色：完全透明;白:完全不透明)。
            alphaMap: textureAlpha,
            //用作环境遮挡贴图
            aoMap: textureAo,
            aoMapIntensity: 1,
            //位移贴图  网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位
            displacementMap: doorHeightTexture,
            //位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）
            displacementScale: 0.05,
            roughness: 1,
            roughnessMap: roughnessTexture,
            metalness: 1,
            metalnessMap: metalnessTexture,
            normalMap: normalTexture,


            //透明
            transparent: true,
            // opacity:0.3,
            //定义将要渲染哪一面 - 正面，背面或两者
            side: THREE.DoubleSide
        });
    //网格
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // 给cube添加第二组uv
    geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );
    /**===================================*/
    // 添加平面
    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(1.5, 0, 0);

    scene.add(plane);
    // console.log(plane);
    // 给平面设置第二组uv
    planeGeometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
    );

    /**===================================*/


    // 灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);
    //直线光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    //
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 挂载完毕之后获取dom
    onMounted(() => {
        console.log("挂载")
        //添加控制器
        const controls = new OrbitControls(camera, container.value);
        controls.enableDamping = true;
        const render = () => {
            // console.log("canvas 渲染",cube.position.x)
            // cube.rotation.y += 0.05;
            // cube.rotation.z += 0.01;
            // if(cube.position.x > 5){
            //   cube.position.x -= 0.01;
            // }
            // if(cube.position.x < 5){
            //   cube.position.x += 0.01;
            // }
            controls.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        };
        container.value.appendChild(renderer.domElement);
        render(controls);
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
        height: 100vh;
        width: 100vw;
        background-color: #f0f0f0;
        position: relative;
    }

    .load {
        width: 100%;
        height: 100%;
        position: fixed;
        right: 0;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .load .load-text{
        color: #fff;
        /*background-color: #fff;*/
        /*border-radius: 5px;*/

    }

    .container {
        width: 100%;
        height: 100%;
    }


</style>
