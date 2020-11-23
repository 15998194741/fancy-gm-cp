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
		let {type, area, time, beacuse, long, gameid} = data;
		let Cpdata = {type, area, beacuse,  gameid, timelong:time*long}; 
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
			console.log(Cpdata);
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

		let servers = value.map(a => a.server_id ||  a.serverid);
		servers = Array.from(new Set(servers.filter(a => !!a)));

		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements: ['active'], type: Sequelize.QueryTypes.SELECT
		});

		let rep = [];
		for (let i of res) {
			let { ip, port } = i;
			let url = `http://${ip}:${port}/gmswap/BannedAskCancel`;
			/*let { data: res } = await Cp.post(url, { value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid) }).catch(a => ({ code: 500, message: a }));*/
			rep.push(await new Promise(async (res, rej) => {
				let valueData = value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid).map(a => {a['type']= a ['banned_type'];a['area']=a['banned_area']; return a;} );
				let { data: ress } = await Cp.post(url, { value:valueData }).catch(a => ({ code: 500, message: a }));
				return res({ res: ress, value:valueData });
			}));
		}
		let allRes = await Promise.allSettled(rep);
		for (let i of allRes) {
			let sql;
			let { value: { res, value } } = i;
			console.log(value);
			let { data: { success, failure } } = res;
			console.log(JSON.stringify(res));
			if (success.length === value.length) {
				sql = `update gm_character set status = 0 where gameid = '${gameid}' and id in (${value.map(a => a.id)}) `;
			} else {
				let successData = value.filter(a => (success?.find(b => String(b) === String(a.role_id)) ?? -1) >= 0);
				sql = ` update gm_character set status = 0 where gameid = '${gameid}' and id in (${successData.map(a => a.id)})  `;
			}
			console.log(sql);
			await dbSequelize.query(sql, {
				replacements: ['active'], type: Sequelize.QueryTypes.UPDATE
			});
	/*		if (!!(failure?.length)) { console.log(failure); }*/
		}
	/*	console.log(allRes[0]?.value?.res);*/
		//����ִ

		return allRes;
    }
}


export default new CHARService();



