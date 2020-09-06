import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import CDKService from '../service/cdk';
// import { database } from '../../config/db-config';
@controller('/cron')
export class cronController {
	constructor() {}
    @get('/exchange')
	async exchange(ctx) {
		let data = ctx.data;
		let res = await CDKService.exchange(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
}