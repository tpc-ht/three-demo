<template>
    <div class="main">
        <el-menu
                :default-active="location"
                class="el-menu-vertical-demo"
        >
            <template v-for="(item,index) in routes">
                <el-menu-item v-if="item.title" :key="index" :index="item.path"
                              @click="goPage(item.path)">
                    <el-icon>
                        <icon-menu/>
                    </el-icon>
                    <template #title>{{item.title}}</template>
                </el-menu-item>
            </template>
        </el-menu>
        <div class="content">
            <router-view/>
        </div>
    </div>


</template>

<script setup>
    import {ref} from 'vue'
    import {
        Document,
        Menu as IconMenu,
        Location,
        Setting,
    } from '@element-plus/icons-vue'
    import router from "@/router";

    console.log("this", router)
    const isCollapse = ref(true)
    const routes = ref(router.options.routes)
    const location = ref(router.options.history.location)
    const handleOpen = (key, keyPath) => {
        console.log(key, keyPath)
    }
    const goPage = (path) => {
        router.push({path})
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    html body #app {

        height: 100vh;
        width: 100%;
    }
</style>
<style scoped>
    .el-menu-vertical-demo {
        flex-shrink: 0;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        /*min-height: 400px;*/
    }

    .main {
        display: flex;
        height: 100%;
        width: 100%;
    }

    .main > .content {
        flex: 1;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        height: 100%;
        width: 100%;

    }
</style>
