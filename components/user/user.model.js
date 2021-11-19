const db = require('../../utils/db');
module.exports = {
    async allClass(){
        let row = await db('class');
        return row;
    },
    async createClass(infor){
        await db('class').insert(infor);
    },
    async findUserByUsername(usn){
        let row = await db('user').where('Username', usn);
        return row;
    },
    async addUser(user){
        await db('user').insert(user);
    },
}