import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import clientService from '../service/client';
// import { database } from '../../config/db-config';
@controller('/client')
export class cronController {
	constructor() {}
    @get('/findAll')
	async findAll(ctx) {
		let data = ctx.data;
		let res = await clientService.findAll(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
}