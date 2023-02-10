

//常用函数
const PubFn={
  //格式化 00:00
  formatTime(second){
    var sec=second%60
    var min=Math.floor(second/60)
    if(min.toString().length<2){
      min='0'+min
    }
    if(sec.toString().length<2){
      sec='0'+sec
    }
    return min+':'+sec
  }
}
export default PubFn