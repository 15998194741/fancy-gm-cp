
const request = require('request');
const { get } = require('http');
class Cp{
	constructor(){}
	async post(url, data, methods){
		let res = {
			url,
			method:methods || 'post',
			headers:{
				Connection: 'close'
			},
			body:{data:JSON.stringify(data)},
			form :data,
			data
			// form:{data:JSON.stringify(data)},
			// headers:{
			// 	'Content-Type':'application/json; charset=utf-8'
			// }
		};
		let a ;
		const axios = require('axios');
			 a = await axios(res).catch(()=>({data:{code:500}}));  
	
		return a;
		
	

	}
	async get(url){
		
		try{
			let	 a = await  new Promise((resolve, reject)=>{
				get(url, res=>{
					let { statusCode }  = res; 
					if(+statusCode !== 200  ){
						reject(new Error(`服务器状态为${statusCode}`));
					}
					let a = '';
					res.on('data', data=>{
						a = data;
					});
					res.on('end', () => {
						resolve(JSON.parse(a.toString()));
					});
				}).on('error', ({message}) => {
					return { code:500, message };
				  });
			}).catch(({message}) =>{
				return {code:500, message};
			});
			return a;
		}catch ({message}){
			return {code:500, message};
		}
	
	}
}

export default new Cp();