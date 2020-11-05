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
		let{ key, channel, platform:plaform } = data;
		let a = (message) => {
			throw {message};
		};
		Object.keys(data).length === 4 ? '' :a('参数不正确');
		if(!plaform || !(typeof plaform ==='string')){a('参数不合法');}
		let plaformTest = plaform;
		switch(plaform.toLowerCase()){
			case '1':plaform = '安卓';plaformTest=1;break;
			case '安卓':plaform = '安卓';plaformTest=1;break;
			case 'android':plaform = '安卓'; plaformTest=1;break;
			case '2':plaform = '苹果';plaformTest=2;break;
			case '苹果':plaform = '苹果';plaformTest=2; break;
			case 'ios':plaform = '苹果'; plaformTest=2;break;
			default:
				a('参数不合法');
		}
		let tableName = key.split('', 4).join('');
		let sql = `	with qwe as (select * from gm_cdk  cdk  where case 
			when cdk.type = '1'
			then cdk.cdkid = '${key}'
			else cdk.cdkid = '${tableName}'
			end),
			asd as (select channel_id from gm_game_channel as a ,qwe   where gameid = qwe.game_id and  qwe.channel @> concat('["' ,a.channel,'"]' )::jsonb GROUP BY a.channel_id),
			zxc as (select  string_to_array(string_agg(channel_id::varchar,','),',')  as channelid from asd)
			select * from zxc,qwe  `;
		let dbres = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(dbres.length === 0){a('不存在');}
		dbres = dbres[0];
		let { type, start_time:startTime, end_time:endTime, annex, status, channel:dbchannel, plaform:dbplaform, title, content, channelid} = dbres;
		let channelTrue = dbchannel.some(item=> item === channel );
		let channelIdTrue = channelid.some(item=> item === channel );
		let plaformTrue = dbplaform.some(item=> +item === +plaformTest);
		if(!(channelTrue||channelIdTrue) || !plaformTrue){a('非此平台兑换key') ;}
		let now = new Date(dayjs(new Date()).add(8, 'hour'));
		startTime = new Date(startTime);
		endTime = new Date(endTime);
		if(!(now> startTime && endTime> now)){a('已过期');}
		if(+status !== +1 ){a('已停用');}
		let res ;
		data['receive']= dayjs(now).format('YYYY-MM-DD HH:mm:ss'); 
		data['plaform'] = plaform;
		switch (+type){
			case +1 :  console.log('唯一cdk');res = await this.cdkOnlyOne(data);break;
			case +2 :console.log('互斥cdk'); res = await this.cdkMutually(data);break;
			case +3 :  console.log('通用cdk');res =  await this.cdkUniversal(data);break;
			default:
				throw {message:'cdk不存在'};
		}
		return res?{
			title,
			text:content,
			annex
		}:a('cdk不存在');
	}
	//唯一cdk兑换
	async cdkOnlyOne(data){
		let { key }=data;
		let datas = {};
		for(let i in data){
			if( i==='receive'){continue;}
			datas[i] = data[i]; 
		}
		let res = await Mongo.findOne(key, {...datas});
		if(!res){
			data['isUse'] =true;
			data['receive']= dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'); 
			let [a, b] = await Mongo.insertData(key, data);
			console.log(b);
			return a;
		}
		throw{message:'不存在'};
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
		res = await Mongo.updateData(tableName, {key, isUse}, {...data, isUse:true});
		let {n} = res;
		return +n === 1;
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