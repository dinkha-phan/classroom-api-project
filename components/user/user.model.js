const db = require('../../utils/db');
module.exports = {
    async findUserByMail(usn){
        let row = await db('user').where('Email', usn);
        if (row.length === 0)
          return null;
        return row;
    },
    async addUser(user){
        await db('user').insert(user);
    },
}