import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import cronService from '../service/cron';
@controller('/cron')
export class CronController {
	constructor() {}
	@get('/addjob')
	async addjob(ctx) {
		let { data } = ctx;
		let res = await cronService.addjob(data);
		let ok = '任务添加成功';
		let no = '任务添加失败';
    	ctx.body = {
			code:res?200:201,
			message:res?ok:no
		};
	}
    
    @get('/removejob')
	async removejob(ctx) {
    	// let data = ctx.query;
    	let res = await cronService.removejob();
    	ctx.body = statusCode.SUCCESS_200('查找成功', res);
	}
}