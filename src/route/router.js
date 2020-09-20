import { resolve } from 'path';
import Router from 'koa-router';
import glob from 'glob';
import routPermMap from './bus.js';
// const symbolPrefix = Symbol('prefix');
let routersMap = new Map();
const isArray = c => typeof c === 'object' && c instanceof 'Array' ? c : [c];
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;
const isObjEquals = (o1, o2) => {
	var props1 = Object.getOwnPropertyNames(o1);
	var props2 = Object.getOwnPropertyNames(o2);
	if (props1.length != props2.length) {
		return false;
	}
	for (var i = 0, max = props1.length; i < max; i++) {
		var propName = props1[i];
		if (o1[propName] !== o2[propName]) {
			return false;
		}
	}
	return true;
};


export default class Route {
	constructor(app, apiPath, baseUrl = '') {
		this.app = app;
		this.apiPath = apiPath;
		this.router = new Router();
		this.baseUrl = baseUrl;
	}

	init() {
		glob.sync(resolve(this.apiPath, './*js')).forEach(require);
		let urls = [];
		for (let [conf, controller] of routersMap) {
			const controllers = isArray(controller);
			let prefixPath = conf.target['path'];
			if (prefixPath) {
				prefixPath = normalizePath(prefixPath);
			}
			const routerPath = `${this.baseUrl}${prefixPath}${conf.path}`.replace(/(\/{2,})/g, '/');
			urls.push(routerPath);
			let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
			if(getType(conf.method)  === 'Array'){
				for(let i of conf.method){
					this.router[i](routerPath, ...controllers);
				}
			}else{
				this.router[conf.method](routerPath, ...controllers);
			}
			let layer = this.router.stack[this.router.stack.length - 1];
			for (let key of routPermMap.keys()) {
				if (isObjEquals(key, { target: conf.target, methodName: conf.methodName })) {
					routPermMap.get(key).set('methods', layer.methods).set('regexp', layer.regexp);
					break;
				}
			}
		}
		return {urls, router:this.router};
	}
}


const router = conf => (target, methodName) => {
	conf.path = normalizePath(conf.path);
	routersMap.set({
		target,
		methodName,
		...conf
	}, target[methodName]);
};


export const controller = path => target => target.prototype['path'] = path;

export const url = conf =>router({
	...conf
});

