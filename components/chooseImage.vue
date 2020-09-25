<template>
    <div class="choose-img">
        <div class="img-main" v-for="(url, key) in images" :key="key">
            <image
                    class="pic"
                    mode="aspectFill"
                    :src="url"
                    @click="previewImage(url)"
            >
            </image>
            <div class="del" @click="deleteImg(key)">
                <van-icon size="12px"
                          custom-style="display:block"
                          color="#fff" name="cross"
                />
            </div>
        </div>
        <div class="choose-btn" @click="chooseImgs" v-if="images.length < 4">
            <van-icon size="25px" color="#4E6EF2" name="photo-o"/>
            <div>选择图片</div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['images'],
        data() {
            return {}
        },
        computed: {},
        methods: {
            chooseImgs() {
                wx.chooseImage({
                    count: 4 - this.images.length,
                    sizeType: ['original', 'compressed'],
                    success: (res) => {
                        const reg = /.jpg$|.png/
                        for(let i =0; i < res.tempFilePaths.length; i++){
                            if(!res.tempFilePaths[i].match(reg)){
                                return this.$tools.toast({title:'检测到不支持的图片类型,请重新上传!',duration: 3000})
                            }
                        }
                        const arr = [...this.images]
                        arr.push(...res.tempFilePaths)
                        this.$emit('change', arr)
                    }
                })
            },
            deleteImg(key) {
                const arr = [...this.images]
                arr.splice(key, 1)
                this.$emit('change', arr)
            },
            previewImage(url) {
                wx.previewImage({
                    current: url,
                    urls: this.images
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .choose-img {
        display: flex;
        flex-wrap: nowrap;
    }

    @mixin block-style {
        width: 15vmin;
        height: 15vmin;
        border-radius: 6rpx;
        margin: 6rpx 12rpx 12rpx 6rpx;
    }

    .img-main {
        @include block-style;
        position: relative;
        .pic {
            width: 100%;
            height: 100%;
            display: block;
        }

        .del {
            position: absolute;
            top: -12rpx;
            right: -12rpx;
            width: 32rpx;
            height: 32rpx;
            border-radius: 16rpx;
            background-color: rgba(0, 0, 0, .5);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .choose-btn {
        @include block-style;
        box-shadow: 0 0 0 2rpx $theme;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 22rpx;
        color: $theme;
        &:first-child{
            margin-left: 0!important;
        }
    }
</style>

