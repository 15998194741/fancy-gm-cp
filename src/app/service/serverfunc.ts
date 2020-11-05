const { dbSequelize } = require('../../config');

interface findAllData{
        "id": number,
        "status": number,
        "create_user_id": string|null,
        "update_user_id": string|null,
        "create_time": string|Date,
        "update_time": string|Date,
        "servername": string,
        "ip_port": string,
        "address": string,
        "plaform": string[]|string,
        "display": string,
        "srttime": string|Date,
        "gamename": string,
        "pid": null|string|number,
        "serverid": string|number,
        "test": string|number,
        "load": string|number,
        "gameid": number,
        "childrens": null|number[]|string[],
        "port": string|number,
        "ip": string|number,
        "channel": string[],
        "channelnum": string|number,
        "显示状态": string,
        "show_status": string|number
}
async function findAll(gameName:string,platform:string,channelNum:string,versionId:string):Promise<findAllData[]>{
    let sql = `
    with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
            asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
            zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
            ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
            select *,case when display = '1' then '空闲' when display = '2' then '繁忙'when  display = '3' then '维护'  when  display = '4' then '爆满' end as 显示状态, case when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end as show_status   from zxc where zxc.test in (select * from ert ) 
             `;
    let res = await dbSequelize.query(sql, {
        replacements:['active'], type:"SELECT"
    });
    return res;
    
}

export { findAll }