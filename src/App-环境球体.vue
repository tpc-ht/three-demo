<!--<script src="main.js"></script>-->
<template>
    <div class="content">
        <el-tabs class="content-tab" v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="场景1" :name="0"></el-tab-pane>
            <el-tab-pane label="场景2" :name="1"></el-tab-pane>
            <el-tab-pane label="场景3" :name="2"></el-tab-pane>
            <el-tab-pane label="场景4" :name="3"></el-tab-pane>
            <el-tab-pane label="场景5" :name="4"></el-tab-pane>
        </el-tabs>
        <div class="content-main" ref="mainDom">
            <div class="container" ref="container"></div>
            <div class="load" v-if="loadText!==100">
                <el-progress :width="60" type="circle" :percentage="loadText" >
                    <span class="load-text">{{loadText}}%</span>
                </el-progress>
            </div>
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
    const container = ref(null);
    /**==============start 加载loading===================*/

    const activeName = ref(0);
    const loadText = ref();
    const mainDom = ref();


    // 单张纹理图的加载
    const onLoad = function () {
        console.log("图片加载完成");
    };
    const onProgress = function (url, num, total) {
        let value = Number(((num / total) * 100).toFixed(2));
        if(value===100){
            value=99
            setTimeout(()=>{
                loadText.value = 100
            },1000)
        }
        loadText.value = value;
    };
    const onError = function (e) {
        console.log(e);
    };
    // 设置加载管理器
    const loadingManager = new THREE.LoadingManager(onLoad, onProgress, onError);
    /**==============end 加载loading===================*/
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
    camera.position.z = 5;
    // scene.add(camera)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    /**==============end 初始化===================*/

    // 几何体
    const sphereGeometry = new THREE.SphereGeometry(1, 20,20);
    const material = new THREE.MeshStandardMaterial({
        metalness: 0.7,
        roughness: 0.1,
    });
    const sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    // 灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);
    //直线光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);



    const setScene = (type = 0) => {
        if(container.value.lastChild){
            container.value.removeChild(container.value.lastChild);
        }
        loadText.value = 0
        // 初始化渲染器
        const renderer = new THREE.WebGLRenderer();

        if([0,1,2,3].includes(type)){
            // 设置cube纹理加载器
            const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
            const envMapTexture = cubeTextureLoader.load([
                `imgs/environmentMaps/${type}/px.jpg`,
                `imgs/environmentMaps/${type}/nx.jpg`,
                `imgs/environmentMaps/${type}/py.jpg`,
                `imgs/environmentMaps/${type}/ny.jpg`,
                `imgs/environmentMaps/${type}/pz.jpg`,
                `imgs/environmentMaps/${type}/nz.jpg`,
            ]);
            // 给场景添加背景
            scene.background = envMapTexture;
            // 给场景所有的物体添加默认的环境贴图
            scene.environment = envMapTexture;
        }else{
            // 目标：设置环境纹理
            // 加载hdr环境图
            const rgbeLoader = new RGBELoader(loadingManager);
            rgbeLoader.loadAsync("imgs/hdr/002.hdr").then((texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            });
        }

        // 创建轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
        controls.enableDamping = true;

        const render = () => {
            controls.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        };

        window.addEventListener('resize', ()=>{
            const {clientWidth,clientHeight} = mainDom.value
            // 更新摄像头
            camera.aspect = window.innerWidth / window.innerHeight;
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
            //   更新渲染器
            renderer.setSize(clientWidth,clientHeight);
        });
        nextTick(()=>{
            console.log("mainDom.value",mainDom)
            const {clientWidth,clientHeight} = mainDom.value
            renderer.setSize(clientWidth, clientHeight);
            container.value.appendChild(renderer.domElement);
            render()
        })

    }

    const tabClick=(tab)=>{
        setScene(tab.props.name)
    }




    // 挂载完毕之后获取dom
    onMounted(() => {
        // render(controls);
        setScene(activeName.value)
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
        display: flex;
        flex-direction: column;
        background-color: #f0f0f0;
    }
    .content-tab{
        background-color: #fff;
        flex-shrink: 0;
    }
    .content-tab /deep/ .el-tabs__header{
        margin:0;
    }
    .content-main{
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
        background-color: rgba(0,0,0,1);
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
        /*width: 100%;*/
        /*height: 100%;*/
    }


</style>
