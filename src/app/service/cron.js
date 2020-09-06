import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import crons from '../../config/cron';
const timeToCron = require('cron').time;

class cronService{
	constructor() {
	}
	async addjob(data){
		try{
			let times = new Date('2020-09-03 21:05:00');
			let res = await crons.add('1', times, ()=>{
				console.log(new Date);
			});
			return res;
		}catch (e){
			throw new Error(e);
		}
	}
	async removejob(){
		crons.remove('test');
	}

}


export default new cronService();