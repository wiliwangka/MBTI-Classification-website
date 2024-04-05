// Adapted from Tutorial 8 - CPSC304_Node_Project, https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project.git at appController.js

const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.



router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
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

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });


// API of Register feature
router.post('/register', async (req, res) => {
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
    const mbtiName = req.body.mbtiName;
    const age = req.body.age;
    const country = req.body.country;
    const userGender = req.body.userGender;
    const insertResult = await appService.insertLoginUser(emailAddress, password, mbtiName, age, country, userGender);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// API of LogIn feature for LogInUsers
router.post('/logIn', async (req,res) => {
	const emailAddress = req.body.email;
	const password = req.body.password;
	try {
		const existing  = await appService.logIn(emailAddress, password);
		if (existing[0]) {
			res.json({ success: true, message: 'Log in successfully', user: existing[1]});
		} else {
			res.status(404).json({ success: false, message: 'Account is not existed or password is wrong' });
		}
	} catch (error) {
		console.error('error existed during logIn:', error);
		res.status(500).json({ success: false, message: 'An error occurred during login' });
	}
	

});

router.post("/update-account-info", async (req, res) => {
	// Extract the updated fields from the request body
	const oldEmailAddress = req.body.oldEmailAddress;
	const oldPassword = req.body.oldPassword;
	const newEmailAddress = req.body.newEmailAddress;
	const newPassword = req.body.newPassword;
	const mbtiName = req.body.mbtiName;
	const age = req.body.age;
	const country = req.body.country;
	const userGender = req.body.userGender;

	// Assuming you have a method in appService to handle the account update
	try {
		const updateResult = await appService.updateAccountInfo(oldEmailAddress, oldPassword, newEmailAddress, newPassword, mbtiName, age, country, userGender);
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

// API endpoint of getting recommendation books
router.get("/get-book-recommendation", async (req, res) => {
	const {mbtiName} = req.query;
	try{
		const result = await appService.getRecommendedBooks(mbtiName);
		res.json({success: true, data: result});
        
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting books"});
	}
	
})

// API endpoint of getting recommendation videos
router.get("/get-video-recommendation", async (req, res) => {

	const {mbtiName} = req.query;
	
	try{
		
		const result = await appService.getRecommendedVideos(mbtiName);
		res.json({success: true, data: result});
		
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting videos"});
	}
	
})

//API endpoint of getting recommendation articles
router.get("/get-article-recommendation", async (req, res) => {
	const {mbtiName} = req.query;
	try{
		const result = await appService.getRecommendedArticles(mbtiName);
		res.json({success: true, data: result});
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting articless"});
	}
	
})



// API endpoint of getting the numbers of login users for every mbti
router.get("/get-numbers-mbti", async (req, res) => {
	const {mbtiName} = req.query;
	try{
		
		const result = await appService.getNumberOfMbti(mbtiName);
		res.json({success: true, data: result});
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting articless"});
	}
	
})

// API endpoint of getting mbtis that have more than n users
router.get("/get-over-n-mbti", async (req, res) => {
	const {number} = req.query;
	try{
		const result = await appService.getMbtiMoreThanN(number);
		res.json({success: true, data: result});
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting mbti having over n loginusers"});
	}
	
})

// API endpoint of calculating on average each mbti recommends how many books
router.get("/get-average-book", async (req,res) => {
	try{
		const result = await appService.getAverageBook();
		res.json({success: true, data: result});
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting average number of books"});
	}
})

// API endpoint of finding books that all mbti recommend
router.get("/get-recommend-book", async (req,res) => {
	try{
		const result = await appService.getAllRecommendBook();
		res.json({success: true, data: result});
	} catch (error) {
		res.status(500).json({success: false, message: "error exists in getting books that all mbti recommend"});
	}
})

//API endpoint of deleting LogIn user
router.post("/delete-login-user", async (req, res) => {
	const emailAddress = req.body.emailAddress;
	try {
		console.log(emailAddress);
		const result = await appService.deleteLogInUser(emailAddress);
		if (result) {
			console.log("SUCCESS " + result);
			res.json({success: true});
		} else {
			console.log("FAIL " + result);
			res.json({success: false, message: "Delete fails or this emailAddress is not in LogInUser"});
		}
	} catch (error) {
		console.log("ERROR " + result);
		res.status(500).json({success: false, message: "error exists in deleting login user"});
	}
})





// router.get('/count-mbtitable', async (req, res) => {
// 	const tableCount = await appService.countDemotable();
// 	if (tableCount >= 0) {
// 		res.json({ 
// 			success: true,  
// 			count: tableCount
// 		});
// 	} else {
// 		res.status(500).json({ 
// 			success: false, 
// 			count: tableCount
// 		});
// 	}
// });


module.exports = router;