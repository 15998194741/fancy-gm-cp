import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';

// import whiteServer from '../service/white';
// import statusCode from '../../utils/status-code';
@controller('/white')
export class whiteController {
	constructor() {}
	// @post('/create')
	// async create(ctx) {
	// 	ctx.log.resourceDesc = '新增白名单用户数据数据';
	// 	const result = await whiteServer.create(ctx.data);
	// 	ctx.body = statusCode.SUCCESS_200('新增成功', result);
	// }
}
