// 云函数入口文件
const cloud = require('wx-server-sdk')
const { WXMINIUser, WXMINIMessage } = require('wx-js-utils')
const appId = 'wx829a0deebffce76f'
const secret = 'bad8710b401a826388bfcf4a01e71935'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let WXMINUserObj = new WXMINIUser({
    appId,
    secret
  })
  let access_token = await WXMINUserObj.getAccessToken();
  const touser = 'or1xG42vsgIovbgQPou7PoMicSJ0'
  const form_id = event.formId
  console.log(form_id);
  const template_id = 'zyfKF5cSYBPkfe0ZB8Vexl02k95usBvOhJNDfoQiC98'

  let wXMINIMessage = new WXMINIMessage();
  let result = await wXMINIMessage.sendMessage({
    access_token,
    touser,
    form_id,
    template_id,
    data: {
      keyword1: {
        value: '' // keyword1 的值
      },
      keyword2: {
        value: '' // keyword2 的值
      }
    },
    page: 'pages/index/index' // 点击模板消息后，跳转的页面
  });
  
  return result
}