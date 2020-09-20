import cors from './cors';
import permission from './permission';
import interceptor from './interceptor';


module.exports = (app) => {
	// 使用跨域
	// app.use(error());
	app.use(cors);
	// app.use(interceptor());
	// app.use(permission());
	
};