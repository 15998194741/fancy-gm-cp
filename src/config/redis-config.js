const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
client.on('error', (err)=>{
	console.log(err);
});
client.on('connect', function(){
	console.log('redis连接成功!');
});

client.on('ready', function(res){
	console.log('redis缓存加载成功');
});
module.exports =  client;

