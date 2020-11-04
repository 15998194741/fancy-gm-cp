var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { dbSequelize } = require('../../config');
function findAll(gameName, platform, channelNum, versionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `
    with qwe as ( select id from gm_game  where game_name = '${gameName}' and status = 1 ),
            asd as (select channel  from gm_game_channel,qwe where  channel_id = '${channelNum}' and gameid  =  qwe.id and status = 1  ),
            zxc as (select a.* ,'${channelNum}' as channelNum from gm_server a,asd  where  plaform @> '"${platform}"' and  a.channel @> concat('["' ,asd.channel,'"]' )::jsonb and status = 1 ),
            ert as  (select case when type = '测试' then '1' when type ='正式' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '${versionId}') a )
            select *,case when display = '1' then '空闲' when display = '2' then '繁忙'when  display = '3' then '维护'  when  display = '4' then '爆满' end as 显示状态, case when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end as show_status   from zxc where zxc.test in (select * from ert ) 
             `;
        let res = yield dbSequelize.query(sql, {
            replacements: ['active'], type: "SELECT"
        });
        return res;
    });
}
export { findAll };
