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
		const getIp = (req) =>{
			return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||req.socket.remoteAddress ||req.connection.remoteAddress; 
		};
		let ip = ctx.request.headers['X-Orig-IP'] ||  getIp(ctx.req) || ctx.ip || ctx.request.ip;
		let res = await serverService.findAll(data, ip.replace(/(.+):([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/, '$2'));
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
    	ctx.body = await serverService.createServer(data);
		// return {code:100};
    	return ctx.body;
	}

	@url({path:'/ip', method:'get'})
	async ip(ctx) {
		const getIp = (req) =>{
			return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||req.socket.remoteAddress ||req.connection.remoteAddress; 
		};
		let ip = ctx.request.headers['X-Orig-IP'] ||  getIp(ctx.req) || ctx.ip || ctx.request.ip;
		console.log(ip);
		let data = ctx.data;
		// let res = await serverService.createServer(data);
    	// ctx.body = statusCode.SUCCESS_200('查找成功', res); 
		// return {code:100};c
		ctx.body = '1';
    	return ctx.body;
	}
}