import api from '@/api'
import store from '@/stores'
import method from './method'
import appConfig from '@/utils/appConfig'

const localStorageNames = ['user', 'tokens', 'enumDict', 'configuration', 'customerUserInfo']
const loginPageUrl = '/pages/login/index'

const tools = {
    // 合并method
    ...method,

    // tools方法正文↓
    jump: (url) => {
        url && uni.navigateTo({
            url: url
        })
    },

    userClickToLogin() {
        // 用户点击去登录可保留refresh token
        this.jump(`${loginPageUrl}`)
    },

    alertNeedLogin() {
        this.alert({
            content: '请先登录',
            showCancel: false,
            confirmText: '去登录',
            success: (res) => {
                if (res.confirm) {
                    this.jump('/pages/login/index')
                }
            }
        })
    },

    toLogin() {
        // 清空tokens缓存
        this.setStorage('tokens', {})
        // 更新缓存值到vuex
        this.updateStoreFromStorage()
        // 跳转到登录页
        uni.redirectTo({
            url: loginPageUrl
        })
    },

    isLogin() {
        return Boolean(store.state.tokens.access)
    },

    goIndex() {
        uni.switchTab({
            url: '/pages/index/index' // 首页
        })
    },

    // token持久化
    setTokens(tokens){
        this.setStorage('tokens', {
            access: tokens.access_token,
            refresh: tokens.refresh_token,
        })
    },

    isIphoneX(){
        uni.getSystemInfo({
            success: (res)=> {
                this.setStorage('isIphoneX', res.model.search('iPhone X') !== -1)
            }
        })
    },


    // 查询用户信息
    getMyProfile() {
        return new Promise((resolve, reject) => {
            api('profile.profile',null,{isEndLoading: false})
                .then(res => {
                    this.setStorage('user', res)
                    resolve(res)
                })
                .catch(e => {
                    console.log(e)
                })
        })
    },

    getConfiguration() {
        api('base.configuration', null , {isEndLoading: false})
            .then(res => {
                this.setStorage('configuration', res)
            })
            .catch(e => {
                console.log(e)
            })
    },

    getEnumDictionary() {
      // 备用
    },

    formatLargeString: (str, maxLength) => {
        return str.length <= maxLength ? str : str.substring(0, maxLength - 1) + '...'
    },

    // 如果后端时间已经是北京时间无需再转时区则直接修改格式显示
    formatTimeNotChange(time){
        return time ? time.split('.')[0].replace(/T/g,' ') : ''
    },

    displayOrderSort (arr) {
        return this.sortArrayByColumn(arr, 'displayOrder', true)
    },

    sortArrayByColumn (arr, columnName, isDesc = false) {
        arr.sort(function (columnName, isDesc) {
            let flag = (isDesc) ? -1 : 1
            return function (a, b) {
                a = a[columnName]
                b = b[columnName]
                if (a < b) {
                    return flag * -1
                }
                if (a > b) {
                    return flag * 1
                }
                return 0
            }
        }(columnName, isDesc))
    },

    getRect(selector, all, that = wx) { // that参数：在自定义组件中，需传入this替代wx,否则拿不到dom元素
        return new Promise(resolve => {
            that.createSelectorQuery()[all ? 'selectAll' : 'select'](selector)
                .boundingClientRect(rect => {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect)
                    }
                    if (!all && rect) {
                        resolve(rect)
                    }
                })
                .exec()
        })
    },

    /* 获取当前页带参数的url */
    splicePageUrlWithParams(obj) {
        const path = obj.route
        const query = obj.options
        // 拼接url的参数
        var urlWithParams = '/' + path + '?'
        for (let key in query) {
            const value = query[key]
            urlWithParams += key + '=' + value + '&'
        }
        urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1)
        return urlWithParams
    },

    alert(config) {
        uni.showModal({
            title: '提示',
            confirmColor: '#4E6EF2',
            ...config
        })
    },

    toast(config) {
        uni.showToast({
            icon: 'none',
            ...config
        })
    },

    pageScrollTo(config) {
        config === 'top' && (config = {scrollTop: 0, duration: 0})
        uni.pageScrollTo(config)
    },

    updateStoreFromStorage() {
        localStorageNames.forEach(dataName => {
            const data = uni.getStorageSync(dataName)
            if (Object.keys(data).length) {
                store.commit('setData', {dataName, data})
            } else {
                store.commit('setData', {dataName, data: {}})
            }
        })
        const curRole = uni.getStorageSync('curRole')
        if(curRole){
            store.commit('setData', {dataName:'curRole', data: curRole})
        }
    },

    checkAppEnv() {
        const appStorageEnv = uni.getStorageSync('appEnv')
        if (!appStorageEnv || appStorageEnv !== appConfig.env) {
            localStorageNames.forEach(dataName => {
                this.setStorage(dataName, {})
            })
        }
        if (appStorageEnv !== appConfig.env) {
            uni.setStorageSync('appEnv', appConfig.env)
        }
    },

    deepClone(data) {
        return JSON.parse(JSON.stringify(data))
    },

    setStorage(key, data, sync = true) {
        if (sync) {
            uni.setStorageSync(key, data)
            store.commit('setData', {dataName: key, data: data})
        } else {
            return new Promise((resolve, reject) => {
                uni.setStorage({
                    key,
                    data,
                    success() {
                        store.commit('setData', {dataName: key, data: data})
                        resolve()
                    },
                    fail: e => {
                        this.toast({title: `set ${key} storage fail`})
                        reject(e)
                    }
                })
            })
        }
    },

    // 记录onLaunch时的path和query，防止onLaunch中调用的接口
    // 报401后重定向至登录页导致最初页面记录丢失，从而在getCurrentPages中拿不到lastPage
    recordLaunchPageUrl(launch) {
        const pageUrl = this.splicePageUrlWithParams({
            route: launch.path,
            options: launch.query
        })
        store.commit('setData', {
            dataName: 'launchPageUrl',
            data: pageUrl
        })
    },

    /**
    *订单状态筛选
    待上传：scanModelUploadedTime 为空
    设计中：scanModelUploadedTime 不为空，且 designCompletionTime 为空
    待验收：designCompletionTime 不为空，且 designAcceptedTime 为空
    待支付：designAcceptedTime 不为空，且 paidTime 为空
    待下载：paidTime 不为空，且 designModelDownloadedTime  为空
    已完成：designModelDownloadedTime 不为空
     */
    orderStatus(orderData){
        if(orderData.designModelDownloadedTime){
            return '已完成'
        }
        if(orderData.paidTime){
            return '待下载'
        }
        if(orderData.designAcceptedTime){
            return '待支付'
        }
        if(orderData.designCompletionTime){
            return '待验收'
        }
        if(orderData.scanModelUploadedTime){
            return '设计中'
        }
        if(!orderData.scanModelUploadedTime){
            return '待上传'
        }
    },

    /**
     * @param {number} lastIndex 路由数组中从尾部(1)开始数，要获取的路由所在的位置
     * @param {boolean} withParams 返回的Url是否携带params
     * @returns {string}
     */
    getPageUrl(lastIndex, withParams = true) {
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages()
        if (pages.length > 0 && pages.length >= lastIndex) {
            const thePage = pages.splice(-lastIndex, 1)[0]
            if (withParams) {
                return this.splicePageUrlWithParams(thePage)
            } else {
                return `/${thePage.route}`
            }
        } else {
            console.log('pages are empty or lastIndex error')
            return ''
        }
    },
    //scene格式处理
    sceneConvertToGuid(str) {
        return [str.slice(0, 8), str.slice(8, 12), str.slice(12, 16), str.slice(16, 20), str.slice(20)].join('-');
    },

    /**
     * @description: 检测小程序更新的函数
     */
    updateApp() {
        if (uni.canIUse('getUpdateManager')) {
            const updateManager = uni.getUpdateManager()
            updateManager.onCheckForUpdate((res) => {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        this.alert({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        // 新的版本下载失败
                        this.alert({
                            title: '更新提示',
                            content: '新版本已经上线啦！请退出小程序重新进入',
                            showCancel: false,
                            confirmText: '知道了'
                        })
                    })
                }
            })
        }
    }
}

export default tools
