<template>
    <!-- padding-bottom为自定义tabBar高度，XR系列底部包括HOME健高度 -->
    <view class="index" :style="{'padding-bottom': isIphoneX ? '83px' : '49px'}">
        <!-- 页面 -->
        <home v-if="index === 0" ref="home" @switchIndex="switchIndex"/>
        <!-- 此处模拟keep-alive的效果 - 保留组件数据-->
        <mall :class="['hidden', {'visible': index === 1}]" />
        <orders v-if="index === 2" ref="orders" />
        <user v-if="index === 3" ref="user" />
        <!-- 底部导航 -->
        <tabBar @toIndex="toIndex" ref="tabBar"></tabBar>
    </view>
</template>

<script>
    import tabBar from  '@/components/tabBar'
    import { mapState } from 'vuex'
    export default {
        components:{
            tabBar,
        },
        data() {
            return {
                index: 0,
            }
        },
        computed:{
            ...mapState({
                isIphoneX: state => state.isIphoneX
            }),
        },
        methods: {
            toIndex(e){
                // index - 当前页面的索引
                this.index !== e && (this.index = e)
            },
            switchIndex(index){
                this.$refs.tabBar.toIndex(index) // 切换tabBar
            }
        },
        onLoad(query) {

        },
        onShow(){

        }
    }
</script>

<style lang="scss">
    .index,page{
        height: 100%;
        width: 100%;
        box-sizing: border-box;
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
    .hidden{
        height: 100%;
        display: none;
    }
    .visible{
        display: block!important;
    }
    .van-tabs__line{
        background-color: $theme!important;
    }
</style>
