import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import Redis from '../../config/redis';
import Mongo from '../../config/mongo';
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
import crons from '../../config/cron';
class CHARService{
	 constructor  () {}
	async BannedAsk(data){
		let {type, area, time, beacuse, long, gameid} = data;
		let Cpdata = {type, area, beacuse,  gameid, timelong:time*long}; 
		let { value } =data;
		let servers = value.map(i=>i.server_id || i.serverid);
		servers = Array.from(new Set(servers));
		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`; 

		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		for(let i of res){
			let { ip, port } = i;
			let url  = `http://${ip}:${port}/gmswap/BannedAsk`;
			console.log(Cpdata);
			await Cp.post(url, {...Cpdata, value:value.filter(a=> +a.server_id === +i.serverid || +a.serverid === +i.serverid)});
		}
		// value.forEach(async e => {
		// 	let { ip, port } =  res.find(a=> +a.serverid === +e.serverid || +a.serverid === +e.server_id);
		// 	let url  = `http://${ip}:${port}/gmswap/BannedAsk`;
		//   await Cp.post(url, Cpdata);
         
		// });
	}

	async BannedAskCancel(data) {
		let { value, gameid } = data;
		console.log(value);
		let servers = value.map(a => a.server_id ||  a.serverid);
		servers = Array.from(new Set(servers.filter(a => !!a)));

		let sql = `select serverid,ip,port from  gm_server where serverid::int in (${servers}) and gameid = '${gameid}' and status = 1`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements: ['active'], type: Sequelize.QueryTypes.SELECT
		});

		let rep = [];
		for (let i of res) {
			let { ip, port } = i;
			let url = `http://${ip}:${port}/gmswap/BannedAskCancel`;
			/*let { data: res } = await Cp.post(url, { value: value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid) }).catch(a => ({ code: 500, message: a }));*/
			rep.push(await new Promise(async (res, rej) => {
				let valueData = value.filter(a => +a.server_id === +i.serverid || +a.serverid === +i.serverid).map(a => {a['type']= a ['banned_type'];a['area']=a['banned_area']; return a;} );
				let { data: ress } = await Cp.post(url, { value:valueData }).catch(a => ({ code: 500, message: a }));
				return res({ res: ress, value:valueData });
			}));
		}
		let allRes = await Promise.allSettled(rep);
		for (let i of allRes) {
			let sql;
			let { value: { res, value } } = i;
			console.log(value);
			let { data: { success, failure } } = res;
			console.log(JSON.stringify(res));
			if (success.length === value.length) {
				sql = `update gm_character set status = 0 where gameid = '${gameid}' and id in (${value.map(a => a.id)}) `;
			} else {
				if(JSON.stringify(success) === '{}') break;
				let successData = value.filter(a => (success?.find(b => String(b) === String(a.role_id)) ?? -1) >= 0);
				sql = ` update gm_character set status = 0 where gameid = '${gameid}' and id in (${successData.map(a => a.id)})  `;
			}
			console.log(sql);
			await dbSequelize.query(sql, {
				replacements: ['active'], type: Sequelize.QueryTypes.UPDATE
			});
	/*		if (!!(failure?.length)) { console.log(failure); }*/
		}
	/*	console.log(allRes[0]?.value?.res);*/
		//����ִ

		return allRes;
	}
	async query(data){
		console.log(data);
		let {
			key,
			value,
			regtime,
			stime,
			platform,
			channel,
			serverName,
			bannedType,
			bannedArea,
			page,
			pagesize,
			gameid
		} = data;
		if(!value){
			throw {message:'请输入查找值'};
		}

		let startTime = '';
		let endTime = '';
		if(regtime && regtime.length >1 ){
			startTime = new Date(regtime[0]).getTime();
			endTime = new Date(regtime[1]).getTime();
		}
		let serverQuery  =  serverName ? 'serverName'  : channel ? 'channel' : platform? 'platform' : false;
		let serverQuerySql = `
		select serverid,ip,port from gm_server  
		where gameid = $gameid$${gameid}$gameid$ 
		and status = 1`;
		let platformServer = a =>{
			switch (+a){
				case 1:return  ' and plaform =  \'["1"]\' ';
				case 2:return  ' and plaform =  \'["2"]\' ';
				case 3:return '  and plaform @> \'["1","2"]\' and  jsonb_array_length(plaform) = jsonb_array_length(\'["1","2"]\'::jsonb)  ';
				case 4:return '  and plaform @> \'["1"]\' ';
				case 5:return '  and plaform @> \'["2"]\' ';
			}
		};
		switch (serverQuery){
			case 'serverName':serverName = typeof serverName === 'string' ? [serverName]:serverName;serverQuerySql += ` and servername in (${serverName.map(a => `'${a}'`)})` ;break;
			case 'channel':channel = typeof channel === 'string' ? [channel]:channel;serverQuerySql += ` and channel = '${JSON.stringify(channel)}'::jsonb `; break;
			case 'platform':serverQuerySql += platformServer(platform) ; break;
			// default ;
		}
		let serverList = await dbSequelize.query(serverQuerySql, {
			replacements: ['active'], type: 'SELECT'
		});
		if(bannedType ||  bannedArea || (stime && stime.length > 1) ){
			let roleWhere = '';
			if(value){
				switch (key){
					case 'role':roleWhere += ` and roleid = '${value}'` ;break;
					case 'account':roleWhere += ` and account_id = '${value}'` ;break;
					case 'rolename':roleWhere += `  and role_name like '%${value.split('').join('%')}%'  ` ;break;
					case 'ip':roleWhere += ` and ip = ${value}` ;break;
				}
			}
			let sql = `select  *,roleid as role_id,serverid as server_id,date_trunc('second',regtime)::varchar as reg_time,date_trunc('second',update_time)::varchar as timestamp  ,
			concat( date_trunc('second',create_time) ,'---', date_trunc('second',create_time + ("banned_time" ||'h')::interval )) as  stime_etime
			from gm_character  where status = 1 and gameid = 1 and serverid in (${serverList.map(a=> `'${a.serverid}'`)}) 
			${ !(stime && stime.length >1 )  ? '': ` and create_time between '${dayjs(stime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(stime[1]).format('YYYY-MM-DD HH:mm:ss')}'`  }
			${!bannedType ? '' : ` and banned_type = '${bannedType}' ` }
			${!bannedArea ? '' : `  and banned_area  = '${bannedArea}' `}
			${!(regtime && regtime.length >1 ) ? '': ` and regtime  between '${dayjs(regtime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(regtime[1]).format('YYYY-MM-DD HH:mm:ss')}'`  }
			${roleWhere }
			order by id
			limit ${pagesize} offset ${pagesize*(page-1)}  
			`;
			let res = await dbSequelize.query(sql, {
				replacements: ['active'], type: 'SELECT'
			});
			let totalSql = `select  count(id) from gm_character  where status = 1 and gameid = 1 and serverid in (${serverList.map(a=> `'${a.serverid}'`)}) 
			${ !(stime && stime.length >1 )  ? '': ` and create_time between '${dayjs(stime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(stime[1]).format('YYYY-MM-DD HH:mm:ss')}'`  }
			${!bannedType ? '' : ` and banned_type = '${bannedType}' ` }
			${!bannedArea ? '' : `  and banned_area  = '${bannedArea}' `}
			${!(regtime && regtime.length >1 ) ? '': ` and regtime  between '${dayjs(regtime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(regtime[1]).format('YYYY-MM-DD HH:mm:ss')}'`  }
			${roleWhere }`;
			let total = await dbSequelize.query(totalSql, {
				replacements: ['active'], type: 'SELECT'
			});
			return {res, total:total[0]['count']};
		}
		let req = [];
		const axios = require('axios');
		let roleWhere = '';
		switch (key){
			case 'role':roleWhere += ` and roleid = '${value}'` ;break;
			case 'account':roleWhere += ` and account_id = '${value}'` ;break;
			case 'rolename':roleWhere += `  and role_name like '%${value.split('').join('%')}%'  ` ;break;
			case 'ip':roleWhere += ` and ip = ${value}` ;break;
			default :roleWhere = '';
		}
		let roleSql = `
		select roleid,banned_type ,banned_area,banned_reason,banned_time,
		concat( date_trunc('second',create_time) ,'---', date_trunc('second',create_time + ("banned_time" ||'h')::interval )) as  stime_etime
		 from gm_character where gameid ='${gameid}' and  now() < create_time + ("banned_time"||'h')::interval    ${roleWhere}
		`;
		let roleList = await dbSequelize.query(roleSql, {
			replacements: ['active'], type: 'SELECT'
		});
	
		for(let i of serverList){
			let {ip, port } = i;
			let url = `http://${ip}:${port}/gmswap/queryrole?key=${key}&value=${value}&regtimestr=${startTime}&regtimeend=${endTime}`;
			let resss = {
				url,
			method: 'get',
			headers:{
				Connection: 'close'
			}
			};
			req.push(await new Promise(async (res, rej) => {
				let { data } = await axios(resss).catch(()=>({data:{code:500}}));
				if(+data.code !== 200 ) rej(data);
				return res(data);
			}).catch(()=>({data:{code:500}})));
		}

		let CPreq = [];
		for (let i of req){
			if(+i.code !== 200 ) continue;
			let {data} = i;
			if(data && JSON.stringify(data) !== '{}'){
				CPreq = CPreq.concat(data);
			}
		}
		let res = CPreq.map(a => {
			let data = roleList.length > 0  ? roleList.filter(b => String(b.roleid) === String(a.role_id))[0] :{};
			return {
				...a,
				...data
			};
		});
		return {res, total:CPreq.length};
		// console.log(CPreq);
		
		// console.log(JSON.stringify(allRes));

	}
	async excelQuery(data){
		let {value, gameid} = data;
		let serverSql =  `
		select serverid,ip,port from gm_server where gameid = '${gameid}' and status = 1 and serverid  in (${value.map(a => `'${a.serverid}'`)})
		`;
		let serverList = await dbSequelize.query(serverSql, {
			type:'SELECT'
		});
		let req = [];
		const axios = require('axios');
		for(let i of serverList){
			let {ip, port } = i;
			for (let role of value.filter(a => String(a.serverid) === String(i.serverid))){
				let url = `http://${ip}:${port}/gmswap/queryrole?key=role&value=${role.roleid}`;
				console.log(url);
				let resss = {
					url,
				method: 'get',
				headers:{
					Connection: 'close'
				}
				};
				req.push(await new Promise(async (res, rej) => {
					let { data } = await axios(resss).catch(()=>({data:{code:500}}));
					if(+data.code !== 200 ) rej(data);
					return res(data);
				}).catch(()=>({data:{code:500}})));
			}
		}
		let res = [];
		for(let i of req){
			if(i.data && JSON.stringify(i.data) !== '{}'){
				res.push(i.data[0]);
			}
		}
		return res;
	}
}


export default new CHARService();



