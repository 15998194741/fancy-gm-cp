interface findAllData {
    "id": number;
    "status": number;
    "create_user_id": string | null;
    "update_user_id": string | null;
    "create_time": string | Date;
    "update_time": string | Date;
    "servername": string;
    "ip_port": string;
    "address": string;
    "plaform": string[] | string;
    "display": string;
    "srttime": string | Date;
    "gamename": string;
    "pid": null | string | number;
    "serverid": string | number;
    "test": string | number;
    "load": string | number;
    "gameid": number;
    "childrens": null | number[] | string[];
    "port": string | number;
    "ip": string | number;
    "channel": string[];
    "channelnum": string | number;
    "显示状态": string;
    "show_status": string | number;
}
declare function findAll(gameName: string, platform: string, channelNum: string, versionId: string): Promise<findAllData[]>;
export { findAll };
