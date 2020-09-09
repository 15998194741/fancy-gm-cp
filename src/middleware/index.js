import cors from './cors';
import router from './router';
// import permission from './permission';
import interceptor from './interceptor';
const koaBody = require('koa-body');

/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
module.exports = (app) => {
	// 使用跨域
	// app.use(error());
	app.use(koaBody({
		multipart:true,
		urlencoded:true,
		text:true,
		patchKoa:true,
		json:true,
		formidable:{
			maxFileSize:200*1024*1024
		}
	}));
	app.use(cors);
	app.use(interceptor());
	app.use(async (ctx, next)=>{
		ctx.data = {
			...ctx.request.body,
			...ctx.query
		  };
		  for(let [key, value] of Object.entries(ctx.data)){
			if(key.slice(-2) === '[]'){
				ctx.data[key.slice(0, -2)] = [value];
			}
			ctx.data[key] = value;
		}
		  await next();
	});
	// app.use(async (ctx, next)=>{
	// 	for(let [key, value] of Object.entries(ctx.data)){
	// 		if(key.slice(-2) === '[]'){
	// 			ctx.data[key.slice(0, -2)] = value;
	// 		}
	// 		ctx.data[key] = value;
	// 	}
	// 	  await next();
	// });
	// app.use(permission());
	router(app); // 加载路由中间件
	// app.use(error);
};