var express = require('express');
var webot = require('weixin-robot');
var http = require('http');

var app = express();

//var echoWeixin = require('./routes/echoWeixin');
//app.use('/wechat', echoWeixin);

// 指定回复消息
webot.set('hi', '你好');

webot.set('subscribe', {
  pattern: function(info) {
    return info.is('event') && info.param.event === 'subscribe';
  },
  handler: function(info) {
    return '欢迎订阅微信机器人';
  }
});

webot.set('test', {
  pattern: /^test/i,
  handler: function(info, next) {
    next(null, 'roger that!')
  }
})

webot.beforeReply(function get_sup(info,next){
    if (info.text.length > 0 && (info.text[0]=='?' || info.text[0]=='？')) {
      console.log('got info.text : ', info.text);
      return next(null, 'sorry, i donnt prepare enough, just wait some time later');
    }
    else{
      http.get("http://www.tuling123.com/openapi/api?key=f13a82d98180a5314867a702d317298a&info=" + info.text , function(res) {
        var sumData='';
        res.on("data",function(chunk){
          sumData += chunk;
        });
        res.on("end", function(){
          sumData = JSON.parse(sumData.toString());
          if (sumData.text) return next(null, sumData.text); else return next(null, "nothing to say");
        }); 
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
    };
})


// 接管消息请求
webot.watch(app, { token: 'blacweixintoken312', path: '/wechat' });


// 启动 Web 服务
// 微信后台只允许 80 端口
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
// 为了使用 waitRule 功能，需要增加 session 支持
app.use(session({
  secret: '63dcf9de40efdfae0fb80fa7ec72166e',
  store: new session.MemoryStore()
}));


app.listen(8216);

