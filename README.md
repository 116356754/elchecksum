##install
npm install elchecksum --save

##usage
var preFrameSum = '59120c11e494586ef09277942066184c';
var preAppSum = 'f4875ae0bdf02ccb808adc14eed69a8d';

elcheck.setFeedMD5(preFrameSum,preAppSum, 'E:/enginer/Taitan.exe', 'E:/enginer/resources/app');

elcheck.checksumForRemote();

elcheck.on('elcheck-validate',()=>console.log('check app and frame is validate!'));

elcheck.on('elcheck-invalidate',()=>console.log('check app or frame is not validate!'));
