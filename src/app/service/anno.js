import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import dayjs from 'dayjs';
class ANNOService{
	constructor() {}
	async sendEmail(data){
		console.log(data);
		let {sendtimes} = data;
		//定时发送
		let a = async v =>{

		};
		//及时发送
		let b =async v =>{
			let {data}= v;
			let sql = `select * from gm_announcement where id in  (${data.map(a=>a.id)}) `;
			let tableValue = await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			for(let i in tableValue){
				let {title, text, link, img_url :imgUrl, plaform, client} = i;
				
			}
	





		};
		
		return sendtimes? await a(data):await b(data);
	
	}
	async marquee({id}){
		let sql = `select * from gm_announcement where id = ${id}`;
		let data = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let {0:val} = data;
		let { type } = val;

		//跑马灯处理
		let a = (v) =>{
			console.log(v);
			console.log('跑马处理');
			



		};
		//公告板处理
		let b = (v) =>{
			console.log('公告处理');
		};
		return +type === 1 ?a(val):b(val);  
	}
}


export default new ANNOService();