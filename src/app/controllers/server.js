import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import serverService from '../service/server';
import { database } from '../../config/db-config';
@controller('/server')
export class UserController {
	constructor() {}
    @get('/findAll')
	async findAll(ctx) {
		let data = ctx.query;
		let res = await serverService.findAll();
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
	@get('/setRedis')
    async setRedis(ctx) {
    	// let data = ctx.query;
    	let res = await serverService.setRedis();
    	ctx.body = statusCode.SUCCESS_200('查找成功', res);
    }
}