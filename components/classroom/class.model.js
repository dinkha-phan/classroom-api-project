const db = require('../../utils/db');
module.exports = {
    async allClass(){
        let row = await db('class');
        console.log(row);
        return row;
    },
    async createClass(infor){
        await db('class').insert(infor);
    }
}