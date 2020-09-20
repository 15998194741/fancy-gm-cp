

let routersMap = new Map();
export const classRobe = path => target =>target.prototype['path'] = path;
export const  router = conf => (target, methodName) => {
	let {methods, method} = conf;
	routersMap.set({
		target,
		methodName,
		method:method||methods,
		...conf
	}, target[methodName]);
};



// export const get = path => router({
// 	method: 'GET',
// 	path
// });

// export const post = path => router({
// 	method: 'POST',
// 	path
// });

// export const put = path => router({
// 	method: 'PUT',
// 	path
// });

// export const del = path => router({
// 	method: 'DELETE',
// 	path
// });




const symbolPrefix = Symbol('prefix');


import { resolve } from 'path';
const dir = path => resolve(__dirname, path);
import glob from 'glob';
export function start(datas){
	glob.sync(resolve(dir('../app/controllers/'), './*js')).forEach(require);
	let res = {};
	let func= {};
	let paths = [];
	for (let [conf, controller] of routersMap) {
		let { target } =conf;
		let prefixPath = target['path'];
		let dealPrePath = prefixPath.slice(1);
		if(!res[prefixPath]) {
			res[prefixPath] = {
				prefix: `${datas}/${dealPrePath}`,
				pin: `module:${dealPrePath},${dealPrePath}:*`,
				map: {}
			};
		}
		let { method, path: suffix } = conf;
		// console.log(method);
		func[(dealPrePath || 'lixindongniubi')  + ':' + (suffix.slice(1) ||  'lixindongniubi')] = controller;
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let methodobj = {};
		switch (getType(method)){
			case 'String':methodobj[method] =true;break;
			case 'Array':methodobj = Object.fromEntries(method.map(method => [method, true]));break;
			default:methodobj['get'] =true;
		}
		paths.push(`${datas}/${dealPrePath}${suffix}`);
		// if(getType(method) !== 'Undefined' && getType(method) === 'String'){
		// 	methodobj[method] =true;
		// }else if(getType(methods) !== 'Undefined' && getType(methods) === 'Array' && methods.length > 0){
		// 	methodobj = Object.fromEntries(methods.map(method => [method, true]));
		// }else{
		// 	throw new Error('参数不合法');
		// }
		// console.log(methodobj);
		// let methodarr = method || methods;
		// methodarr = typeof methodarr === 'string' ? {[methodarr]:true} :  Object.fromEntries(methodarr.map(method => [method, true]));
		res[prefixPath].map[suffix.slice(1)|| 'lixindongniubi' ] = {
			...methodobj,
			name:'',
			suffix
		};
	}
	return {route:Object.values(res), func, paths};
	
}
