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
		let { value, gameid } = data;
		let servers = value.map(a => a.serverid);
		servers = Array.from(new Set(servers.filter(a => !!a)));
		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`;
		let res = await dbSequelize.query(sql, {
			replacements: ['active'], type: Sequelize.QueryTypes.SELECT
		});
		let rep = [];
		for (let i of res) {
			let { ip, port } = i;
			let url = `http://${ip}:${port}/gmswap/BannedAskCancel`;
			/*let { data: res } = await Cp.post(url, { value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid) }).catch(a => ({ code: 500, message: a }));*/
			rep.push(await new Promise(async (res, rej) => {
				let { data: ress } = await Cp.post(url, { value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid) }).catch(a => ({ code: 500, message: a }));
				return res({ res: ress, value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid)});
			}));
		}
		let allRes = await Promise.allSettled(rep);
		for (let i of allRes) {
			let sql;
			let { value: { res, value } } = i;
			let { data: { success, failure } } = res;
			if (success.length === value.length) {
				sql = `update gm_character set status = 0 where gameid = '${gameid}' and id in (${value.map(a => a.id)}) `;
			} else {
				let successData = value.filter(a => (success.find(b => String(b) === String(a.role_id)) ?? -1) >= 0);
				console.log(successData.length);
				sql = ` update gm_character set status = 0 where gameid = '${gameid}' and id in (${successData.map(a => a.id)})  `;
			}
			console.log(sql);
			await dbSequelize.query(sql, {
				replacements: ['active'], type: Sequelize.QueryTypes.UPDATE
			});
	/*		if (!!(failure?.length)) { console.log(failure); }*/
		}
	/*	console.log(allRes[0]?.value?.res);*/
		//Ω‚∑‚ªÿ÷¥

		return allRes;
    }
}


export default new CHARService();



