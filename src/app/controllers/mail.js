import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import MailServer from '../service/mail';
import statusCode from '../../utils/status-code';
@controller('/mail')
export class UserController {
	constructor() {}
    
  @post('/immediate')
	async immediate(ctx) {
		ctx.log.resourceDesc = '即时发送邮件';
		let data = ctx.request.body;
		const result = await MailServer.immediate(data);
		ctx.body = statusCode.SUCCESS_200('发送成功', result);
	}
    
  @post('/timedMail')
  async timedMail(ctx) {
  	ctx.log.resourceDesc = '定时发送邮件';
  	let data = ctx.request.body;
  	const result = await MailServer.timedMail(data);
  	ctx.body = statusCode.SUCCESS_200('添加成功', result);
  }
  @post('/timedMailCancel')
  async timedMailCancel(ctx) {
  	ctx.log.resourceDesc = '取消定时发送邮件';
  	let data = ctx.request.body;
  	const result = await MailServer.timedMailCancel(data);
  	ctx.body = statusCode.SUCCESS_200('添加成功', result);
  }


    
}
