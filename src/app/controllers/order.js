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
		for(let i in data){
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
			await Cp.post(url, {...i});
		}
		// return true;
		
		// let res = await orderService.Replenishment(data);
		ctx.body = statusCode.SUCCESS_200('补单成功');
		return ctx.body;
	}
}