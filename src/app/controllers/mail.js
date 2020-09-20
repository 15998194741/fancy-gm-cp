// import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import { controller, url } from  '../../route/import';
import MailServer from '../service/mail';
import statusCode from '../../utils/status-code';
@controller('/mail')
export class UserController {
	constructor() {}
    
  @url({path:'/immediate', method:'post'})
	async immediate(ctx) {
		ctx.log.resourceDesc = '即时发送邮件';
		let data = ctx.request.body;
		const result = await MailServer.immediate(data);
		ctx.body = statusCode.SUCCESS_200('发送成功', result);
	}
    
  @url({path:'/timedMail', method:'post'})
  async timedMail(ctx) {
  	ctx.log.resourceDesc = '定时发送邮件';
  	let data = ctx.request.body;
  	const result = await MailServer.timedMail(data);
  	ctx.body = statusCode.SUCCESS_200('添加成功', result);
  }
  @url({path:'/timedMailCancel', method:'post'})
  async timedMailCancel(ctx) {
  	ctx.log.resourceDesc = '取消定时发送邮件';
  	let data = ctx.request.body;
  	const result = await MailServer.timedMailCancel(data);
	  ctx.body = statusCode.SUCCESS_200('添加成功', result);
	  
  }


    
}
