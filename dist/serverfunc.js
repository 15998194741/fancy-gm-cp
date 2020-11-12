"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
const { dbSequelize } = require('../../config');
async function findAll(gameName, platform, channelNum, versionId, ip) {
    let sql = `
    with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
            asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
            zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
            ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
           
            select *,case when display = '1' then '空闲' when display = '2' then '繁忙'when  display = '3' then '维护'  when  display = '4' then '爆满' end as 显示状态, 
            case when "securityGroup" @> concat('["' ,'${ip}','"]')::jsonb or  "securityGroup" is null or   "securityGroup"  = '[]'::jsonb or "securityGroup"  = '[""]'::jsonb  then 
        (case 	when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end )
        else '4' end  
        as show_status   from zxc where zxc.test in (select * from ert ) 
             `;
    let res = await dbSequelize.query(sql, {
        replacements: ['active'], type: "SELECT"
    });
    return res;
}
exports.findAll = findAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyZnVuYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAvc2VydmljZS9zZXJ2ZXJmdW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUE2QmhELEtBQUssVUFBVSxPQUFPLENBQUMsUUFBZSxFQUFDLFFBQWUsRUFBQyxVQUFpQixFQUFDLFNBQWdCLEVBQUMsRUFBUztJQUMvRixJQUFJLEdBQUcsR0FBRzsrREFDaUQsUUFBUTtvRkFDYSxVQUFVO21DQUMzRCxVQUFVLDZEQUE2RCxRQUFRO21PQUNpSCxTQUFTOzs7eURBR25MLEVBQUU7Ozs7Y0FJN0MsQ0FBQztJQUNYLElBQUksR0FBRyxHQUFHLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7UUFDbkMsWUFBWSxFQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFDLFFBQVE7S0FDekMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxHQUFHLENBQUM7QUFFZixDQUFDO0FBRVEsMEJBQU8ifQ==