import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import dayjs from 'dayjs';
class CDKService{
	constructor() {
	}
	async exchange(data){
		let res = await this.cdkConvert(data);
		return res;
	}
	async cdkConvert(data){
		let{ key } =data;
		let tableName = key.split('', 4).join('');
		let sql = `select * from gm_cdk  cdk  where case 
		when cdk.type = '1'
		then cdk.cdkid = '${key}'
		else cdk.cdkid = '${tableName}'
		end `;
		let dbres = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(dbres.length === 0){return '不存在';}
		dbres = dbres[0];
		let { type, start_time:startTime, end_time:endTime, annex} = dbres;
		let now = new Date(dayjs(new Date()).add(8, 'hour'));
		startTime = new Date(startTime);
		endTime = new Date(endTime);
		if(!(now> startTime && endTime> now)){return '已过期';}
		let res ;
		data['receive']= dayjs(now).format('YYYY-MM-DD HH:mm:ss'); 
		switch (+type){
			case +1 :  console.log('唯一cdk');res = await this.cdkOnlyOne(data);return res?annex:'cdk不存在';
			case +2 : res = await this.cdkMutually(data);return res?annex:'cdk不存在';
			case +3 :  console.log('通用cdk');res =  await this.cdkUniversal(data);return res?annex:'cdk不存在';
			default:return 'cdk不存在';
		}
	}
	//唯一cdk兑换
	async cdkOnlyOne(data){
		let { key }=data;
		let datas = {};
		for(let i in data){
			if(i==='receive'){continue;}
			datas[i] = data[i]; 
		}
		let res = await Mongo.findOne(key, {...datas});
		if(!res){
			await Mongo.insertData(key, {...data});
			return true;
		}
		return false;
	}
	//互斥cdk兑换
	async cdkMutually(data){
		let {key, roleid} = data;
		let tableName = key.split('', 4).join('');
		let isUse = false;
		let res = await Mongo.findOne(tableName, {roleid});
		if(res){
			return false;
		}
		res = await Mongo.findAndUpdate(tableName, {key, isUse}, {...data, isUse:!isUse});
		return res;
	}
	//通用cdk兑换
	async cdkUniversal(data){
		let{ key } =data;
		let tableName = key.split('', 4).join('');
		let isUse = false;
		let res = await Mongo.findAndUpdate(tableName, {key, isUse}, {...data, isUse:!isUse});
		return res;
	}

}


export default new CDKService();