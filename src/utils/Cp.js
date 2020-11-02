
const request = require('request');

class Cp{
	constructor(){}
	async post(url, data){
		let res = {
			url,
			method:'post',
			body:{data:JSON.stringify(data)},
			form :data
			// form:{data:JSON.stringify(data)},
			// headers:{
			// 	'Content-Type':'application/json; charset=utf-8'
			// }
		};
		let a = await  new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				if(!error){
					return resolve(JSON.parse(body));
				}
				reject(error);
			});
		}); 
		return a;
		
	

	}
}

export default new Cp();