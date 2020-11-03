import { controller, router  } from '../../route/import';

import whiteServer from '../service/white';
import statusCode from '../../utils/status-code';
@controller('/white')
export class whiteController {
	constructor() {}
	@router({path:'/create', method:['get', 'post']})
	async create(ctx) {
		const result = await whiteServer.create(ctx.data);
		ctx.body = statusCode.SUCCESS_200('新增成功', result);
		return ctx.body;
	}
}
