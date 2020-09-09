const request = require('request');

class Cp{
	constructor(){	
	}
	async post(url, formData){
		let res = {
			url,
			method:'post',
			formData,
		};
		return new Promise((resolve, reject)=>{
			request(res, (error, response, body)=>{
				return resolve(JSON.parse(body));

			});
		}); 
	}
}

export default new Cp();