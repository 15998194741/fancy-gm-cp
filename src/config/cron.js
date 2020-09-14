const cronjob = require('cron').CronJob;
let jobId = {};
class crons{
	constructor() {
	}
	async add(jobname, time, func){
		for(let i in jobId){
			if(i === jobname){return false;} 
		}
		let a  =  new cronjob(time, func, null, false, 'Asia/Shanghai'); 
		// jobId[jobname].setTime(time);
		jobId[jobname] = a;
		console.log(jobname, '添加成功');
		jobId[jobname].start(); 
		return true;
	}
	async remove(jobname){
		for(let i in jobId){
			if(i === jobname){
				jobId[jobname].stop();
				delete jobId[jobname];
				return true;
			} 
		}
		return false;
	}
}
export default new crons();
// jobId['test'] =  new cronjob(new Date('2020-09-03 20:44:00'), ()=>{console.log(new Date());}, null, false, 'Asia/Shanghai'); 
// jobId['test'].start();