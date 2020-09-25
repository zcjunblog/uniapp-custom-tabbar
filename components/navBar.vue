<template>
	<div v-if="config.show" :style="{'height':statusBarHeight}" class="zindex10">
		<div class="navbar fixed" :class="{'border': config.border}"
		:style="{'height':statusBarHeight,'background-color':config.backgroundColor,'color':config.color}">
			<div class="navbar_title">
				{{config.title}}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: '50px;'
		};
	},
	props:{
		config: {
		  type: Object,
		  default: {
			  title: '义齿＋',
			  backgroundColor: '#fff',
			  border: true,
			  color: '#000',
			  show: false
		  }
		}
	},
	mounted() {
		var statusBarHeight = uni.getSystemInfoSync().statusBarHeight+46;
		this.statusBarHeight = statusBarHeight+'px';
	}
}
</script>

<style>
	.navbar{
		width: 100%;
	}
	.navbar_title{
		width: 50%;
		float: left;
		text-align: left;
		height: 100%;
		padding-left: 25rpx;
		font-size: 34rpx;
		font-weight: bold;
	}
	.border{
		border-bottom: 1px solid #F3F3F3;
	}
	.fixed{
		position: fixed;
		left: 0;
		right: 0;
	}
	.zindex10{
		z-index: 10;
	}

</style>
