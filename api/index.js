import request from './http'
import store from '@/stores'
import appConfig from '@/utils/appConfig'

const urls = {
  base: {
    'onLogin': ['post', 'api/weChatManagement/miniPrograms/login/login'],
    'refreshAccessToken': ['post', 'api/weChatManagement/miniPrograms/login/refresh'],
    'authorizePc': ['post', 'api/weChatManagement/miniPrograms/login/authorizePc'],
    'configuration': ['get', 'api/abp/application-configuration'],
    'preUploadImage': 'api/fileManagement/file/many',
  },
  profile: {
    'profile': ['get', 'api/identity/my-profile'],
    'wxBindPhone': ['post', 'api/weChatManagement/miniPrograms/profile/bindPhoneNumber'],
    'verifyToken': ['post', 'api/app/profile/bindPhoneNumberVerifyToken'],
    'sendToken': ['post', 'api/app/profile/bindPhoneNumberSendToken'],
    'setEmail': ['post', 'api/app/profile/setEmailAddress'],
  },
  store: {
    'default': ['get', 'api/eShop/stores/store/default']
  },
  order: {
    'order': ['post', 'api/eShop/orders/order'],
    'check': ['get', 'api/eShop/orders/order/{id}']
  },
  category: {
    'list': ['get', 'api/app/category/withDentureProducts/{storeId}']
  },
  product: {
    'list': ['get', 'api/eShop/products/product'],
    'detail': ['get', 'api/eShop/products/product/{id}']
  },
  dentureOrder: {
    'list': ['get', 'api/app/dentureOrder'],
    'detail': ['get', 'api/app/dentureOrder/{id}'],
  },
  designJob: {
    'list': ['get', 'api/app/designJob'],
    'detail': ['get', 'api/app/designJob/{id}'],
    'accept': ['post', 'api/app/designJob/accept/{designJobId}']
  },
  payment:{
    'payment': ['post', 'api/eShop/payments/payment'],
    'pay': ['post', 'api/paymentService/payment/{id}/pay'],
    'check': ['get', 'api/paymentService/payment/{id}'],
    'cancel': ['post', 'api/paymentService/payment/{id}/cancel'],
    'detail': ['get', 'api/paymentService/payment/{id}']
  },
  weChatPay:{
    'getJsSdkWeChatPayParameters': ['get', 'wechat-pay/js-sdk-config-parameters']
  },
  manufacturer: {
    'list': ['get', 'api/app/manufacturer']
  },
  manufacturerUser: {
    'setFavorite': ['post', 'api/app/manufacturerUser/setFavorite']
  },
  designModel: {
    'list': ['get', 'api/app/designModel']
  },
  colorCode: {
    'list': ['get', 'api/app/colorCode'],
    'detail': ['get', 'api/app/colorCode/{id}'],
  },
  dentureOrderCustomerRemark: {
    'remark': ['post', 'api/app/dentureOrderCustomerRemark'],
    'detail': ['get', 'api/app/dentureOrderCustomerRemark'],
  },
  dentureOrderRemarkFile: {
    'dailyDirectory': ['get', 'api/app/dentureOrderRemarkFile/dailyDirectory'],
  },
  account: {
    'list': ['get', 'api/paymentService/prepayment/account'],
    'detail': ['get', 'api/paymentService/prepayment/account/{id}'],
    'topUp': ['post', 'api/paymentService/prepayment/account/{id}/topUp'],
    'withdraw': ['post', 'api/paymentService/prepayment/account/{id}/withdraw'],
  },
  transaction: {
    'list': ['get', 'api/paymentService/prepayment/transaction'],
  },
  scanModel: {
    'list': ['get', 'api/app/scanModel'],
    'delete': ['delete', 'api/app/scanModel/{id}'],
    'assign': ['post', 'api/app/scanModel/{id}/assign'],
  },
}

const apiHandle = (api) => {
  const parsed = api.split('.', 2)
  parsed[1] = parsed[1] || parsed[0]

  const arr = urls[parsed[0]][parsed[1]]
  return { method: arr[0], url: arr[1] }
}

const parseUrl = (url, params) => {
  const arr = url.match(/\{.+?\}/g)
  if (arr && arr.length > 0) {
    arr.forEach(item => {
      const str = /\{(.+?)\}/.exec(item)[1]
      url = url.replace(item, params[`__${str}`])
      delete params[`__${str}`]
    })
  }
  return {url, params}
}

const fetch = (api, params = null, config = {}) => {
  let {method, url} = apiHandle(api)
  const result = parseUrl(url, params)
  url = result.url
  params = result.params

  return request(method, url, params, config)
}

const uploadFile = (filePath, dailyDirectoryId) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: appConfig.baseUrl + urls.base.preUploadImage,
      filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${store.state.tokens.access}`
      },
      formData: {
        fileType: 2,
        ParentId: dailyDirectoryId,
        fileContainerName: 'DentureOrderRemark'
      },
      success (res) {
        resolve(res)
      },
      fail (res) {
        reject(res)
      }
    })
  })
}

export { uploadFile }
export default fetch
