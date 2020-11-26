import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import request from 'request';
import Cp from '../../utils/Cp';
import { findAll } from './serverfunc';

class serverService{
	constructor() {
	}
	async findAll(data, ip){
		let { gameName } = data;
		let { platform } = data;
		let { channelNum } = data;
		let { versionId } = data;
		let a = gameName && platform && channelNum && versionId;
		if(!a){throw {message:'缺少参数'};}
		// let q = await Redis.get(`servername${gameName}${channelNum}${platform}${versionId}${ip}`);
		// if(q){return JSON.parse(q);}
		let res= await findAll(gameName, platform, channelNum, versionId, ip);
		return res;
	}
	async setRedis(data, ip){
		let { gameName } = data;
		let { platform } = data;
		let { channelNum } = data;
		let { versionId } = data;
		let a = gameName && platform && channelNum && versionId;
		if(!a){throw {message:'缺少参数'};}
		let sql = `
    with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
            asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
            zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
            ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
            select *,case when display = '1' then '空闲' when display = '2' then '繁忙'when  display = '3' then '维护'  when  display = '4' then '爆满' end as 显示状态, case when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end as show_status   from zxc where zxc.test in (select * from ert ) 
             `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:'SELECT'
		});
		return await Redis.set(`servername${gameName}${channelNum}${platform}${versionId}`, JSON.stringify(res));
	}

	async createServer(data){
		let {  ip, port, serverid, srttime } = data;
		srttime = new Date(srttime);

		/*let sql = `
		select * from gm_server where id = '${id}'
		`;
		let sqlRes = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT,
			plain : true
		});*/
		console.log(data);
		let url = `http://${ip}:${port}/gmswap/serverCreate?id=${serverid}&startTime=${srttime.getTime()}`;
		console.log(url);
		const axios = require('axios');
		let res = await axios({
			method: 'get',
			url,
			headers:{
				Connection: 'close'
			}
		}).catch(() => ({ data: { code: 500 } }));
		console.log(res?.data);
		if (+res?.data?.code !== 200) { throw { code: 500, message:'区服创建失败'};	}
		return {code:200};
	}

}


export default new serverService();