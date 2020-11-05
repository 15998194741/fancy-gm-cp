interface FindAll {
    gameName: string;
    platform: string;
    channelNum: string;
    versionId: string;
}
declare class serverService {
    constructor();
    findAll(data: FindAll): Promise<any>;
    setRedis(data: FindAll): Promise<boolean>;
    createServer(data: any): Promise<boolean>;
}
declare const _default: serverService;
export default _default;
