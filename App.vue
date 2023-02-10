<script>
  var VConsole=require('./common/vconsole.min.js')
  import {mapMutations} from 'vuex'
	export default {
    mounted() {
      //启动调试器
      // var vConsole=new VConsole()
    },
    //程序启动时调用
		onLaunch: function() {
			// console.log('App Launch')
      uni.getStorage({
        key:'userInfo',
        success: (res) => {
          // console.log(res);
          //将用户信息保存到vuex ， 反序列化
          this.storeLogin(JSON.parse(res.data))
        }
      })
      
		},
    methods:{
      ...mapMutations(['storeLogin','storeLeaveTime'])
    },
    //当程序显示出来
		onShow: function() {
			// console.log('App Show')
      //广告显示的时间 10分钟
      let adShowTime=10*60*1000
      //当前时间
      let nowTime=(new Date()).getTime()
      //开始隐藏时间
      let leaveTime=this.$store.state.leaveTime
      //开始比较
      if((nowTime-leaveTime)>=adShowTime){
        //跳转到开屏页
        uni.navigateTo({
          url:'/pages/ad/ad'
        })
      }
		},
    //当程序隐藏到后台时执行
		onHide: function() {
			// console.log('App Hide')
      //记录app隐藏的开始时间
      this.$store.commit('storeLeaveTime')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "./common/css/common.scss";
  @import "./common/css/iconfont.css";
</style>
