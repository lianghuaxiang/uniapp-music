<template>
  <view v-if="isShow" class="search-page" :class="{show:isShow}">
    <uniNavBar fixed="true">
      <view class="search-box flex-box">
        <view class="top-search flex-box flex-item">
          <image class="search-icon" src="../static/image/search/2.png" mode="widthFix"></image>
          <input :focus="isFocus" type="text" class="flex-item" v-model="searchTxt" @input="inputSearch()" @keydown.enter="saveKeyword" @confirm="addSearchHistory()"/>
        </view>
        <view class="cancle" @click="colse()">
          取消
        </view>
      </view>
      <block slot="right">
        <image  class="top-img" src="../static/image/search/1.png" mode="widthFix"></image>
      </block>
    </uniNavBar>
    <!-- 搜索页内容 -->
    <scroll-view scroll-y="true" class="page-content">
      <!-- 没有输入 -->
      <template v-if="!searchTxt.trim().length">
        <!-- 广告位 -->
        <image class="top-ad" src="../static/image/search/s_03.png" mode="widthFix"></image>
        <!-- 搜索历史 -->
        <view class="history-list" v-if="historyList.length">
          <view class="title-bar flex-box">
            <view class="title">
              搜索历史
            </view>
            <image class="icon" src="../static/image/search/3.png" mode="widthFix"  @click="clearSearch()"></image>
          </view>
          <scroll-view class="list scroll-view" scroll-x="true">
            <view class="item" v-for="(item,index) in historyList" :key="index" @click="historySearch(item)">
              <view class="desc">
                {{item}}
              </view>              
            </view>
          </scroll-view>
        </view>
        <!-- 热搜榜 -->
        <view class="hot-list">
          <view class="title-bar flex-box">
            <view class="title">
              热搜榜
            </view>            
          </view>
          <view class="list">
            <view class="item flex-box" v-for="(item,index) in hotList" :key="index">
              <view class="num" :class="{on:index<3}">
                {{index+1}}
              </view>
              <view class="flex-item">
                <view class="flex-box con">
                  <view class="tit">
                    {{item.searchWord}}
                  </view>
                  <view class="count">
                    {{item.score}}
                  </view>
                  <image class="icon" :src="item.iconUrl" mode="widthFix"></image>
                </view>
                <view class="desc">
                  {{item.content}}
                </view>
              </view>
            </view>
          </view>
          
        </view>
      </template>
      <!-- 已经输入 -->
      <!-- <view class="suggest-list" v-if="searchTxt.trim().length">
        <view class="suggest">
          搜索{{searchTxt.trim()}}
        </view>
        <view class="item flex-box" v-for="(item,index) in suggestList" :key="index" >
          <view class="icon iconfont">
            &#xe613;
          </view>
          <view class="word flex-item">
            {{item.keyword}}
          </view>
        </view>
      </view> -->
      <!-- 播放列表 -->
        <view class="album-list" v-if="album.length>0">
          <view class="suggest-list">           
            <view class="suggest">
              搜索{{searchTxt.trim()}}
            </view>
          </view>
          <view class="title-bar flex-box">
            <view class="play">
              <text class="iconfont">&#xe710;</text>
              播放全部（共{{10}}首歌曲）
            </view>
            <view class="collect">
              +收藏
            </view>
          </view>
          <!-- 音乐列表 -->
          <view class="list">
            <!-- v-for="(item,index) in album" :key="index" -->
            <view class="item flex-box" v-for="(item,index) in album" :key="index" @click="setPlayList(index)" >
              <!-- @click="setPlayList()" -->
              <view class="num" :class="{on:index<4}">
                {{index+1}}
              </view>
              <view class="flex-item">
                <view class="flex-box con">
                  <view class="">
                    <view class="tit">
                      {{item.name}}
                    </view>
                    <view class="count">
                      {{item.artists[0].name}}
                    </view>
                  </view>
                  
                  <view class="iconfont">
                    
                    <text style="margin-right: 50%;">&#xe710;</text>
                    &#xe60f;
                  </view>
                </view>
                <view class="desc">
                  {{item.content}}
                </view>
              </view>
            </view>
          </view>
        </view>
      
    </scroll-view>
  </view>
