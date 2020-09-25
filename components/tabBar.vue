<template>
    <view class="bottom">
        <view class="nav-box">
            <view class="nav-tab" :class="{'nav-tab-active':home===0}" @click="toIndex(0)">
                <view class="nav-icon">
                    <image class="active" src="../static/tabs/home-active.png"></image>
                    <image class="normal" src="../static/tabs/home.png"></image>
                </view>
                <view class="nav-text">
                    首页
                </view>
            </view>
            <view class="nav-tab" :class="{'nav-tab-active':home===1}" @click="toIndex(1)" v-if="curRole === 'dentist'">
                <view class="nav-icon" >
                    <image class="active" src="../static/tabs/cart-active.png"></image>
                    <image class="normal" src="../static/tabs/cart.png"></image>
                </view>
                <view class="nav-text">
                    下单
                </view>
            </view>
            <view class="nav-tab" :class="{'nav-tab-active':home===2}" @click="toIndex(2)">
                <view class="nav-icon" >
                    <image class="active" src="../static/tabs/order-active.png"></image>
                    <image class="normal" src="../static/tabs/order.png"></image>
                </view>
                <view class="nav-text">
                    {{curRole === 'dentist' ? '订单' : '任务'}}
                </view>
            </view>
            <view class="nav-tab" :class="{'nav-tab-active':home===3}" @click="toIndex(3)">
                <view class="nav-icon" >
                    <image class="active" src="../static/tabs/user-active.png"></image>
                    <image class="normal" src="../static/tabs/user.png"></image>
                </view>
                <view class="nav-text">
                    我的
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        components: {},
        data() {
            return {
                home: 0,
            }
        },
        onLoad() {

        },
        computed: {
            ...mapState({
                curRole: state => state.curRole
            }),
        },
        methods: {
            toIndex(index) {
                this.$emit('toIndex', index)
                this.home = index
            }
        }
    }
</script>

<style scoped lang="scss">
    $dominantHue:$theme;//主色调 蓝
    $mediumGrey: $gray;//副文字颜色  中灰
    $navHeight:49px; //导航栏高度
    $navBoxHeight:34px; //导航栏盒子高度，XR系列底部HOME健
    .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: $navHeight;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        /*    box-shadow: 0 -2px 1px rgba(0, 0, 0, 0.06);*/
        background: #fff;
        z-index: 10;
    }

    .nav-tab {
        flex: 1;
        text-align: center;
        width: 100%;
        height: $navHeight;
    }

    .nav-icon {
        height: 30px;
        color: $mediumGrey;
        box-sizing:border-box;
        padding: 6px 0 4px 0;
    }

    .nav-icon .iconfont {
        font-size: 20px;
    }

    .nav-text {
        font-size: 11px;
        height: 19px;
        color: $mediumGrey;
        font-weight: 400;
    }
    .normal,.active{
        width: 24px;
        height: 24px;
    }
    .active{
        display: none;
    }
    .nav-tab-active .normal {
        display: none;
    }
    .nav-tab-active .active{
        display: inline-block;
    }

    .nav-tab-active .iconfont {
        /*color: #fff;*/
    }

    .nav-tab-active .nav-text{
        color: $dominantHue;
    }
    .nav-box{
        /* position: absolute; */
        display: flex;
        width: 100%;
        box-sizing:border-box;
    }

    /*苹果x适配*/
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        .bottom {
            height: $navHeight + $navBoxHeight;
        }
    }

    /*苹果xs适配*/
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
        .bottom {
            height: $navHeight + $navBoxHeight;
        }
    }

    /*苹果xr适配*/
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
        .bottom {
            height: $navHeight + $navBoxHeight;
        }
    }

</style>
