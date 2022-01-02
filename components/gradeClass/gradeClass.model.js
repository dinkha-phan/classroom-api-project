const db = require('../../utils/db');

module.exports = {
    async addGradeInClass(userID, classID, rank, grade){
        const data = {
            UserID: userID,
            ClassID: classID,
            Rank: rank,
            Grade: grade
        }
        const rs = await db('user_grade').insert(data);
        return rs;
    },
    async editGradeInClass(userID, classID, rank, grade){
        const data = {
            UserID: userID,
            ClassID: classID,
            Rank: rank,
            Grade: grade
        }
        const rs = await db('user_grade').where('ClassID', classID).where('UserID', userID).where('Rank', rank).update('Grade', grade);
        return rs;
    },
    async getGradeOneRankByStudent(userID, classID, rank){
        const rs = await db('user_grade').where('ClassID', classID).where('UserID', userID).where('Rank', rank);
        return rs;
    },
    async getGradeOfClass(classID){
        const rs = await db('user_grade as ug').join('gradeStruct as gs', (queryBuilder) =>{
            queryBuilder.on('ug.ClassID', 'gs.ClassID').andOn('ug.Rank', 'gs.Rank')
        }).where('ug.ClassID', classID);
        return rs;
    },
    async getGradeOfStudentInClass(userID, classID){
        const rs = await db('user_grade').where('ClassID', classID).where('UserID', userID);
        return rs;
    }
};

