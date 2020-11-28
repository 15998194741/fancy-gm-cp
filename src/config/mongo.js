
const path = require('path');
const fs = require('fs');
let MongoDbAction = {};
// let filename = path.join(path.dirname(__dirname).replace('app', ''), 'config/table.json');
// let tabConf = JSON.parse(fs.readFileSync(path.normalize(filename)));
var tabConf;
const mongoose = require('./mongo-config.js');
// var conStr = 'postgres://postgres:Ll789456@123.57.86.38:5432/xiaolu';
var conStr = 'postgres://postgres:Ll789456@127.0.0.1:5432/xiaolu';
var pgOpt = require('pg');
var client = new pgOpt.Client(conStr);
// console.log(tabConf);
async function connectPgWithoutPool() {
	client.connect(function (isErr) {
		if (isErr) {
			console.log('connect error:' + isErr.message);
			client.end();
			return;
		}
		return  new Promise((res, rej)=>{
			client.query('select  * from gm_dict where id = 25 ;', [], function (isErr, rst) {
				if (isErr) {
					console.log('query error:' + isErr.message);
				} else {
					// console.log('query success, data is: ', rst.rows[0]?.table);
					tabConf = rst.rows[0].table;
					res(tabConf);
				}
				client.end();
			});

		}); 
	});
}

function addJsons(name, datas) {
	// var conStr = 'postgres://postgres:Ll789456@123.57.86.38:5432/xiaolu';
	var conStr = 'postgres://postgres:Ll789456@127.0.0.1:5432/xiaolu';
	var pgOpt = require('pg');
	var client = new pgOpt.Client(conStr);
	client.connect(function (isErr) {
		if (isErr) {
			console.log('connect error:' + isErr.message);
			client.end();
			return;
		}
		client.query(`update gm_dict set table = table::jsonb || '{"${name}":${JSON.stringify(datas)}}'::jsonb  where id = 25 `, [], function (isErr, rst) {
			if (isErr) {
				console.log('query error:' + isErr.message);
			} else {
				// console.log('query success, data is: ', JSON.stringify(rst.rows[0]?.table));
				tabConf = rst.rows.table;
			}
			client.end();
		});
	});
}
/*connectPgWithoutPool();*/
// import cache from './redis-config.js';
// const cache = require('../utils/cache-utils');

