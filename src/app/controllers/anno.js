import { controller, url, router } from '../../route/import';
import statusCode from '../../utils/status-code';
import ANNOService from '../service/anno';
@controller('/anno')
export class cronController {
	constructor() {}
    @router({path:'/send'})
	async send(ctx) {
		let data = ctx.data;
		let res = await ANNOService.sendEmail(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
		return ctx.body;
	}
    @router({path:'/marquee', method:'get'})
    async marquee(ctx) {
    	let data = ctx.data;
    	let res = await ANNOService.marquee(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', res);
    	return ctx.body;
    }
}