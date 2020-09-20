// import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import { controller, url, router} from  '../../route/import';
import statusCode from '../../utils/status-code';
import serverService from '../service/server';
@controller('/server')
export class UserController {
	constructor() {}
	@url({path:'/findAll', method:'get'})
	async findAll(ctx) {
		let data = ctx.data;
		// console.log(ctx.data);
		let res = await serverService.findAll(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res); 
		return ctx.body;
	}
	@router({path:'/setRedis', method:'get'})
	async setRedis(ctx) {
    	let data = ctx.data;
    	let res = await serverService.setRedis(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', res); 
		return ctx.body;
	}
	@router({path:'/createServer', method:'post'})
	async createServer(ctx) {
		let data = ctx.data;
		let res = await serverService.createServer(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', res); 
		// return {code:100};
    	return ctx.body;
	}
}