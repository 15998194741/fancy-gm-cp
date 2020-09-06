const cronjob = require('cron').CronJob;
const Sequelize = require('sequelize');
let jobId = {};
class crons{
	constructor() {
	}
	async add(jobname, time, func,){
		for(let i in jobId){
			if(i === jobname){return false;} 
		}
		jobId[jobname] =  new cronjob(time, func, null, false, 'Asia/Shanghai'); 
		jobId[jobname].start(); 
		return true;
	}
	async remove(jobname){
		for(let i in jobId){
			if(i === jobname){return false;} 
		}
		jobId[jobname].stop(); 
		return true;
	}
}
export default new crons();
// jobId['test'] =  new cronjob(new Date('2020-09-03 20:44:00'), ()=>{console.log(new Date());}, null, false, 'Asia/Shanghai'); 
// jobId['test'].start();