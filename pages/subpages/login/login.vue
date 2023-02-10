<template>
  <view>
    <view class="login-form">
      <input type="text" class="input-row" v-model="account" maxlength="11" placeholder="请输入账号"/>
      <input type="password" class="input-row" v-model="password" maxlength="11" placeholder="请输入密码"/>
      <button type="button" class="btn login-btn" @click="login">登录</button>
      <view class="bot flex-box">
        <navigator class="sign" hover-class="none">立即注册</navigator>
        <navigator class="forget" hover-class="none">忘记密码</navigator>
      </view>
    </view>
  </view>
</template>

<script>
  	import {mapState, mapMutations} from 'vuex'
  	import {apiLogin} from '@/api/index.js'
      import {users} from '@/apilogin/user.js'
  export default {
    data() {
      return {
        account:'',
        password:''
      }
    },
    onLoad() {
    this.login()
    },
    methods: {
              ...mapMutations(['storeLogin']),
      async login(){
        
        // if(!this.account){
        //   uni.showToast({
        //     icon:"none",
        //     title:'请输入账号！'
        //   })
        //   return false
        // }
        // if(!this.password){
        //   uni.showModal({
        //     content:'请输入密码！',
        //     showCancel:false
        //   })
        //   return false
        // }
        // // 去掉两边的空格
        // const account=this.account.trim()
        // const password=this.password.trim()
        // //检查密码长度
        // if(password.length<6){
        //   this.alert('密码最短为6个字符')
        //   return false
        // }
        // //检查完毕，登录中
        // uni.showLoading({
        //   title:'登录中...'
        // })
        // //调用接口
        // const params={
        //   phone:account,
        //   password:password
        // }


        await users().then(res=>{
          console.log(res);
          const temp={
            token:res.data.token,
            profile:res.data.avatarUrl
          }
          this.storeLogin(temp)
          // 跳转
          uni.switchTab({
            url:'/pages/index/index'
          })
        })
        // console.log('触发了')
        // try{
        // 		const res = await users()
        // 		console.log('res',res)
        // }catch(e){
        // 	console.log('catch',e)
        // 	//TODO handle the exception
        // }
        console.log('触发了')
        // uni.request({
        //     url: ' http://localhost:3001/list', //仅为示例，并非真实接口地址。
        //     method:'GET',
        //     // data: {
        //     //     // text: 'uni.request'
        //     //     phone:account,
        //     //     password:password
        //     // },
        //     // header: {
        //     //     "content-type": "application/x-www-form-urlencoded"
        //     // },
        //     // header: {},设置请求的 header 默认是application/json
        //     success: (res) => {
        //         console.log(res.data);
                // this.text = 'request success';
                // const temp={
                //   token:res.data.account.token,
                //   profile:res.data.profile
                // }
                // console.log(temp);
                // 跳转
                // uni.switchTab({
                //   url:'/pages/index/index'
                // })
        //     }
        // });

      }
    }
  }
</script>

<style lang="scss">
.input-row {
	width: 600rpx;
	height: 75rpx;
	margin: 0 auto;
	border: 1px solid #E04B28;
	color: #6c6c6c;
	border-radius: 75rpx;
	padding: 0 50rpx;
	line-height: 75rpx;
	margin-bottom: 45rpx;
	font-size: 26rpx;
}

.login-form {
	padding-top: 220rpx;
}
.login-btn {
	width: 600rpx;
	height: 75rpx;
	margin: 0 auto;
	border: 1px solid #E04B28;
	border-radius: 75rpx;
	padding: 0 50rpx;
	line-height: 75rpx;
	margin-bottom: 45rpx;
	font-size: 26rpx;
	color: #fff;
	background: #E04B28;
}
.bot {
	width: 600rpx;
	padding: 0 17rpx;
	font-size: 26rpx;
	margin: 0 auto;
	justify-content: space-between;
}
.sign {
	color: #E04B28;
}
.auth-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: absolute;
	bottom: 100rpx;
	left: 0;
	width: 100%;
	.auth-image {
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
		overflow:hidden;
	}
	.img {
		width: 30px;
		height: 30px;
		margin: 10px;
	}
	input{
		outline:none;
		border:none;
		list-style: none;
	}
}
.log-btn{
	margin:0;
	padding:0;
	background: #fff!important;
	height:48px;
	&::after{
		background-color:transparent;
		margin:0;
		padding:0;
		border:0;
	}
}
</style>

