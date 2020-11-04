import crons from '../../config/cron';
import { dbSequelize } from '../../config';
// import Cp from '../../utils/Cp';
import dayjs from 'dayjs';
// import { months } from 'dayjs/locale/*';
const Sequelize = require('sequelize');
class AnnoCron{
	 constructor() {
		 crons.add('whitemonth', '0 0 0 1 * *',  this.weekMail.bind(this, 'month'));
		 crons.add('whiteweek', '0 0 0 * * 1',  this.weekMail.bind(this, 'week'));
	}
    

}


export default new AnnoCron();