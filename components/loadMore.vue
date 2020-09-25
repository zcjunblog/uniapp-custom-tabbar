<template>
  <div :class="{'nothingLoad' : empty}">
    <div class="loading" :class="{stretch: stretch}">
      <div class="container" v-if="loading && list.length !== 0">
        <van-loading type="spinner" size="20px" color="#4E6EF2" />
        <span>　加载中</span>
      </div>
    </div>
    <div class="load-over" v-if="loadOver">
      ────　没有更多数据了　────
    </div>
    <div class="empty-tip"
         :style="{'height': (height || 40) + 'vh'}"
         v-if="empty"
    >
      <div class="icon"><span class="iconfont icon">&#xe869;</span></div>
      <div class="tip">{{text || '暂无相关数据哦~'}}</div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['list', 'total', 'loading', 'height', 'text'],
    computed: {
      loadOver () {
        return this.list.length === this.total && this.total !== 0
      },
      empty () {
        return this.list.length === 0 && !this.loading
      },
      stretch () {
        return this.empty || this.loadOver ? false : true
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .loading {
    &.stretch {
      height: 60px;
    }
    .container {
      padding-top: 15px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      font-size: 13px;
      color: $theme;
    }
  }
  .load-over {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: $theme;
    font-size: 13px;
  }
  .empty-tip {
    display: flex;
    justify-content: flex-end;
    color: #888888;
    flex-direction: column;
    font-size: $font-size;
    text-align: center;
    .icon{
      color: rgba( #888888, 0.45);
      font-size: 180rpx;
    }
    .tip{
      padding-top: 10rpx;
    }
  }
  .nothingLoad{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
  }
</style>

