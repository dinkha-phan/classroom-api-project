const gradeStructModel = require("./gradeStruct.model");

module.exports = {
    async getGradeStruct(id){
        let rows = await gradeStructModel.getGrade(id);
        return rows;
    },
    async putGradeStruct(id, rank, data){
        let rows = await gradeStructModel.getGradeByRank(id, rank);
        let res= null;
        if(rows.length ==0){
            res = await gradeStructModel.createGrade(data);
        }
        else{
            res = await gradeStructModel.editGrade(data);
        }
    }
}