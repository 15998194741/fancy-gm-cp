import crons from '../../config/cron';
import { dbSequelize } from '../../config';
import Cp from '../../utils/Cp';
import dayjs from 'dayjs';
// import { months } from 'dayjs/locale/*';
const Sequelize = require('sequelize');
class mailCron{
	 constructor() {
		 crons.add('whitemonth', '0 0 0 1 * *',  this.weekMail.bind(this, 'month'));
		 crons.add('whiteweek', '0 0 0 * * 1',  this.weekMail.bind(this, 'week'));
	}
	async start(){
		console.log('白名单邮件启动成功');
	}
	// 	async monthMail(data){
	// 		let sql = `
	//         with qwe as (select a.id,a.roleid,b.title,b.text,b.annex,b.cycle,b.sendtype from gm_white_user a join gm_white_smtp b on a.smtp_id =b.id  where a.status = '1' and cycle = '${data}' ),
	// asd as (select jsonb_array_elements(roleid) ->> 'id'  as roleid ,jsonb_array_elements(roleid) ->> 'serverid'  as serverid ,id from qwe  ),
	// zxc as (select asd.*,a.ip from asd  join gm_server a on a.id = asd.serverid::int)
	// select zxc.*,qwe.title,qwe.text,qwe.annex from zxc join qwe on qwe.id = zxc.id`;
	// 		let res = await dbSequelize.query(sql, {
	// 			replacements:['active'], type:Sequelize.QueryTypes.SELECT
	// 		});
	// 		for(let i of res){
	// 			let url =  `http://${i['ip']}:12345/api/mail`;
	// 			let annex = i['annex'];
	// 			let title = i['title'];
	// 			let text = i['text'];
	// 			await Cp.post(url, {annex, title, text});
	// 		}
	// 	}
	async weekMail(data){
		let sql = `
        with qwe as (select a.id,a.roleid,b.title,b.text,b.annex,b.cycle,b.sendtype from gm_white_user a join gm_white_smtp b on a.smtp_id =b.id  where a.status = '1' and cycle = '${data}' ),
        asd as (select jsonb_array_elements(roleid) ->> 'id'  as roleid ,jsonb_array_elements(roleid) ->> 'serverid'  as serverid ,id from qwe  ),
        zxc as (select asd.*,a.ip from asd  join gm_server a on a.id = asd.serverid::int)
        select zxc.*,qwe.title,qwe.text,qwe.annex from zxc join qwe on qwe.id = zxc.id`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of res){
			let url =  `http://${i['ip']}:12345/api/mail`;
			let annex = i['annex'];
			let title = i['title'];
			let text = i['text'];
			// console.log('url:', url);
			// console.log('i:', i);
			await Cp.post(url, {annex, title, text});
			let sql = `
			insert into gm_white_recording 
			(roleid,serverid,white_user_id,sendtime)
			values
			('${i['roleid']}','${i['serverid']}','${i['id']}','${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}')
			`;
			dbSequelize.query(sql);
		}
	}
	// async addjob(data, sendTime){
	// 	// let { id, gameid} = data;
	// 	// try{
		
	// 	let res = await crons.add(`white${1}`, sendTime, await this.immediate.bind(this));
	// 	return res;
	// }
	// async removejob(data){
	// 	let res = await crons.remove(`white${data}`);
	// 	if(res){
	// 		await dbSequelize.query(`update gm_smtp set is_use = false where id = '${data}'`);
	// 	}
	// 	return res;
	// }

	
}


export default new mailCron();