</template>

<script>
  function debounce(fn,wait=500){
    var timeout=null
    return function(){
      if(timeout!=null){
        clearTimeout(timeout)
      }
      timeout=setTimeout(fn,wait)
    }
  }
  var self=null
   import {mapMutations} from 'vuex'
  import {apiGetSearchHot,apiGetSearchSuggest,searchMusic} from '@/api/index.js'
  import uniNavBar from '@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
  export default {
    data() {
      return {
        playList:[], //播放列表
        suggestList:[], //搜索列表
        hotList:[],//热搜榜
        isShow:false,
        searchTxt:'', //搜索内容
        isFocus:false, // 光标是否定位
        historyList:[], //搜索历史
        album:{}, //音乐对象
      }
    },
    onLoad() {
      this.getHotList()
    },
    created() {
      self=this
    },
    methods: {
      ...mapMutations(['storePlayList','pushPlaylist','setPlayIndex']),
      saveKeyword(){
        if(!this.searchTxt.trim()){
          uni.showToast({
            icon:'none',
            title:'输入的内容为空！'
          })
        }else{
          searchMusic({
            keywords:this.searchTxt.trim(),
            limit:10,
            // offset:10
          }).then(res=>{
            console.log('触发了',res);
            // debugger
            this.album=res.result.songs
            this.playList=res.result.songs
          })
        }
        
      },
      open() {
        this.isShow=true
        this.isFocus=true
        this.getHotList()
        
      },
      //关闭搜索页
      colse(){
        this.isFocus=false
        this.isShow=false
        this.$emit('close')
      },
      //热搜
      getHotList(){
        if(this.hotList.length>0){
          return false
        }
        apiGetSearchHot().then(res=>{
          // console.log(res.data);
          //  debugger
          this.hotList=res.data
          
        })
      },
      //搜索列表
      inputSearch:debounce(()=>{
        if(self.searchTxt.trim()){
          const params={
            type:'mobile',
            keywords:self.searchTxt.trim()
          }
          apiGetSearchSuggest(params).then(res=>{
            console.log(res);
            // debugger
            self.suggestList=res.result.allMatch
          })
        }
      }),
      //搜索历史
      addSearchHistory(){
        const txt=this.searchTxt.trim()
        if(txt){
          //检查 关键字 是否已经存在
          const tempIndex=this.historyList.indexOf(txt)
          if(tempIndex!=-1){
            //删除旧的
            this.historyList.slice(tempIndex,1)
          }
          //添加
          this.historyList.unshift(txt)
          //持久存储
          uni.setStorageSync("searchList",JSON.stringify(this.historyList))
        }
      },
      // 读取搜索历史
      getSearchHistoryList(){
        const value=uni.getStorageSync('searchList')
        if(value){
          this.historyList=JSON.parse(value)
        }
      },
      //清除搜索历史
      clearSearch(){
        uni.showModal({
          title:'',
          content:'确认清除全部历史记录？',
          success:(res) =>{
            if(res.confirm){
              uni.setStorageSync("searchList","")
              this.historyList=[];
            }else if(res.cancel){
              console.log("你选择了取消");
            }
          }
        })
      },   
         // 历史搜索
    historySearch (keyword) {
      this.getSearchHistoryList()
      this.searchTxt = keyword
      // this.saveKeyword()
      searchMusic({keywords:this.searchTxt,limit:10}).then(res=>{
        console.log('search',res);
        this.album=res.result.songs
        this.playList=res.result.songs
        // debugger
        
      })
    },
    //跳转播放
    setPlayList(index){      
      this.$store.commit('setPlayIndex', index)
      //保存到vuex
      this.storePlayList(this.playList)
      uni.navigateTo({
        url:'/pages/subpages/play/play'
      })
    }
    }
  }
