import { controller, url, router } from '../../route/import';
import statusCode from '../../utils/status-code';
import CHARService from '../service/char';

@controller('/char')
export class charController {
	constructor() {}
    @router({path:'/BannedAsk'})
	async BannedAsk(ctx) {
		let data = ctx.data;
		let res = await CHARService.BannedAsk(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
		return ctx.body;
	}

	@router({ path: '/BannedAskCancel', method: ['get']})
	async BannedAskCancel(ctx) {
		let data = ctx.data;
		let res = await CHARService.BannedAskCancel(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', res);
		return ctx.body;
	}
    
	
}