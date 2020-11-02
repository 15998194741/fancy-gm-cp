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
		let Cpdata = {type, area, time, because, long, gameid}; 
		let { value } =data;
		let servers = value.map(i=>i.serverid);
		let sql = `select id,ip,port from  gm_server where id in (${servers})`; 
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		value.forEach(async e => {
			let { ip, port } =  res.find(a=> +a.id === +e.serverid);
			let url  = `http://${ip}:${port}/api/char`;
		  await Cp.post(url, Cpdata);
         
		});
	}
}


export default new CHARService();