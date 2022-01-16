const db = require('../../utils/db');
const { v4: uuidv4 } = require('uuid');
module.exports = {
    async addNoti(userID, content, link) {
        let created = new Date();
        const d = new Date();
        const tmp = new Date(Date.now());
        const YY = d.getFullYear();
        const MM = d.getMonth();
        const DD = d.getDate();
        const hh = d.getHours();
        const mm = d.getMinutes();
        const ss = d.getSeconds();
        const time = `${YY}-${MM + 1}-${DD} ${hh}:${mm}:${ss}`
        const data = {
            UserID: userID,
            NotiID: uuidv4(),
            Content: content,
            LinkToClass: link,
            CreateAt: time,
            Status: 0
        }
        console.log("################# data", data);
        const rs = await db('notification').insert(data);
        return rs;
    },
    async editNoti(notiId) {
        const rs = await db('notification').where('NotiID', notiId).update('Status', 1);
        return rs;
    },
    async getNotiOfUser(userID) {
        const rs = await db('notification').where('userID', userID).orderBy('CreateAt', 'desc');
        return rs;
    },
};

