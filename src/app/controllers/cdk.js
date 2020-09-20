import { controller, url  } from '../../route/import';
import statusCode from '../../utils/status-code';
import CDKService from '../service/cdk';
// import { database } from '../../config/db-config';
@controller('/cdk')
export class cronController {
	constructor() {}
    @url({path:'/exchange', method:'get'})
	async exchange(ctx) {
		let data = ctx.data;
		let res = await CDKService.exchange(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
}