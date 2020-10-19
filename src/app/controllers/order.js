import { controller, url, router  } from '../../route/import';
import statusCode from '../../utils/status-code';
import orderService from '../service/Order';
// import { database } from '../../config/db-config';

@controller('/Order')
export class OrderController {
	constructor() {}
    @router({path:'/Replenishment'})
	async Replenishment(ctx) {
		let data = ctx.data;
		let res = await orderService.Replenishment(data);
		ctx.body = statusCode.SUCCESS_200('补单成功', res);
		return ctx.body;
	}
}