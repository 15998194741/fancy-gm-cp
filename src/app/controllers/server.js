import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import serverService from '../service/server';
@controller('/server')
export class UserController {
	constructor() {}
    @get('/findAll')
	async findAll(ctx) {
		let data = ctx.query;
		let res = await serverService.findAll(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
	@get('/setRedis')
    async setRedis(ctx) {
    	let data = ctx.query;
    	let res = await serverService.setRedis(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', res);
    }
	@post('/createServer')
	async createServer(ctx) {
		let data = ctx.data;
    	let res = await serverService.createServer(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', res);
	}
}