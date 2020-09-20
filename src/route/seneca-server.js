// const logger = require('./logger');
// const levels = {
// 	error: 0,
// 	warn: 1,
// 	info: 2,
// 	verbose: 3,
// 	debug: 4,
// 	silly: 5
// };
import interceptor from './developmentLog';
// const { logger, accessLogger } = require('./logger');

// const seneca = require('seneca')({
// 	log:logger(),
// 	levels:levels
// });
const seneca = require('seneca')({
	log:{
		level:'debug+'
	},
	short:true
});
// const seneca = require('seneca')({
// 	// log: {
// 	// 	// none debug+ info+ warn+
// 	// 	level:'info+',
// 	// 	short: true
// 	// },
// 	// 设置为true时，seneca日志功能会encapsulate senecaId,senecaTag,actId等字段后输出（一般为两字符）
	
// });

import { start } from './route';
const SenecaWeb = require('seneca-web');
const Router = require('koa-router');
const koaBody = require('koa-body');
// const betterBody = require('koa-better-body');
// const convert = require('koa-convert');


import { resolve } from 'path';
import Route from './router';
// import { all } from 'bluebird';
const API_VERSION = '/api';
const dir = path => resolve(__dirname, path);
// const bodyparser = require('koa-bodyparser');



export default (app, port) => {
	let {route, func, paths} = start(API_VERSION);
	// console.log(route);
	let ObjectConcat  = (a, d) => {
		if(!a){
			return {...d};
		}
		if(!d){
			return {...a};
		}
		// console.log(a, d);
		let b = Object.keys(a).concat(Object.keys(d));
		let c = b.length === Array.from(new Set(b)).length;
		if(c){
			return  {...a, ...d};
		}else{
			let g = Object.keys(a).filter(e => Object.keys(d).find(f=> f === e));
			let h = {};
			g.forEach(e => h[e] = {body:a[e], query:d[e]} );
			let res = {...a, ...d, ...h};
			return res;
		}
	};
	function init(options){
		for(let i in func){
			this.add(i, async(msg, done)=>{
				let {args} = msg;
				msg['data']  =ObjectConcat(args['body'], args['query']);
				try{
					let res = await func[i](msg);
					done(null, res);
				}catch  ({message}){
					done({code:500, message}, null);
				}
			});
		}
	}
	seneca.use(init);
	seneca.use(SenecaWeb, {
		context: Router(),
		adapter: require('seneca-web-adapter-koa2'),
		routes: route
	});
	// 将routes导出给koa app
	const apiPath = dir('../app/controllers/');
	const oldroute = new Route(app, apiPath, API_VERSION);
	let {urls, router} = oldroute.init();
	let testUrl = urls => {
		let a = urls.length === Array.from(new Set(urls)).length;
		if(!a){
			throw new Error('存在相同路由');
		}
	};
	testUrl(paths);
	testUrl(urls);
	let urlTest = urls.find(item => paths.find(_item => item === _item));
	if(urlTest){
		throw new Error('双服务存在相同路由');
	}
	seneca.ready(() => {
		// app.use(logger);
		// app.use(async(ctx, next)=> {
		// 	console.log(ctx);
		// 	await next();
		// });
		// app
		app.use(interceptor());
		app.use(seneca.export('web/context')().routes());
		app.use(async(ctx, next)=>{
			if(urls.indexOf(ctx.url) >= 0 || urls.indexOf(ctx.url.split('?')[0]) >= 0  ){
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
				// app.use(convert(betterBody()));
				app.use(async (ctx, next)=>{
					// ctx.data = {
					// 	...ctx.request.body,
					// 	...ctx.query
					//   };
					ctx.data = ObjectConcat(ctx.request.body, ctx.query);
					ctx.data = { ...ctx.request.files, ...ctx.data};
					  for(let [key, value] of Object.entries(ctx.data)){
						if(key.slice(-2) === '[]'){
							ctx.data[key.slice(0, -2)] = [value];
						}
						ctx.data[key] = value;
					}
					  await next();
				});
				app.use(router.routes());
				return next();
			}
		});
		console.log(`微服务启动成功，在${port}`);
	});
	seneca.listen({
		type:'tcp',
		port
	});
	

};