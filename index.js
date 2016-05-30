/**
 * Created by Administrator on 2016/5/30.
 */
/*
 两个事件
 事件：'elcheck-validate'
 当资源包和exe校验都是正确的时候触发。

 事件：'elcheck-invalidate'
 当资源包或exe校验有一个不正确的时候触发。
 */
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
var cp = require('child_process');
const spawn = require('child_process').spawn;

function elCheckSum() {
    EventEmitter.call(this)
}

util.inherits(elCheckSum, EventEmitter);

//1：设置远程的MD5值和本地的需要校验的资源和exe的路径
elCheckSum.prototype.setFeedMD5 = function (originFrameMD5, originAppMD5, frameExePath, appResourcesPath) {
    this._originFrameMD5 = originFrameMD5;
    this._originAppMD5 = originAppMD5;
    this._frameExePath = frameExePath;
    this._appResourcesPath = appResourcesPath;
};

elCheckSum.prototype.checksumForRemote = function () {
    var self = this;
    var child = cp.fork(path.join(__dirname,'lib', 'forkChild.js'));

    //发送文件路径
    child.send({
        frameSum: this._originFrameMD5, appSum: this._originAppMD5,
        exepath: this._frameExePath,
        dirpath: this._appResourcesPath
    });

    //收到哈希的结果
    child.on('message', function (m) {
        console.log('hash result is :' + m.result);
        child.kill('SIGTERM');
        if (!m.result) {
            //console.log('check app or frame is not validate!');
            return self.emit('elcheck-invalidate');
        }
        else
        {
            //console.log('check app and frame is validate!');
            return self.emit('elcheck-validate');
        }
    });
};

module.exports = new elCheckSum();