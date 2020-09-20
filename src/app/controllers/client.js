import { controller, url, router } from  '../../route/import';
import statusCode from '../../utils/status-code';
import clientService from '../service/client';
@controller('/client')
export class cronController {
	constructor() {}
    @router({path:'/findAll', method:['get', 'post']})
	async findAll(ctx) {
		let data = ctx.data;
		console.log(data);
		let res = await clientService.findAll(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
		return ctx.body;
	}
}