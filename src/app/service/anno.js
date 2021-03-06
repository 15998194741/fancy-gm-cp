import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
import crons from '../../config/cron';
class ANNOService{
	 constructor  () {
		 this.annoCreate();
		 this.Marquee();
	}
	async annoCreate(){
		let sql = 'select * from gm_announcement where sendtime > now()  and status  = 1 and anno_status != 3::varchar';
		let ipTable =  dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		ipTable.then(async a=>{
			await c(a);
		});
		let c = async v => {
			
			for(let i of v){
				let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id, sendtime, endtime} = i;
				//添加定时发送任务
				await crons.add(`anno${id}`, new Date(sendtime), this.c.bind(this, {title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id}));
				//添加定时取消任务
				await crons.add(`annoCanecel${id}`, new Date(endtime), this.d.bind(this, {id}));
			}
		};
	}
	async Marquee(){
		let sql = 'select * from gm_announcement where start_time > now()  and status  = 1 and anno_status != 3::varchar';
		let ipTable =await  dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		
		let c = async v => {
			for(let i of v){
				let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id, start_time:sendtime, endtime} = i;
				//添加定时发送任务
				await crons.add(`anno${id}`, new Date(sendtime), this.c.bind(this, {title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id}));
				//添加定时取消任务
				await crons.add(`annoCanecel${id}`, new Date(endTime), this.d.bind(this, {id}));
			}
		};
		c(ipTable);
	}
	async sendEmail(data){
		let {sendtimes} = data;
		//定时发送
		// let a = async v =>{
		// 	let {sendtime, endtime} = v;
		// 	let tableValue = await f(v);
		// 	let b = async v => {
		// 		await crons.remove(v);
		// 	};
		// 	for(let i of tableValue){
		// 		let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id} = i;
		// 		//添加定时发送任务
		// 		await crons.add(`anno${id}`, new Date(sendtime), c.bind(this, {title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id}));
		// 		//添加定时取消任务
		// 		await crons.add(`annoCanecel${id}`, new Date(endtime), b.bind(`anno${id}`));
		// 	}
		// };
		//公告发送
		// let c = async (v) => {
		// 	let {gameId, clients, plaforms, servernames, id} = v;
		// 	let sql;
		// 	switch (true) {
		// 		case !!servernames :
		// 			sql = `select ip from gm_server where gameid = '${gameId}' and servername in (${servernames.map(a=>`'${a}'`)}) `;
		// 			break;
		// 		case !!plaforms && !!clients:
		// 			sql = `select ip from gm_server where gameid = '${gameId}' and   plaform  @> '${JSON.stringify(plaforms)}'::jsonb
		// 			and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb
		// 			and   channel @> '${JSON.stringify(clients)}'::jsonb 
		// 			and jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(clients)}'::jsonb  `;
		// 			break;
		// 		case !!plaforms:
		// 			sql = `select ip from gm_server where gameid = '${gameId}' and  plaform  @> '${JSON.stringify(plaforms)}'::jsonb
		// 			and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb 
		// 		 )`;
		// 			break;
		// 	}
		// 	let ipTable = await dbSequelize.query(sql, {
		// 		replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// 	});
		// 	for(let i of ipTable){
		// 		let url  = `http://${i['ip']}/gmswap/anno`;
		// 		await Cp.post(url, v);
		// 	}
		// 	let sendVirtorySql = `update  gm_announcement set anno_status = 4 where id = '${id}' `;
		// 	await  dbSequelize.query(sendVirtorySql, {
		// 		replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		// 	});
		// };
		
		//及时发送
		// let b =async v =>{
		// 	let tableValue = await f(v);
		// 	for(let i of tableValue){
		// 		let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id} = i;
		// 		await c({title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id});
		// 	}
		// };
		// let f = async v =>{
		// 	let {data}= v;
		// 	let sql = `select *,( case when cardinality(array_remove(client,'')) = 0 then null else client end ) as clients,
		// 						( case when plaform = '[""]'::jsonb then null else plaform end ) as plaforms,
		// 						( case when cardinality(array_remove(servername,'')) = 0 then null else servername end ) as servernames 
		// 						from gm_announcement  where id in  (${data.map(a=>a.id)}) `;
		// 	let tableValue = await dbSequelize.query(sql, {
		// 		replacements:['active'], type:Sequelize.QueryTypes.SELECT
		// 	});
		// 	return tableValue;
		// };
		return sendtimes? await this.a(data):await this.b(data);
	}
	async a(v){
		let {sendtime, endtime} = v;
		let tableValue = await this.f(v);
		for(let i of tableValue){
			let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id} = i;
			//添加定时发送任务
			await crons.add(`anno${id}`, new Date(sendtime), this.c.bind(this, {title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id}));
			//添加定时取消任务
			await crons.add(`annoCanecel${id}`, new Date(endtime), this.d.bind({id}));
		}
	}

	async b(v){
		let tableValue = await this.f(v);
		for(let i of tableValue){
			let {title, text, link, img_url :imgUrl, end_time:endTime, clients, plaforms, servernames, game_id:gameId, id} = i;
			await this.c({title, text, link, imgUrl, endTime, clients, plaforms, servernames, gameId, id});
		}
	}
	async d(v){
		let {id} = v;
		let res = await crons.remove(`anno${id}`);
		res = res && await crons.remove(`annoCancel${id}`);
		console.log('停用了');
		// if(res){return;}
		let sql = `select *,( case when cardinality(array_remove(client,'')) = 0 then null else client end ) as clients,
							( case when plaform = '[""]'::jsonb then null else plaform end ) as plaforms,
							( case when cardinality(array_remove(servername,'')) = 0 then null else servername end ) as servernames 
							from gm_announcement  where id = ${id} `;
		let tableValue = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of tableValue){
			let { clients, plaforms, servernames, game_id:gameId} = i;
			let sql;
			switch (true) {
				case !!servernames :
					sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and servername in (${servernames.map(a=>`'${a}'`)}) `;
					break;
				case !!plaforms && !!clients:
					sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and   plaform  @> '${JSON.stringify(plaforms)}'::jsonb
						and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb
						and   channel @> '${JSON.stringify(clients)}'::jsonb 
						and jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(clients)}'::jsonb  `;
					break;
				case !!plaforms:
					sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and  plaform  @> '${JSON.stringify(plaforms)}'::jsonb
						and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb 
					 )`;
					break;
			}
			let ipTable = await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			for(let i of ipTable){
				let url  = `http://${i['ip']}:${i['port']}/gmswap/annoCancel`;
				await Cp.post(url, v);
			}
		}


	 }

	async f(v){
		let {data}= v;
		let sql = `select *,( case when cardinality(array_remove(client,'')) = 0 then null else client end ) as clients,
							( case when plaform = '[""]'::jsonb then null else plaform end ) as plaforms,
							( case when cardinality(array_remove(servername,'')) = 0 then null else servername end ) as servernames 
							from gm_announcement  where id in  (${data.map(a=>a.id)}) `;
		let tableValue = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return tableValue;
	}


	async c(v){
		let {gameId, clients, plaforms, servernames, id} = v;
		let sql;
		switch (true) {
			case !!servernames :
				sql = `select ip,port from gm_server where gameid = '${gameId}' and servername in (${servernames.map(a=>`'${a}'`)}) and status = 1 `;
				break;
			case !!plaforms && !!clients:
				sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and   plaform  @> '${JSON.stringify(plaforms)}'::jsonb
					and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb
					and   channel @> '${JSON.stringify(clients)}'::jsonb 
					and jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(clients)}'::jsonb  `;
				break;
			case !!plaforms:
				sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and  plaform  @> '${JSON.stringify(plaforms)}'::jsonb
					and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb 
				 )`;
				break;
		}
		let ipTable = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		console.log(ipTable);
		for(let i of ipTable){
			let url  = `http://${i['ip']}:${i['port']}/gmswap/anno`;
			await Cp.post(url, v);
		}
		let sendVirtorySql = `update  gm_announcement set anno_status = 4 where id = '${id}' `;
		await  dbSequelize.query(sendVirtorySql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
	}

	async marquee({id}){
		let sql = `select *,( case when cardinality(        array_remove(client,'')) = 0 then null else client end ) as clients ,
		( case when plaform = '[""]'::jsonb then null else plaform end ) as plaforms ,
( case when cardinality(        array_remove(servername,'')) = 0 then null else servername end ) as servernames from gm_announcement where id = ${id}`;
		let data = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let {0:val} = data;
		let { type } = val;

		//跑马灯处理
		let a =async (v) =>{
			console.log(v);
			let {game_id:gameId, start_time:startTime, end_time:endTime, clients, plaforms, servernames} = v;
			let sql;
			switch (true) {
				case !!servernames :
					sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1 and servername in (${servernames.map(a=>`'${a}'`)}) `;
					break;
				case !!plaforms && !!clients:
					sql = `select ip ,port from gm_server where gameid = '${gameId}' and status = 1  and   plaform  @> '${JSON.stringify(plaforms)}'::jsonb
					and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb
					and   channel @> '${JSON.stringify(clients)}'::jsonb 
					and jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(clients)}'::jsonb  `;
					break;
				case !!plaforms:
					sql = `select ip,port from gm_server where gameid = '${gameId}' and status = 1  and  plaform  @> '${JSON.stringify(plaforms)}'::jsonb
					and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaforms)}'::jsonb 
				 )`;
					break;
			}
			let ipTable = await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			let c = async v =>{
				for(let i of ipTable){
					let url  = `http://${i['ip']}:${i['port']}/gmswap/anno`;
					await Cp.post(url, v);
				}
			};
			let d = async v =>{
				for(let i of ipTable){
					let url  = `http://${i['ip']}:${i['port']}/gmswap/annoCanCel`;
					await Cp.post(url, v);
				}
			};
			console.log( new Date(startTime));
			v['start_time'] = new Date(v['start_time']).getTime();
			v['end_time'] = new Date(v['end_time']).getTime();
			await crons.add(`anno${id}`, new Date(startTime), c.bind(this, v));
			await crons.add(`annoCancel${id}`, new Date(endTime), d.bind(this, v));
			return {code:200};
		};
		//公告板处理
		let b = async (v) =>{
			console.log(v);
			console.log('公告处理');
		};
		return +type === 1 ? await a(val):await b(val);  
	}
	async stop({id}){
		let res = await this.d({id});
		return res; 
	}
	async findAll(data){
		let { gameName } = data;
		let sql = `  
		select gm_announcement.* from gm_announcement,(select id from gm_game where game_name ='${gameName}' ) a  
		where range = '1' and 
		game_id = a.id   and  status = '1' and 
		now() +'8:00' BETWEEN sendtime and endtime`;
		let a =  await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		a.map(asd=>{
			asd['sendtime'] = new Date(asd['sendtime']).getTime();
			asd['endtime'] = new Date(asd['endtime']).getTime();
			return asd;
		});
		if(!a.length)throw {code:500};
		return a;
	}
}


export default new ANNOService();