import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import request from 'request';
class serverService{
	constructor() {
	}
	async findAll(data){
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
		let res = await Redis.get(`servername${gameid}`);
		return JSON.parse(res);
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
		console.log(data);
		let { id  } = data;
		let sql = `
		select ip,id from gm_server where id = '${id}'
		`;
		let sqlRes = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let {ip} = sqlRes[0];
		let req = {
			url: `http://${ip}:12345/api/serverCreate`,
			formData:{id}
		};
		request.post(req);
		return true;
	}

}


export default new serverService();