/*import { controller, url, router } from '../../route/import';
import statusCode from '../../utils/status-code';
import ANNOService from '../service/anno';
@controller('/anno')
export class cronController {
	constructor() {}
    @router({path:'/send'})
	async send(ctx) {
		let data = ctx.data;
		let res = await ANNOService.sendEmail(data);
		ctx.body = statusCode.SUCCESS_200('���ҳɹ�', res);
		return ctx.body;
	}
    @router({path:'/marquee', method:'get'})
    async marquee(ctx) {
    	let data = ctx.data;
    	let res = await ANNOService.marquee(data);
    	ctx.body = statusCode.SUCCESS_200('���ҳɹ�', res);
    	console.log(ctx.body);
    	return ctx.body;
    }
	@router({path:'/stop', method:'get'})
    async stop(ctx) {
    	let data = ctx.data;
    	let res = await ANNOService.stop(data);
    	ctx.body = statusCode.SUCCESS_200('���ҳɹ�', res);
    	return ctx.body;
    }
	@router({path:'/findAll', method:'get'})
	async findAll(ctx) {
    	let data = ctx.data;
    	let res = await ANNOService.findAll(data);
    	ctx.body = statusCode.SUCCESS_200('���ҳɹ�', res);
    	return ctx.body;
	}
}*/