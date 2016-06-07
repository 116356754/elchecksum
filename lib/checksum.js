/*两个事件
 事件：'check-validate'
 当发现框架或者app的MD5值均匹配时触发

 事件：'check-not-validate'
 当发现框架或者app的MD5值不匹配时触发
 */

var path =require('path');
var events = require("events");
var EventEmitter = events.EventEmitter;
var util = require('util');

var md5File = require('md5-file');

function CheckSumer() {
    EventEmitter.call(this)
}
util.inherits(CheckSumer, EventEmitter);

CheckSumer.prototype.start = function(remoteFrameSign,remoteAppSign)
{
    this.remoteFrameSign = remoteFrameSign;
    this.remoteAppSign = remoteAppSign;
};

CheckSumer.prototype.frameSign = function (filepath)
{
    var self = this;
    //console.time('md5-exe');
    md5File(filepath,function (err, hash) {
        //console.log('frame hash result is '+hash);
        //console.timeEnd('md5-exe');
		if(err)
            return self.emit('check-not-validate');
		
        if(self.remoteFrameSign != hash)
            self.emit('check-not-validate');
        else
            self.emit('check-validate');
    });
};

CheckSumer.prototype.appSign = function (appPath)
{
    var self = this;
    //console.time('md5-app');
    md5File(appPath,function (err, hash) {
        //console.log('app hash result is '+hash);
        //console.timeEnd('md5-app');
		if(err)
            return self.emit('check-not-validate');
		
        if(self.remoteAppSign != hash)
            self.emit('check-not-validate');
        else
            self.emit('check-validate');
    });
};

module.exports = new CheckSumer();