class mongodb{
	constructor() {
	}
	/**
     *
     * @param table_name 表名
     */
	async getConnection(table_name) {
		// await connectPgWithoutPool();
		// console.log(tabConf);
		let tableExist = MongoDbAction[table_name];
		if(tableExist){ return tableExist; }
    	//定义表数据结构
    	let userModel = new mongoose.Schema({
			key: 'String',
			isUse: 'Boolean',
			roleid: 'String',
			plaform: 'String',
			channel: 'String',
			accountid:'String',
			receive: 'Date'
		}, {
    		versionKey: false //去除： - -v
		});
		
    	// 将表的数据结构和表关联起来
		let client = mongoose.model(table_name, userModel, table_name);
		 MongoDbAction[table_name]= client;
    	return client;
	}
	/**
     * 插入单条数据
     * @param table_name 表名
     * @param insertData 插入的数据
     * 
     */
	async insertData(table_name, insertData) {
		let nodeModel = await this.getConnection(table_name);
		let data = new nodeModel(insertData);
		let res = await new Promise((resolve, reject)=>{
			  data.save((err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve([true, res]);
				}
			});
		});
		return res;
	}
	/**
     * 更新单条数据
     * @param table_name 表名
     * @param conditions 查询条件  {"name":'jackson影琪'};
     * @param updateStr 更新数据 {$set: { "url" : "https://www.cnblogs.com/jackson-zhangjiang" }};
     *
     */
	async updateData(table_name, conditions, updateStr) {
		let nodeModel =  await this.getConnection(table_name);
		let res = await new Promise((resolve, reject)=>{
			nodeModel.update(conditions, updateStr, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
	/**
     * 查询单条数据
     * @param table_name 表名
     * @param conditions 查询条件
     * 
     */
	async findOne(table_name, conditions) {
		let nodeModel = await this.getConnection(table_name);
		let res = await new Promise((resolve, reject)=>{
			nodeModel.findOne(conditions, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
	/**
     * 根据_id查询指定的数据
     * @param table_name 表名
     * @param id 可以是字符串或 ObjectId 对象。
     * 
     */
	async findById(table_name, id) {
		let nodeModel = this.getConnection(table_name);
		let res = await new Promise((resolve, reject)=>{
			nodeModel.findById(id, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
	/**
     * 查询数据
     * @param table_name 表名
     * 
     * 
     */
	async find(table_name,  num, step, filter) {
		let nodeModel = await this.getConnection(table_name);
		let options = {limit:num, skip:step, lean:true};
		let res = await new Promise((resolve, reject)=>{
			nodeModel.find(filter, ['key'], options, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
	async findall(table_name,  num, step, filter, key) {
		let nodeModel = await this.getConnection(table_name);
		let options = {limit:num, skip:step, lean:true};
		let res = await new Promise((resolve, reject)=>{
			nodeModel.find(filter, key, options, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
	/**
     * 创建一个集合 
     * @param name 表名
     * @param options 可以是字符串或 ObjectId 对象。
     * 
     */
	async create(name, options) {
		if(MongoDbAction[name]){return false;}
		let userModel = new mongoose.Schema(options, {
    		versionKey: false //去除： - -v
    	});
		// 将表的数据结构和表关联起来
		let client = mongoose.model(name, userModel, name);
		MongoDbAction[name] = client;
		let res;
		try{
			await client.createCollection();
			res = true;
			await this.addJson(name);
		}catch (err){
			res = false;
		}
		return res;
	}
	/**
     * 对json模型文件添加新建得集合模型 
     * @param name 集合名
     * 
     * 
     */
	async addJson(name){
		addJsons(name, {
			key: 'String',
			isUse: 'Boolean',
			roleid: 'String',
			plaform: 'String',
			channel: 'String',
			receive: 'Date'
		});
		// let datas = JSON.parse(fs.readFileSync(path.normalize(filename)));
		// datas[name] = {
		// 	key: 'String',
		// 	isUse: 'Boolean',
		// 	roleid: 'String',
		// 	plaform: 'String',
		// 	channel: 'String',
		// 	receive: 'Date'
		// };
		// datas = JSON.stringify(datas);
		// fs.writeFileSync(filename, datas);
	}
	/**
     * 对json模型文件添加新建得集合模型 
     * @param table_name 集合名
     * @param data 批量插入数据 array类型
     * 
     * 
     */
	async insertManyData(table_name, data){
		let nodeModel = await this.getConnection(table_name);
		let res = await new Promise((resolve, reject)=>{
			nodeModel.insertMany(data, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
    
	/**
     * 对json模型文件添加新建得集合模型 
     * @param table_name 集合名
     * @param key 查找条件
     * @param message 更新数据
     * 
     */
	async findAndUpdate(table_name, key, message){
		let nodeModel = await this.getConnection(table_name);
		let res = await new Promise((resolve, reject)=>{
			nodeModel.findOneAndUpdate(key, message, (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}


	/**
     * 对json模型文件添加新建得集合模型 
     * @param table_name 集合名
     *
     * 
     * 
     */
	async count(table_name){
		let nodeModel =await  this.getConnection(table_name);
        
		let res = await new Promise((resolve, reject)=>{
			nodeModel.count( (err, res) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(res);
				}
			});
		});
		return res;
	}
}

export default new mongodb();










// /**
//  * 查询数据
//  * @param table_name 表名
//  * @param conditions 查询条件
//  * @param fields 待返回字段
//  * @param callback 回调方法
//  */
// MongoDbAction.find = function (table_name, conditions, fields, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.find(conditions, fields || null, {}, function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			callback(null, res);
// 		}
// 	});
// };


// /**
//  * 连写查询
//  * @param table_name 表名
//  * @param conditions 查询条件 {a:1, b:2}
//  * @param options 选项：{fields: "a b c", sort: {time: -1}, limit: 10}
//  * @param callback 回调方法
//  */
// MongoDbAction.where = function (table_name, conditions, options, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.find(conditions)
// 		.select(options.fields || '')
// 		.sort(options.sort || {})
// 		.limit(options.limit || {})
// 		.exec(function (err, res) {
// 			if (err) {
// 				callback(err);
// 			} else {
// 				callback(null, res);
// 			}
// 		});
// };


// /**
//  * 连接查询 $lookup 来实现左连接。
//  * @param table_name 表名
//  * @param conditions 查询条件
//  * @param callback 回调方法
//  */
// MongoDbAction.findOne = function (table_name, conditions, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.aggregate([
// 		{ $lookup:
//        {
//        	from: 'products',            // 右集合
//        	localField: 'product_id',    // 左集合 join 字段
//        	foreignField: '_id',         // 右集合 join 字段
//        	as: 'orderdetails'           // 新生成字段（类型array）
//        }
// 		}
// 	], function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			callback(null, res);
// 		}
// 	});
// };



// /**
//  * 更新单条数据
//  * @param table_name 表名
//  * @param conditions 查询条件  {"name":'jackson影琪'};
//  * @param updateStr 更新数据 {$set: { "url" : "https://www.cnblogs.com/jackson-zhangjiang" }};
//  * @param callback 回调方法
//  */
// MongoDbAction.updateOne= function (table_name, conditions, updateStr, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.updateOne(conditions, updateStr, function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			callback(null, res);
// 		}
// 	});
// };



// /**
//  * 更新多条数据
//  * @param table_name 表名
//  * @param conditions 查询条件  {"type":'1'};
//  * @param updateStr 更新数据 {$set: { "url" : "https://www.cnblogs.com/jackson-zhangjiang" }};
//  * @param callback 回调方法
//  */
// MongoDbAction.updateMany= function (table_name, conditions, updateStr, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.updateMany(conditions, updateStr, function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			console.log(res.result.nModified + ' 条文档被更新');
// 			callback(null, res);
// 		}
// 	});
// };



// /**
//  * 删除单条数据
//  * @param table_name 表名
//  * @param conditions 查询条件  {"name":'jackson影琪'};
//  * @param callback 回调方法
//  */
// MongoDbAction.deleteOne = function (table_name, conditions, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.deleteOne(conditions, function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			callback(null, res);
// 		}
// 	});
// };




// /**
//  * 删除条数据
//  * @param table_name 表名
//  * @param conditions 查询条件  {"type":'1'};
//  * @param callback 回调方法
//  */
// MongoDbAction.deleteMany= function (table_name, conditions, callback) {
// 	var node_model = this.getConnection(table_name);
// 	node_model.deleteMany(conditions, function (err, res) {
// 		if (err) {
// 			callback(err);
// 		} else {
// 			console.log(obj.result.n + ' 条文档被删除');
// 			callback(null, res);
// 		}
// 	});
// };