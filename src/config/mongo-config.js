const mongoose = require('mongoose');
const options = {
	db_user :'lxd',
	db_pwd:'Ll789456',
	db_host : '127.0.0.1',
	db_port : 27017,
	db_name:'fancyguo',
	useNewUrlParser: true
};
const db_url = 'mongodb://' + options.db_user + ':' + options.db_pwd + '@' + options.db_host + ':' + options.db_port + '/' + options.db_name;
mongoose.connect(db_url);//连接数据库
// 得到数据库连接句柄
let dbHandle = mongoose.connection;
//通过 数据库连接句柄，监听mongoose数据库成功的事件
dbHandle.on('open', function (err) {
	if (err) {
		console.log('数据库连接失败');
		throw err;
	}
	console.log('mongo数据库连接成功');
});


module.exports = mongoose;