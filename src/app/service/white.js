import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import whiteMron from '../cron/whitecron';
import Cp from '../../utils/Cp';
import dayjs from 'dayjs';
class whiteService{
	constructor() {
		whiteMron.start();
	}
	async create(data){
		let { id } = data;
		let sql =  `
		with qwe as (select a.id,a.roleid,b.title,b.text,b.annex,b.cycle,b.sendtype from gm_white_user a join gm_white_smtp b on a.smtp_id =b.id  where a.status = '1' and b.id in (select smtp_id from gm_white_user where id = '${id}') ),
        asd as (select jsonb_array_elements(roleid) ->> 'id'  as roleid ,jsonb_array_elements(roleid) ->> 'serverid'  as serverid ,id from qwe  ),
        zxc as (select asd.*,a.ip,a.port from asd  join gm_server a on a.id = asd.serverid::int where a.status = 1)
        select zxc.*,qwe.title,qwe.text,qwe.annex from zxc join qwe on qwe.id = zxc.id
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of res){
			let url = `http://${i['ip']}:${i['port']}/gmswap/mail`;
			let annex = i['annex'];
			let title = i['title'];
			let text = i['text'];
			// console.log('url:', url);
			// console.log('i:', i);
			try{
				await Cp.post(url, {annex, title, text});
				let sql = `
			insert into gm_white_recording 
			(roleid,serverid,white_user_id,sendtime)
			values
			('${i['roleid']}','${i['serverid']}','${i['id']}','${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}')
			`;
				await	dbSequelize.query(sql);
			}catch (e){
				console.log(e);
			}
			
		}
		// let {id }  = data;
		// let sql = `
		// select a.roleid,b.title,b.text,b.annex,b.cycle,b.sendtype from gm_white_user a join gm_white_smtp b on a.smtp_id =b.id  where a.id ='${id}'::int        `;
		// let DBres = await dbSequelize.query(sql, {
		// 	replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// });
		// whiteMron.addjob('', '0 0 0 1 * *');
		return {code:200};
	}

}


export default new whiteService();