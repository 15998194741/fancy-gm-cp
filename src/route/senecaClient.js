exports.SenecaClient = class SenecaClient{
	constructor(host, port, type) {
		const seneca = require('seneca')();
		const bluebird = require('bluebird');	
		this.act = bluebird.promisify(seneca.act, { context: seneca });	
		seneca.client({
			host:'127.0.0.1',
			port:10002,
			type:'tcp'
		});
	}
    

	async get(claseNAme, url, data){
		if(!url){url='lixindongniubi';}
		let {query, body} = data;
		return await this.act({
			module:claseNAme,
			[claseNAme]:url,
			args:{
				query,
				body
			}
		});
	}
};