
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
		let a ;
		try{
			 a = await  new Promise((resolve, reject)=>{
				request(res, (error, response, body)=>{
					if(!error){
						try{
							return resolve(JSON.parse(body));
						}catch (e){
							return resolve(body);
						}
					}
					reject(error);
				});
			}).catch(e=>console.log(e)); 
		}catch ({message}){
			throw {message};
		}
		return a;
		
	

	}
}

export default new Cp();