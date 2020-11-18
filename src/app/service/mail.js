import { dbSequelize } from '../../config';
import Cp from '../../utils/Cp';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import mailCron from '../cron/mailcron';
class MailService{
	constructor() {
	}
	async immediate(data){
		let { gameid, id } = data;
		let allSql = `
        select all_server as all,annex,title,text,roleid,link  from gm_smtp where id = '${id}' and game_id = '${gameid}'
        `;
		let allServer = await dbSequelize.query(allSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let { all, annex, title, text, roleid, link} = allServer[0];
		console.log(allServer);

		let  sql;
		if(!all){
			sql =`
            with qwe as (              select jsonb_array_elements(roleids) ->> 'id' as roleid  ,jsonb_array_elements(roleids) ->> 'serverid' as serverid from gm_smtp where id ='${id}'::int),
    asd as (select 		array_to_json(string_to_array(string_agg(roleid, ','),',')) as roleid ,serverid from qwe group by serverid ) 
   select string_to_array(string_agg(roleid,','),',') as roleid,ip,port from      (select json_array_elements_text(asd.roleid) as roleid,a.ip,a.port from  asd join gm_server a on a.serverid = asd.serverid where a.gameid = '${gameid}' ) a group by ip,port
			`; 
	
			
		}else{
			sql =`
			select * from (select id,ip,port from gm_server where servername in (select jsonb_array_elements_text(servername)  from gm_smtp where id ='${id}' and game_id = '${gameid}') and gameid = '${gameid}')  a 
			union 
			select * from (select id,ip,port from gm_server where servername in (select jsonb_array_elements_text(servername)  from gm_smtp where id ='${id}' and game_id = '${gameid}') and gameid = '${gameid}')  a 
			`;
			roleid = '';
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
			await Cp.post(url, {annex:annexs, title, text, roleid, link});
		}	
		await dbSequelize.query(`update gm_smtp set status = 0 where id = '${id}' `, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return;
	}
	async timedMail(data){
		let { gameid, id } = data;
		let allSql = `
        select sendtime  from gm_smtp where id = '${id}' and game_id = '${gameid}'
        `;
		let allServer = await dbSequelize.query(allSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let {sendtime} = allServer[0];
		// sendtime = dayjs(sendtime).add(8, 'hour');
		let res = await mailCron.addjob(data, sendtime);
		return res;
		// 		let  sql;
		// 		if(!all){
		// 			sql =`
		//             with qwe as (              select jsonb_array_elements(roleids) ->> 'id' as roleid  ,jsonb_array_elements(roleids) ->> 'serverid' as serverid from gm_smtp where id ='${id}'::int),
		//     asd as (select 		array_to_json(string_to_array(string_agg(roleid, ','),',')) as roleid ,serverid from qwe group by serverid ) 
		//    select string_to_array(string_agg(roleid,','),',') as roleid,ip from      (select json_array_elements_text(asd.roleid) as roleid,a.ip from  asd join gm_server a on a.serverid = asd.serverid where a.gameid = '${gameid}' ) a group by ip
		//             `; 
		// 		}else{
		// 			sql =`
		//             select * from (select ip from gm_server where servername in (select jsonb_array_elements_text(servername)  from gm_smtp where id ='${id}' and game_id = '${gameid}') and gameid = '${gameid}')  a group by ip
		//             `;
		// 		}
		// 		let  res = await dbSequelize.query(sql, {
		// 			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// 		});
		// 		let annexs = {};
		// 		if(annex){
		// 			annex.forEach(ele => {
		// 				annexs[ele['ID']]= ele['number'];
		// 			});
		// 		}
		// 		sendtime = new Date(sendtime);
        
		// 		for(let i of res){
		// 			let url  = `http://${i['ip']}/api/mail`;
		// 			await Cp.post(url, {annex:annexs, title, text});
		// 		}
		// 		return;
	}
	async timedMailCancel(data){
		let { id } = data;
		let res = await mailCron.removejob(id);
		return res;
	}

}


export default new MailService();