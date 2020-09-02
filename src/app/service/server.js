import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
class serverService{
	constructor() {
	}
	async findAll(){
		// let res = await dbSequelize.query('select * from gm_server', {
		// 	replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// });
		let res = await Redis.get('servername');
		return JSON.parse(res);
	}
	async setRedis(){
		let res = await dbSequelize.query('select * from gm_server', {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		await Redis.set('servername', JSON.stringify(res));
		return true;
	}

}


export default new serverService();