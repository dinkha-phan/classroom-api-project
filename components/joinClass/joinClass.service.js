const classService = require('../classroom/class.service')
const userModel = require('../user/user.model')
const joinClassModel = require('./joinClass.model')
const nodemailer = require('nodemailer');
const { getMailContent } = require('./mailContent');
const URLAPI = 'http://localhost:3000'
const URLUI = 'http://localhost:3001'
module.exports = {
    async addStudentIntoClass(userID, classID) {
        let returnJson = {
            msg: 'failure',
            error: 'Something was wrong!',
        }

        console.log(classID, userID);

        // check class is exists
        const classInfo = await classService.getClassByID(classID);
        // console.log(classInfo);
        if (!classInfo || classInfo.length === 0) {
            returnJson.error = "Class is not exists!";
            return returnJson;
        }

        // check user is not exists
        const userData = await userModel.getUserByID(userID);
        // console.log(userData);
        if (!userData || userData.length === 0) {
            returnJson.error = "User is not exists!";
            return returnJson;
        }


        // check user join class
        const classesOfUser = await userModel.getClassesOfUserByUserID(userID);
        //console.log(classesOfUser);
        for (let i in classesOfUser) {
            if (classesOfUser[i].ClassID === classID) {
                returnJson.error = "User joined this class!";
                return returnJson;
            }
        }
        let email = userData[0].Email;
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
        console.log(email, classID, role);
        let returnJson = {
            msg: 'failure',
            error: 'Something was wrong!',
        }


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
        // if (!userData || userData.length === 0) {
        //     returnJson.error = "User is not exists!";
        //     return returnJson;
        // }


        // check user is in class
        if (userData) {
            const userID = userData[0].UserID;
            const classesOfUser = await userModel.getClassesOfUserByUserID(userID);
            // console.log(classesOfUser);
            for (let i in classesOfUser) {
                if (classesOfUser[i].ClassID === classID) {
                    returnJson.error = "User joined this class!";
                    return returnJson;
                }
            }
        }


        // check user is invited
        const invitationRecord = await joinClassModel.getInvatationByEmailandClassID(email, classID);
        // console.log(invitationRecord)
        if (invitationRecord && invitationRecord.length !== 0) {
            returnJson.error = "User is invited!";
            return returnJson;
        }
        
        // send mail 
        sendmail(URLAPI+classInfo[0].LinkToJoinClass + '/user/' + userData[0].UserID, email);

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


function sendmail(link, email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ntd.ppnckh.01@gmail.com',			//email ID
            pass: 'TIENdat01217181090'				//Password 
        }
    });

    const details = getMailContent(link, email);
    // console.log(link, email);
    // console.log(details);

    transporter.sendMail(details, function (error, data) {
        if (error) {
            console.log(error)
        }
        else {
            // console.log(data);
            console.log('Send mail successfully');
        }
    });
}