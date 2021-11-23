const classModel = require('./class.model');
const { v4: uuidv4,
    version: uuidVersion,
    validate: uuidValidate } = require('uuid');


module.exports = {
    async getAllClasses() {
        const result = await classModel.getAllClasses();
        return result;
    },

    async getClassByID(id) {
        let result = [];
        if (uuidValidate(id)) {
            result = await classModel.getClassByID(id);
        }
        return result;
    },

    async getClassByCode(classCode) {
        let result = [];
        if (uuidValidate(classCode)) {
            result = await classModel.getClassByCode(classCode);
        }
        return result;
    },

    async createClass(data) {
        // genrate ID, link to join class, code
        // validation
        let classData = {
            Name: data.name,
            Part: data.part,
            Title: data.title,
            Room: data.room
        }
        classData.ClassID = uuidv4();
        classData.LinkToJoinClass = 'https://classroom-project/joinClass/' + classData.ClassID;
        classData.Code = uuidv4();

        console.log(classData)
        await classModel.createClass(classData);

        return classData.ClassID;
    },

    async updateClassByID(id, data) {
        if (uuidValidate(id)) {
            const classData = {
                Name: data.name,
                Part: data.part,
                Title: data.title,
                Room: data.room
            }
            return await classModel.updateClassByID(id, classData);
        }
        return false;
    },

    async deleteClassByID(id) {
        if (uuidValidate(id)) {
            return await classModel.deleteClassByID(id);
        }
        return false;
    }

}