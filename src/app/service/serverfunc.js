"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
var dbSequelize = require('../../config').dbSequelize;
function findAll(gameName, platform, channelNum, versionId) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n    with qwe as ( select id from gm_game  where game_name = '" + gameName + "' and status = 1 ),\n            asd as (select channel  from gm_game_channel,qwe where  channel_id = '" + channelNum + "' and gameid  =  qwe.id and status = 1  ),\n            zxc as (select a.* ,'" + channelNum + "' as channelNum from gm_server a,asd  where  plaform @> '\"" + platform + "\"' and  a.channel @> concat('[\"' ,asd.channel,'\"]' )::jsonb and status = 1 ),\n            ert as  (select case when type = '\u6D4B\u8BD5' then '1' when type ='\u6B63\u5F0F' then '0' end  as test from (select jsonb_array_elements_text(is_show_type) as type from gm_client,qwe where game_id::int = qwe.id  and version_id =  '" + versionId + "') a )\n            select *,case when display = '1' then '\u7A7A\u95F2' when display = '2' then '\u7E41\u5FD9'when  display = '3' then '\u7EF4\u62A4'  when  display = '4' then '\u7206\u6EE1' end as \u663E\u793A\u72B6\u6001, case when display = '1' then '1' when display = '2' then '2'  when display = '3' then '4'  when  display = '4' then '3' end as show_status   from zxc where zxc.test in (select * from ert ) \n             ";
                    return [4, dbSequelize.query(sql, {
                            replacements: ['active'], type: "SELECT"
                        })];
                case 1:
                    res = _a.sent();
                    return [2, res];
            }
        });
    });
}
exports.findAll = findAll;
