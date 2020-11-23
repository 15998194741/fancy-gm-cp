import { controller, url, router  } from '../../route/import';
import statusCode from '../../utils/status-code';
// import orderService from '../service/Order.js';
import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Cp from '../../utils/Cp';

// import { database } from '../../config/db-config';

@controller('/Order')
export class OrderController {
	constructor() {}
    @router({path:'/Replenishment'})
	async Replenishment(ctx) {
		let data = ctx.data;
		let { gameid } = data;
		let { value } = data;
		let sqlServer = `select serverid,ip,port from gm_server where gameid = '${gameid}' and status =1 and serverid::int in (${Array.from(new Set(value.map(a => a.serverId)))})  `;
		let serverIds = await dbSequelize.query(sqlServer, {
			type:'SELECT'
		});
		let Req = { '100': [], '200': [], '300':[], '400':[]};
		for (let i of serverIds) {
			let { ip, port, serverid } = i;
			let url = `http://${ip}:${port}/gmswap/repairpay`;
			for(let j of value.filter(a => +a.serverId === +serverid)){
				console.log(j);
				let { data: resData } = await Cp.post(url, { orderid: j.tid }).catch(a => ({code:400}));
				console.log(resData);
				switch (+resData?.code) {
					case 100: Req['100'].push(j); break;
					case 200: Req['200'].push(j); break;
					default: Req['300'].push(j);break;
				}
			}
		}



		/*for(let i in data){
			let { serverId } = data[i];
			if(!serverId){break;}
			let sql = `
			select ip,id,port from gm_server where id = '${serverId}' and gameid = '${gameid}'
			`;
			let sqlRes = await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			let {ip, port} = sqlRes[0];
			let url =  `http://${ip}:${port}/api/Replenishment`;
			
		}*/
		ctx.body = statusCode.SUCCESS_200('补单成功', Req);
		return ctx.body;
	}
}