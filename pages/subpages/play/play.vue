<template>
  <!-- <view class="bg"> -->
    <!-- <uni-nav-bar> -->
      <!-- <block slot="left"> -->
        <!-- <image src="@/static/image/cloud/zuojiantou.png" mode="widthFix" class="top-img left"></image> -->
      <!-- </block> -->
    <!-- </uni-nav-bar> -->
  <!-- </view> -->
  <view >
   <uni-nav-bar  fixed="true">
     <block slot="left">
       <image  @click="goBack()" class="top-img" src="@/static/image/cloud/zuojiantou.png" mode="widthFix"></image>
     </block>
     <div class="center">
             <div class="title">
               <marquee behavior="scroll" direction="left">
                 {{author}}-{{al}}</marquee
               >
             </div>
     </div>
     <!-- <view class="top-search flex-box" @click="openSearch()">
       <image class="search-icon" mode="widthFix" src="../../static/image/search/2.png"></image>
       周杰伦
     </view> -->
     <block slot="right">
       <image mode="widthFix" class="top-img" src="@/static/image/mine/r.png"></image>
     </block>
   </uni-nav-bar>   
<!--  </view> -->
  <view class="play-page" :style="bgStyle">
    <view class="bg">    
      <block slot="left">
        <image src="@/static/image/cloud/zuojiantou.png" mode="widthFix" class="top-img left"></image>
      </block>
    </view>
    <!-- 拨条 -->
    <view class="strip-box" :class="playState ? 'active':''">
      <image class="img" src="https://s3.music.126.net/mobile-new/img/needle-ip6.png?be4ebbeb6befadfcae75ce174e7db862="></image>
    </view>
    <view class="content">
      <!-- 转盘图片 -->
      <view class="play-poster">
        <view class="poster-box" :class="playState ? 'play':'pause'">
          <image class="img" :src="curSongItem.picUrl"  mode="widthFix"></image>
        </view>
      </view>
      <view class="bot">
        <!-- 上排的图标 -->
        <view class="tool-groups flex-box">
          <!-- 收藏 -->
          <view class="flex-item">
            <text class="iconfont">&#xe615;</text>
          </view>
          <!-- 下载 -->
          <view class="flex-item iconfont">
            &#xe60e;
          </view>
          <!-- 分享 -->
          <view class="flex-item iconfont">
            &#xe6ac;
          </view>
          <!-- 评论 -->
          <view class="flex-item iconfont">
            &#xe628;
          </view>
          <!-- 其它 -->
          <view class="flex-item iconfont"  @click="goBack()">
            &#xe60f;
          </view>
        </view>
        <!-- 进度条 -->
        <view class="slider-bar flex-box">
          <!-- 开始时间 -->
          <view class="time start">
            {{curPlayTimeNum}}
          </view>
          <!-- 进度条 -->
          <slider class="line flex-item" :value="curPlayTime"
          min="0" :max="playTime" block-size="15" 
          @change="sliderChange"
          backgroundColor="rgba(255,255,255,.5)"
          activeColor="rgba(255,255,255,.5)"
          ></slider>
          <!-- 结束时间 -->
          <view class="time end">
            {{playTimeNum}}
          </view>
        </view>
        <!-- 下排的图标 -->
        <view class="btn-groups flex-box">
          <!-- 播放模式 -->
          <view class="flex-item" @click="setPlayModel()">
            <!-- 列表循环 -->
            <view v-if="playModel==0" class="iconfont">
              &#xe66c;
            </view>
            <!-- 随机播放 -->
            <view v-if="playModel==1" class="iconfont">
              &#xe66b;
            </view>
            <!-- 单曲循环 -->
            <view v-if="playModel==2" class="iconfont">
              &#xe66d;
            </view>
          </view>
          <!-- 上一曲 -->
          <view class="flex-item" @click="prevPlay()">
            <view class="iconfont">
              &#xe78a;
            </view>
          </view>
          <!-- 播放/暂停 -->
          <view class="play-btn" @click="play()">
            <view v-if="!playState" class="iconfont">
              &#xe638;
            </view>
            <view v-if="playState" class="iconfont">
              &#xe76a;
            </view>
          </view>
          <!-- 下一曲 -->
          <view class="flex-item" @click="nextPlay()">
            <view class="iconfont">
              &#xe7a5;
            </view>
          </view>
          <!-- 菜单 -->
          <!-- <view class="flex-item"> -->
            <view class="flex-item iconfont">
              &#xe634;
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  
</template>

