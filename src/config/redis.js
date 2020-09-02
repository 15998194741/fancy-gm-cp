import client from './redis-config';

class Redis{
	constructor() {
	}
	/**
     * 根据数据库得键取值
     * @param key
     * @returns {Promise<void>}
     */
	async get(key){
		return   await new Promise((resolve, reject)=>{
			client.get(key, (err, res)=>{
				if(!err){
					return resolve(res);
				}
				return reject(err);
				
			});
		});
	}
	/**
     * 添加key value到Redis数据库
     * @param key 
     * @param value
     * @returns {Promise<void>}
     */
	async set(key, value){
		return   await new Promise((resolve, reject)=>{
			client.set(key, value, (err, res)=>{
				if(!err){
					return resolve(res);
				}
				return reject(err);
				
			});
		});
	}



    
}


export default new Redis();