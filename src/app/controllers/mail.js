import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import MailServer from '../service/mail';
import statusCode from '../../utils/status-code';
@controller('/mail')
export class UserController {
	constructor() {}
  @post('/immediate')
	async immediate(ctx) {
		ctx.log.resourceDesc = '及时发送邮件';
		let data = ctx.request.body;
		const result = await MailServer.immediate(data);
		ctx.body = statusCode.SUCCESS_200('发送成功', result);
	}

    
}
