import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import request from 'request';
import Cp from '../../utils/Cp';
class serverService{
	constructor() {
	}
	async findAll(data){
		let { gameName } = data;
		let { platform } = data;
		let { channelNum } = data;
		let { versionId } = data;
		let  a = channelNum && platform && gameName && versionId;
		if(!a){throw {message:'缺少参数'};}
		let sql = `
		with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
				asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
				zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
				ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
				select * from zxc where zxc.test in (select * from ert ) 
				 `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		// let res = await Redis.get(`servername${gameid}`);
		return res;
	}
	async setRedis(data){
		let {gameid, gameName} = data;
		if(!gameid && !gameName){throw new Error('你这参数有毛病啊');}
		if(!gameid){
			let sql =  `
			select id from gm_game where game_name = '${gameName}'
			`;
			let test= await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			gameid = test[0]['id'];
		} 
		let sql = `select * from gm_server  where pid is null and gameid = '${gameid}'`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		await Redis.set(`servername${gameid}`, JSON.stringify(res));
		return true;
	}

	async createServer(data){
		let { id  } = data;
		let sql = `
		select * from gm_server where id = '${id}'
		`;
		let sqlRes = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT,
			plain : true
		});
		let {ip, port} = sqlRes;
		let url =  `http://${ip}:${port}/api/createServer`;
		await Cp.post(url, sqlRes);
		return true;
	}

}


export default new serverService();