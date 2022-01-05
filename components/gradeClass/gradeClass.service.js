const gradeClassModel = require("./gradeClass.model");

module.exports = {
    async addOrEditGrade(classID, userID, rank, grade) {
        const check = await gradeClassModel.getGradeOneRankByStudent(userID, classID, rank);
        let re = 'Failed';
        if (check.length > 0) {
            await gradeClassModel.editGradeInClass(userID, classID, rank, grade);
            re = 'Success';
        }
        else {
            await gradeClassModel.addGradeInClass(userID, classID, rank, grade);
            re = 'Success';
        }
        return (re);
    },
    async getGradeOfClass(classID) {
        const re = await gradeClassModel.getGradeOfClass(classID);

        return (re);
    },
    async getGradeOfStudentInClass(classID, userID) {
        const re = await gradeClassModel.getGradeOfStudentInClass(userID, classID);
        return (re);
    },
}