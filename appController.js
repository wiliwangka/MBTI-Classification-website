// Adapted from Tutorial 8 - CPSC304_Node_Project, https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project.git at appController.js

const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// API of LogIn feature for LogInUsers
router.post('/logIn', async (req,res) => {
    console.log("1");
    const {emailAddress, password} =  req.body;
    console.log("2");
    try {
        const exsisting  = await appService.logIn(emailAddress, password);
        console.log("3");
        if (exsisting) {
            console.log("4");
            res.json({ success: true, message: 'Log in successfully', user: exsisting});
        } else {
            console.log("5");
            res.status(404).json({ success: false, message: 'Account is not existed or password is wrong' });
        }
    } catch {
        console.log("7");
        console.error('error existed during logIn:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
    

});

// API of Register feature
router.post('/register', async (req, res) => {
    const emailAddress = req.body.email;
    const password = req.body.password;
    const mbtiName = req.body.mbtiName;
    const age = req.body.age;
    const country = req.body.country;
    const userGender = req.body.gender;
    const insertResult = await appService.insertLoginUser(emailAddress, password, mbtiName, age, country, userGender);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//API of initiating all the tables
router.post("/initiate-All-Tables", async (req, res) => {
    const initiateResult = await appService.initialize();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//API of submmiting test questions
router.post("/submit-test-questions", async (req, res) => {
    const {emailAddress, startDateTime, EIScore, SNScore, TFScore, JPScore} = req.body;
    // const testAnswer = appService.calculateMBTIScores(EIScore, SNScore, TFScore, JPScore);
    const insertResult = await appService.submitQuestions(emailAddress, startDateTime, EIScore, SNScore, TFScore, JPScore);
    if (insertResult) {
        res.json({success: true, mbtiType: insertResult});
    } else { 
        res.status(500).json({success: false });
    }
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// router.get('/get-mbti-type', async (req, res) => {
//     const mbti = await appService.testOracleConnection();
//     if (isConnect) {
//         res.send('connected');
//     } else {
//         res.send('unable to connect');
//     }
// });



router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-account-info", async (req, res) => {
    // Extract the updated fields from the request body
    const { mbti, email, age, country } = req.body;

    // Assuming you have a method in appService to handle the account update
    try {
        const updateResult = await appService.updateAccountInfo(email, mbti, age, country);
        if (updateResult) {
            res.json({ success: true });
        } else {
            // If updateResult is false or null, handle it as an error
            throw new Error('Failed to update account information');
        }
    } catch (error) {
        console.error('Update account info error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/count-mbtitable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


module.exports = router;