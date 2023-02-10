// import { rejects } from "assert"
// import { error } from "console"
// import { resolve } from "path/win32"

function request({url,data,method="GET",contentType=1}){
  let header={
    'content-type':contentType===1?'application/json':'application/x-www-form-urlencoded'
  }
  let baseUrl='http://music.cpengx.cn'
  // debugger
  return new Promise((resolve,reject)=>{
    uni.request({
      url:baseUrl+url,
      data,
      method,
      header,
      success: (res) => {
        if(res.statusCode===200){
          resolve(res.data)
          // debugger
        }else {
          uni.showToast({
            icon:'none',
            title:"请求错误"+res.statusCode,
            duration:1500
          })
      }
    },
    fail:(err)=>{
      console.log("err",err)
      uni.showToast({
        icon:'none',
        title:err.errMsg,
        duration:1500
      })
      reject(err)
    }
    })
  })
}
export default {request}