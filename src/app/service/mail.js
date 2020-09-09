import { dbSequelize } from '../../config';
import Cp from '../../utils/Cp';
const Sequelize = require('sequelize');

class MailService{
	constructor() {
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
   select string_to_array(string_agg(roleid,','),',') as roleid,ip from      (select json_array_elements_text(asd.roleid) as roleid,a.ip from  asd join gm_server a on a.serverid = asd.serverid where a.gameid = '${gameid}' ) a group by ip
            `; 
		}else{
			sql =`
            select * from (select ip from gm_server where servername in (select jsonb_array_elements_text(servername)  from gm_smtp where id ='${id}' and game_id = '${gameid}') and gameid = '${gameid}')  a group by ip
            `;
		}
		let  res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of res){
			console.log(i);
		}
		return res;
	}

}


export default new MailService();