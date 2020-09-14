import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import whiteMron from '../cron/whitecron';

class whiteService{
	constructor() {
		whiteMron.start();
	}
	async create(data){
		// let {id }  = data;
		// let sql = `
		// select a.roleid,b.title,b.text,b.annex,b.cycle,b.sendtype from gm_white_user a join gm_white_smtp b on a.smtp_id =b.id  where a.id ='${id}'::int        `;
		// let DBres = await dbSequelize.query(sql, {
		// 	replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// });
		// whiteMron.addjob('', '0 0 0 1 * *');
		whiteMron.weekMail();
		

	}

}


export default new whiteService();