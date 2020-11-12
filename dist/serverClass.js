"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const Sequelize = require('sequelize');
const redis_1 = require("../../config/redis");
const Cp_1 = require("../../utils/Cp");
const serverfunc_1 = require("./serverfunc");
class serverService {
    constructor() {
    }
    async findAll(data) {
        let { gameName } = data;
        let { platform } = data;
        let { channelNum } = data;
        let { versionId } = data;
        let a = gameName && platform && channelNum && versionId;
        if (!a) {
            throw { message: '缺少参数' };
        }
        let q = await redis_1.default.get(`servername${gameName}${channelNum}${platform}${versionId}`);
        if (q) {
            return JSON.parse(q);
        }
        let res = await serverfunc_1.findAll(gameName, platform, channelNum, versionId);
        return res;
    }
    async setRedis(data) {
        let { gameName } = data;
        let { platform } = data;
        let { channelNum } = data;
        let { versionId } = data;
        let a = gameName && platform && channelNum && versionId;
        if (!a) {
            throw { message: '缺少参数' };
        }
        let sql = `
    with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
            asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
            zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
            ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
            select *,case when display = '1' then '空闲' when display = '2' then '繁忙'when  display = '3' then '维护'  when  display = '4' then '爆满' end as 显示状态, case when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end as show_status   from zxc where zxc.test in (select * from ert ) 
             `;
        let res = await config_1.dbSequelize.query(sql, {
            replacements: ['active'], type: 'SELECT'
        });
        return await redis_1.default.set(`servername${gameName}${channelNum}${platform}${versionId}`, JSON.stringify(res));
    }
    async createServer(data) {
        let { id } = data;
        let sql = `
		select * from gm_server where id = '${id}'
		`;
        let sqlRes = await config_1.dbSequelize.query(sql, {
            replacements: ['active'], type: Sequelize.QueryTypes.SELECT,
            plain: true
        });
        let { ip, port } = sqlRes;
        let url = `http://${ip}:${port}/api/createServer`;
        await Cp_1.default.post(url, sqlRes);
        return true;
    }
}
exports.default = new serverService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyQ2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXBwL3NlcnZpY2Uvc2VydmVyQ2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMkM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLDhDQUF1QztBQUN2Qyx1Q0FBZ0M7QUFDaEMsNkNBQXVDO0FBT3ZDLE1BQU0sYUFBYTtJQUNsQjtJQUNHLENBQUM7SUFFSixLQUFLLENBQUMsT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxRQUFRLElBQUksUUFBUSxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUM7UUFDeEQsSUFBRyxDQUFDLENBQUMsRUFBQztZQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLENBQUM7U0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxRQUFRLEdBQUcsVUFBVSxHQUFHLFFBQVEsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLElBQUcsQ0FBQyxFQUFDO1lBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUM7UUFDNUIsSUFBSSxHQUFHLEdBQUcsTUFBTSxvQkFBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBWTtRQUMxQixJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLFFBQVEsSUFBSSxRQUFRLElBQUksVUFBVSxJQUFJLFNBQVMsQ0FBQztRQUN4RCxJQUFHLENBQUMsQ0FBQyxFQUFDO1lBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsQ0FBQztTQUFDO1FBQy9CLElBQUksR0FBRyxHQUFHOytEQUNtRCxRQUFRO29GQUNhLFVBQVU7bUNBQzNELFVBQVUsNkRBQTZELFFBQVE7bU9BQ2lILFNBQVM7O2NBRTlOLENBQUM7UUFDYixJQUFJLEdBQUcsR0FBRyxNQUFNLG9CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUN0QyxZQUFZLEVBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUMsUUFBUTtTQUN0QyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLFFBQVEsR0FBRyxVQUFVLEdBQUcsUUFBUSxHQUFHLFNBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxRyxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJO1FBQ3RCLElBQUksRUFBRSxFQUFFLEVBQUcsR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxHQUFHLEdBQUc7d0NBQzRCLEVBQUU7R0FDdkMsQ0FBQztRQUNGLElBQUksTUFBTSxHQUFHLE1BQU0sb0JBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ3pDLFlBQVksRUFBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU07WUFDekQsS0FBSyxFQUFHLElBQUk7U0FDWixDQUFDLENBQUM7UUFDSCxJQUFJLEVBQUMsRUFBRSxFQUFFLElBQUksRUFBQyxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLEdBQUcsR0FBSSxVQUFVLEVBQUUsSUFBSSxJQUFJLG1CQUFtQixDQUFDO1FBQ25ELE1BQU0sWUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBRUQ7QUFHRCxrQkFBZSxJQUFJLGFBQWEsRUFBRSxDQUFDIn0=