import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');

class clientService{
	constructor() {
	}
	async findAll(data){
		let {plaform, channel, versionId} = data;
		let sql = ` 
        select * from gm_client where plaform @> '["${plaform}"]' and channel @> '["${channel}"]' and version_id = '${versionId}'
`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
}


export default new clientService();