</script>

<style lang="scss">
  
.album-list {
  position: relative;
  top:- 84px;
  background: #fff;
  border-radius: 36rpx 36rpx 0 0;
  z-index: 100;
  margin-top: 200rpx;
  .title-bar{
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
      width:150rpx;
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
}

	.search-page{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		background: #fff;
		min-height:100%;
		transition: transform 0.1s;
		transform: translateX(100%);
		z-index: 100;
		&.show{
			transform: translateX(0)
		}
	}
.search-box{
	width:630rpx;
	/* #ifdef MP-WEIXIN */
	width: 540rpx;
	/* #endif */
	align-items: center;
	.cancle{
		width:70rpx;
		font-size: 34rpx;
		color:#000;
	}
}
.top-img {
	width: 50rpx;
	height: 50rpx;
	margin-top: 10rpx;
}
.top-search {
	width: 500rpx;
	height: 72rpx;
	padding: 0 30rpx;
	margin-left: 30rpx;
	margin-right: 24rpx;
	border-radius: 72rpx;
	color: #333;
	background: #f7f7f7;
	align-items: center;
	.search-icon {
		width: 28rpx;
		height: 29rpx;
		margin-right: 12rpx;
	}
	
}
.page-content {
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0px;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
}
.top-ad{
	display:block;
	width:686rpx;
	height:110rpx;
	margin: 24rpx auto 0;
}
.history-list {
	padding-top:14rpx;
	.list {
		height: 106rpx;
		padding-top:20rpx;
		margin-bottom: 30rpx;
		white-space: nowrap;
    // margin-top: 50rpx;
		.item {
			position: relative;
			display: inline-block;
			height: 64rpx;
			padding:0 30rpx;
			margin-right:20rpx;
			text-align: center;
			line-height: 64rpx;
			border-radius: 64rpx;
			color:#323232;
			background: #f8f8f8;
			&:first-child{
				margin-left:40rpx;
        
			}
		}
	}
}
.title-bar{
	height:68rpx;
	padding: 0 36rpx;
	justify-content: space-between;
	align-items:center;
	font-size: 26rpx;
	font-weight: 600;
	color:#333;
	.icon{
		width:36rpx;
		height:36rpx;
		margin-right:10rpx;
	}
}
.hot-list{
	.item{
		align-items: center;
		height:120rpx;
	}
	.con{
		align-items: center;
	}
	.num{
		width:84rpx;
		text-align: center;
		line-height: 120rpx;
		color:#999;
		font-size: 24rpx;
		font-weight: 600;
		&.on{
			color:#ff3a3a;
		}
	}
	.tit{
		margin-right:20rpx;
		color:#333;
		line-height: 48rpx;
		font-size: 32rpx;
		font-weight: 600;
	}
	.count{
		margin-right:20rpx;
		color:#ccc;
		line-height: 48rpx;
		font-size: 24rpx;
		transform: scale(0.84);
	}
	.icon{
		width:56rpx;
		height:20rpx;
	}
	.desc{
		color:#999;
		font-size: 24rpx;
		line-height: 40rpx;
	}
}
.suggest-list{
	.suggest{
		position:relative;
		height:60rpx;
		margin-left:32rpx;
		line-height:60rpx;
		color:#6578a0;
		&:before{
			position:absolute;
			content: '';
			right:0;
			bottom:0;
			width:100%;
			border-top: 1px solid #e6e6e6;
			transform: scaleY(0.5);
		}
	}
	.item{
		height:90rpx;
		line-height: 90rpx;
		color:#222;
	}
	.icon{
		width:72rpx;
		color:#aaa;
		text-align:center;
	}
	.word{
		position:relative;
		&:before{
			position:absolute;
			content: '';
			right:0;
			bottom:0;
			width:100%;
			border-top: 1px solid #e6e6e6;
			transform: scaleY(0.5);
		}
	}
}
</style>