<script>
  import uniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue"
  import {mapState,mapMutations} from 'vuex'
  import {apiGetSongDetail,apiGetSongUrl} from '@/api/index.js'
  let innerAudioContext=null;
  export default {
    data() {
      return {
        playState:0,//播放状态 1是播放 0是暂停
        curPlayIndex:this.playCurrentIndex, //当前播放的索引
        curPlayTime:0, //当前播放时间
        curSongItem:{}, //当前播放对象
        playTime:0, //音乐播放时长
        audioList:[], //音乐播放列表
        playModel:0, //播放模式 0-列表循环 1-随机播放 2-单曲循环
        al:'', //歌曲名称
        author:'' //作者
      }
    },
    computed:{
      ...mapState(['playList','playCurrentIndex']),
      //设置滤镜背景
      bgStyle(){
        return 'background-image:url('+this.curSongItem.picUrl||''+')'
      },
      //开始时间00:00
      curPlayTimeNum(){
        return this.$pubFn.formatTime(this.curPlayTime)
      },
      //总时长
      playTimeNum(){
        return this.$pubFn.formatTime(this.playTime)
      }
    },
    mounted() {
      this.curPlayIndex=this.playCurrentIndex
      this.playInit()
      //得到音乐列表
      this.audioList=this.playList
      
    },
    methods: {
      //初始化
      playInit(){
        const curAudio=this.playList[this.curPlayIndex]
        console.log('id',curAudio);
         
        //当前音乐的id
        this.curId=curAudio.id
        
        this.curPlayTime=0
        //获取音乐文件
        this.getData()
      },
      //获取音乐url,详情 同时调用多个接口
      async getData(){
        let [detail,url]=await Promise.all([
          //根据id获取详情
          apiGetSongDetail({
            ids:this.curId
          }).then(res=>{
            console.log('Detail',res);
            // debugger
            //改造数据结构 把多个人名合并
            var songs=res.songs[0]
            var singer=songs.ar.map(art=>{
              return art.name
            })[0]
            this.al=songs.al.name
            this.author=singer
            return{
              name:songs.al.name,
              picUrl:songs.al.picUrl,
              singer:singer
            }
          }),
          //根据id获取url
          apiGetSongUrl({
            id:this.curId
          }).then(res=>{
            console.log('url',res);
           let src=res.data[0].url
           if(!src){
             uni.showToast({
               title:'播放地址不存在！'
             })
             return false
           }
           return {
             src:res.data[0].url
           }
          })
        ])
        this.curSongItem={...detail,...url}
        console.log('curSongItem',this.curSongItem);
        if(url){
          this.setAudio()
        }else{
          uni.showToast({
            title:'url不存在！'
          })
        }
        
      },
      //设置播放的文件
      setAudio(){
        //若存在之前的实例则取消
        if(innerAudioContext){
          // #ifdef H5
          innerAudioContext.destroy();
          // #endif
          innerAudioContext=""
        }
        //创建实例 H5中
        // #ifdef H5
        innerAudioContext=uni.createInnerAudioContext()
        // #endif
        
        //创建实例 非H5中
        // #ifndef H5
        innerAudioContext=uni.getBackgroundAudioManager()
        innerAudioContext.title=this.curSongItem.name
        innerAudioContext.singer=this.curSongItem.singer
        innerAudioContext.coverImgUrl=this.curSongItem.picUrl
        // #endif
        
        innerAudioContext.src=this.curSongItem.src
        innerAudioContext.autoplay=true
        //获取音乐时长 可能读的时候innerAudioContext还没有准备好
        let timer=setInterval(()=>{
          this.playTime=Math.floor(innerAudioContext.duration||0)
          console.log('playtime',this.playTime);
          if(this.playTime){
            clearInterval(timer)
          }
        },100)
        //监听事件
        innerAudioContext.onPlay(()=>{
          this.playState=1
        })
        //暂停
        innerAudioContext.onPause(()=>{
          this.playState=0
        })
        innerAudioContext.onEnded(()=>{
          console.log('音乐结束，跳转下一首');
          this.nextPlay()
        })
        //监听进度条
        innerAudioContext.onTimeUpdate(()=>{
          //得到当前播放时间
          this.curPlayTime=Math.floor(innerAudioContext.currentTime)
          console.log('this.curPlayTime',this.curPlayTime);
          // debugger
        })
        
      },
      play(){
        if(this.playState===1){//播放
          //暂停
          innerAudioContext.pause()
        }
        if(this.playState===0){//暂停
        //播放
          innerAudioContext.play()
        }
      },
      //拖拽进度条
      sliderChange(e){
        console.log('进度',e);
        this.curPlayTime=e.detail.value
        // debugger
        innerAudioContext.seek(this.curPlayTime)
      },
      // 下一首 preview=true false
      nextPlay(preview){
        //列表顺序播放
        if(this.playModel==0){
          if(!preview){
            //下一首
            this.curPlayIndex=this.curPlayIndex>=(this.audioList.length-1) ? 0:this.curPlayIndex+1
          }else{
            //上一首的索引值
            this.curPlayIndex=(this.curPlayIndex<1) ? this.audioList.length-1:this.curPlayIndex-1
          }
        }
        //随机播放
        if(this.playModel==1){
          this.curPlayIndex=Math.floor(Math.random()*10) % this.audioList.length
        }
        //单曲循环 因为索引值不变 所以不用处理 忽略
        
        //需要重新获取音乐文件资源
        this.playInit()
      },
      //上一首
      prevPlay(){
        this.nextPlay(true)
      },
      //播放模式
      setPlayModel(){
        this.playModel=this.playModel>1 ? 0:this.playModel+1
        uni.showToast({
          icon:'none',
          title:['列表循环','随机播放','单曲循环'][this.playModel]
        })
      },
      //返回
      goBack(){
        // uni.navigateTo({
        //   url:'/pages/index/index'
        // }),
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss" scoped>
  // nav{
  //   position: absolute;
  // }
  marquee{
    position: absolute;
    width: 60%;
    margin-top: 5%;
    // margin-right:10%
         // flex: 3;
  }
 .title{
   fontStyle: blockman;
   color: orangered;
   // font-weight: 800;
   font-size: 40rpx;
   line-height: 40rpx;
   
 }
  .top-img {
    width: 50rpx;
    height: 40rpx;
    
  
    &.left {
      margin-left: 10rpx;
    }
  }
  
	.bg {
		position: fixed;
		// z-index: 0;
		top: 0;
		left: 0;
		height: 90%;
		width: 100%;
		filter: blur(40rpx);
		background: inherit;
		z-index:-1;
		transform:scale(1.5);
	}
	.play-page {
		position: fixed;
		right: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.slider-bar {
		color: rgba(255,255,255, .6);
		padding: 20rpx 0;
		justify-content: space-between;
		.line {
			margin: 0;
			border-radius: 2rpx;
		}
		.time{
			height: 36rpx;
			width: 80rpx;
			margin-right: 10rpx;
			font-size: 36rpx;
			line-height: 76rpx;
			transform: scale(0.5) translateY(-50%);
		}
	}
	.strip-box{
		position: absolute;
		width:100%;
		top:142rpx;
		/* #ifdef H5 */
		top:0rpx;
		/* #endif */
		height: 329rpx;
		z-index: 100;
		transform: rotate(-30deg);
		transform-origin: center 0;
		transition: transform 0.3s;
		&:before{
			position: absolute;
			content: "";
			top:-20rpx;
			left: 350rpx;
			width: 48rpx;
			height: 48rpx;
			border-radius: 48rpx;
			background: #fff;
			z-index: 100;
		}
		&.active{
			transform: rotate(0deg);
		}
		.img{
			width: 220rpx;
			height: 330rpx;
			margin-left: 340rpx;
		}
	}
	.play-poster {
		margin: 310rpx auto 0;
		/* #ifdef H5 */
		margin-top: 130rpx;
		/* #endif */
		.poster-box{
			display: flex;
			width: 616rpx;
			height:616rpx;
			margin: 0 auto;
			background: url(https://s3.music.126.net/mobile-new/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48=) center center no-repeat;
			background-size:100%;
			align-items: center;
			justify-content: center;
			animation: circling 20s linear infinite;
			&.pause{
				animation-play-state: paused;
			}
		}
		.img {
			display: block;
			margin: 0 auto;
			width: 382rpx;
			height: 382rpx;
			border: solid 16rpx rgba(0, 0, 0, .15);
			border-radius: 50%;
		}
	}
	@-webkit-keyframes circling {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(1turn);
		}
	}
	.btn-groups {
		align-items: center;
		text-align: center;
		.iconfont{
			font-size: 40rpx;
		}
		.play-btn{
			position: relative;
			width:120rpx;
			height:120rpx;
			line-height: 120rpx;
			&:before{
				position:absolute;
				content:"";
				width:240rpx;
				height:240rpx;
				border:1px solid #fff;
				border-radius: 240rpx;
				transform: scale(0.5) translate(-100%,-50%);
				z-index: -1;
			}
		}
	}
	.tool-groups {
		margin-bottom: 20rpx;
		text-align: center;
		.iconfont{
			font-size: 40rpx;
		}
	}
	.title-bar {
		position: fixed;
		top:0;
		width:100%;
		height: 44px;
		margin-top: 20px;
		text-align: center;
		line-height: 44px;
		color:#fff;
		z-index: 100;
		.name {
			line-height: 50rpx;
			font-size: 28rpx;
		}
		.author {
			line-height: 1;
			font-size: 24rpx;
			color: rgba(255,255,255,.8);
		}
		.iconfont{
			width:110rpx;
			font-size: 44rpx;
		}
	}
	
	.content {
		position: fixed;
		z-index: 1;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		color: #FFFDEF;
		.bot {
			position: fixed;
			bottom: 40rpx;
			left: 0;
			width: 100%;
			padding: 0 26rpx;
		}
	}
	.album-list {
		position: absolute;
		bottom:0;
		background: #fff;
		border-radius: 36rpx 36rpx 0 0;
		z-index: 100;
		transition: transform 0.3s;
		transform: translateY(100%);
		&.active{
			transform: translateY(0);
		}
		.list{
			height:500rpx;
			overflow-y: scroll;
		}
		.tit-bar{
			padding:10rpx;
			justify-content: space-between;
			.iconfont{
				margin-left: 16rpx;
				margin-right: 16rpx;
				font-size: 40rpx;
			}
			.play{
				line-height: 80rpx;
				color:#252621;
				font-weight: 600;
				font-size: 32rpx;
			}
			.collect{
				width:228rpx;
				height:80rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 80rpx;
				color:#fff;
				background: #fb2b21;
			}
		}
		.item {
			align-items: center;
			height: 120rpx;
		}
		.con {
			padding-right: 40rpx;
			align-items: center;
			justify-content: space-between;
		}
		.num {
			width: 84rpx;
			text-align: center;
			line-height: 120rpx;
			color: #999;
			font-size: 24rpx;
			&.on {
				color: #ff3a3a;
			}
		}
		.tit {
			margin-right: 20rpx;
			color: #333;
			line-height: 48rpx;
			font-size: 32rpx;
		}
		.count {
			margin-right: 20rpx;
			color: #ccc;
			line-height: 48rpx;
			font-size: 24rpx;
			transform: scale(0.84);
		}
		.icon {
			width: 56rpx;
			height: 20rpx;
		}
		.desc {
			color: #999;
			font-size: 24rpx;
			line-height: 40rpx;
		}
		.close{
			position: relative;
			height: 50px;
			line-height: 50px;
			text-align: center;
			&:before{
				position:absolute;
				content:"";
				top:0;
				left:0;
				width:100%;
				border-top:1px solid #ddd;
				transform: scaleY(0.5);
			}
		}
	}
</style>

