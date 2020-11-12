import crons from '../../config/cron';
import { dbSequelize } from '../../config';
import Cp from '../../utils/Cp';
const Sequelize = require('sequelize');
class mailCron{
	 constructor() {
		dbSequelize.query('select game_id as gameid,id,sendtime from gm_smtp where sendtime > now() and is_use = true', {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		}).then(item=>{
			item.forEach(_item=>{
				let { gameid, id, sendtime } = _item;
				this.addjob({gameid, id}, sendtime);
			
			});
			console.log('邮件定时发送任务启动成功');
		});
	}
	async addjob(data, sendTime){
		let { id, gameid} = data;
		// try{
		let times = new Date(sendTime);
		let res = await crons.add(`mail${id}`, times, this.immediate.bind(this, {gameid, id}));
		return res;
	}
	async removejob(data){
		let res = await crons.remove(`mail${data}`);
		if(res){
			await dbSequelize.query(`update gm_smtp set is_use = false,status = 0 where id = '${data}'`);
		}
		return res;
	}
	async immediate(data){
		let { gameid, id } = data;
		let allSql = `
        select all_server as all,annex,title,text  from gm_smtp where id = '${id}' and game_id = '${gameid}'
        `;
		let allServer = await dbSequelize.query(allSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let { all, annex, title, text } = allServer[0];
		let  sql;
		if(!all){
			sql =`
            with qwe as (              select jsonb_array_elements(roleids) ->> 'id' as roleid  ,jsonb_array_elements(roleids) ->> 'serverid' as serverid from gm_smtp where id ='${id}'::int),
    asd as (select 		array_to_json(string_to_array(string_agg(roleid, ','),',')) as roleid ,serverid from qwe group by serverid ) 
   select string_to_array(string_agg(roleid,','),',') as roleid,ip,port from      (select json_array_elements_text(asd.roleid) as roleid,a.ip,a.port from  asd join gm_server a on a.serverid = asd.serverid where a.gameid = '${gameid}' ) a group by ip,port
            `; 
		}else{
			sql =`
            select * from (select ip,port from gm_server where servername in (select jsonb_array_elements_text(servername)  from gm_smtp where id ='${id}' and game_id = '${gameid}') and gameid = '${gameid}')  a group by ip,port
            `;
		}
		let  res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let annexs = {};
		if(annex){
			annex.forEach(ele => {
				annexs[ele['ID']]= ele['number'];
			});
		}
		for(let i of res){
			let url  = `http://${i['ip']}:${i['port']}/gmswap/mail`;
			await Cp.post(url, {annex:annexs, title, text});
		}
		return;
	}
}


export default new mailCron();