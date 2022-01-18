const express = require('express');
const router = express.Router();
const joinClassService = require('./joinClass.service')



router.get('/invitations/', async (req, res, next) => {
    const rs = 'OK';
    res.json(rs);
})

// add invitation
router.post('/invitations/', async (req, res, next) => {
    const classID = req.body.classID;
    const email = req.body.email;
    const role = req.body.role;
    
    const rs = await joinClassService.addInvitation(email, classID, role); 
    res.json(rs);
})


router.get('/confirm/:classID/user/:userID', async (req, res, next) => {
    const classID = req.params.classID;
    const rs = await joinClassService.addStudentIntoClass(req.params.userID, classID);
    
    //window.location.href = 'http://localhost:3001'
    
    res.redirect(301, 'http://localhost:3001/');
})

module.exports = router;