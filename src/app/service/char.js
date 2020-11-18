import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
import crons from '../../config/cron';
class CHARService{
	 constructor  () {}
	async BannedAsk(data){
		let {type, area, time, because, long, gameid} = data;
		let Cpdata = {type, area, because,  gameid, timelong:time*long}; 
		let { value } =data;
		let servers = value.map(i=>i.server_id || i.serverid);
		servers = Array.from(new Set(servers));
		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`; 

		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of res){
			let { ip, port } = i;
			let url  = `http://${ip}:${port}/gmswap/BannedAsk`;
			await Cp.post(url, {...Cpdata, value:value.filter(a=> +a.server_id === +i.serverid || +a.serverid === +i.serverid)});
		}
		// value.forEach(async e => {
		// 	let { ip, port } =  res.find(a=> +a.serverid === +e.serverid || +a.serverid === +e.server_id);
		// 	let url  = `http://${ip}:${port}/gmswap/BannedAsk`;
		//   await Cp.post(url, Cpdata);
         
		// });
	}

	async BannedAskCancel(data) {
		let {  value, gameid } = data;
		let servers = value.map(a => a.serverid);
		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`; 
		let res = await dbSequelize.query(sql, {
			replacements: ['active'], type: Sequelize.QueryTypes.SELECT
		});
		let rep = [] ;
		for (let i of res) {
			let { ip, port } = i;
			let url = `http://${ip}:${port}/gmswap/BannedAsk`;
			let { data: res } = await Cp.post(url, { value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid) }).catch(a => ({ code: 500, message: a }));
			rep.push(res);
		}
		console.log(rep);
		return;
    }
}


export default new CHARService();



