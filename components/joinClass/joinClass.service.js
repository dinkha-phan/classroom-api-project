const classService = require('../classroom/class.service')
const userModel = require('../user/user.model')
const joinClassModel = require('./joinClass.model')

module.exports = {
    async addStudentIntoClass(email, classID) {
        let returnJson = {
            msg: 'failure',
            error: 'Something was wrong!',
        }

        console.log(classID, email);

        // check class is exists
        const classInfo = await classService.getClassByID(classID);
        // console.log(classInfo);
        if (!classInfo || classInfo.length === 0) {
            returnJson.error = "Class is not exists!";
            return returnJson;
        }

        // check user is not exists
        const userData = await userModel.getUserByEmail(email);
        // console.log(userData);
        if (!userData || userData.length === 0) {
            returnJson.error = "User is not exists!";
            return returnJson;
        }
        const userID = userData[0].UserID;


        // check user join class
        const classesOfUser = await userModel.getClassesOfUserByUserID(userID);
        //console.log(classesOfUser);
        for (let i in classesOfUser) {
            if (classesOfUser[i].ClassID === classID) {
                returnJson.error = "User joined this class!";
                return returnJson;
            }
        }

        // check invatation is exists
        const invitationRecord = await joinClassModel.getInvatationByEmailandClassID(email, classID);
        // console.log(invitationRecord)
        if (!invitationRecord || invitationRecord.length === 0) {
            returnJson.error = "No invitation!";
            return returnJson;
        }

        // add user to class 
        const handleData = {
            UserID: userID,
            ClassID: classID,
            Role: invitationRecord[0].Role
        }
        console.log(handleData)

        if (await joinClassModel.addUserToClass(handleData)) {
            returnJson.msg = 'success';
            returnJson.error = '';
        }

        await joinClassModel.deleteInvitation(email, classID)

        return returnJson;
    },

    async addInvitation(email, classID, role) {
        let returnJson = {
            msg: 'failure',
            error: 'Something was wrong!',
        }

        console.log(email, classID, role);

        // check class is exists
        // check class is exists
        const classInfo = await classService.getClassByID(classID);
        // console.log(classInfo);
        if (!classInfo || classInfo.length === 0) {
            returnJson.error = "Class is not exists!";
            return returnJson;
        }

        // check user is not exists
        const userData = await userModel.getUserByEmail(email);
        // console.log(userData);
        if (!userData || userData.length === 0) {
            returnJson.error = "User is not exists!";
            return returnJson;
        }
        const userID = userData[0].UserID;


        // check user is in class
        const classesOfUser = await userModel.getClassesOfUserByUserID(userID);
        // console.log(classesOfUser);
        for (let i in classesOfUser) {
            if (classesOfUser[i].ClassID === classID) {
                returnJson.error = "User joined this class!";
                return returnJson;
            }
        }


        // check user is invited
        const invitationRecord = await joinClassModel.getInvatationByEmailandClassID(email, classID);
        // console.log(invitationRecord)
        if (invitationRecord && invitationRecord.length !== 0) {
            returnJson.error = "User is invited!";
            return returnJson;
        }

        // add invitation
        const handleData = {
            ClassID: classID,
            Email: email,
            Role: role
        }
        console.log(handleData)
        if (await joinClassModel.addInvitation(handleData)) {
            returnJson.msg = 'success';
            returnJson.error = '';
        }

        return returnJson;

    }


}