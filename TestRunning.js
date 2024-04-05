function calculateMBTIScores(EIScore, SNScore, TFScore, JPScore) {
	retVal = "";
	if (EIScore > 50) {
		retVal = retVal + "E"
	} else {
		retVal = retVal + "I"
	}
	if (SNScore > 50) {
		retVal = retVal + "S"
	} else {
		retVal = retVal + "N"
	}
	if (TFScore > 50) {
		retVal = retVal + "T"
	} else {
		retVal = retVal + "F"
	}
	if (JPScore > 50) {
		retVal = retVal + "J"
	} else {
		retVal = retVal + "P"
	}
	return retVal;
}

async function submitQuestions(connection, emailAddress, startDateTime, EIScore, SNScore, TFScore, JPScore) {
	let mbtiType = calculateMBTIScores(EIScore, SNScore, TFScore, JPScore);  //get the test result mbtiType
	const tid = await getMaxTid(connection);	// assign a tid for the test
	if (tid == -1) {
		return null;
	}
	if (emailAddress) {
		// the user is login user
		const result1 = await updateMBTI(connection, emailAddress, mbtiType)      		//update user's mbti
		const result2 = await updateOutputs_2(connection, emailAddress, startDateTime, tid); 		//update Outputs_2 table
		const result3 = await insertQuestion(connection, tid, EIScore, SNScore, TFScore, JPScore);  //update question table
		const result4 = await updateOutputs_3(connection, tid, EIScore, SNScore, TFScore, JPScore); 	 //update Outputs_3 table
		if (result1 && result2 && result3 && result4) {
			return mbtiType;
		} else {
			return null;
		}
	} else {
		// the user is guestUser
		let username = await makeGuestUser(connection);
		const result2 = await updateOutputs_2_guest(connection, username, startDateTime, tid); 		//update Outputs_2 table
		const result3 = await insertQuestion(connection, tid, EIScore, SNScore, TFScore, JPScore);  //update question table
		const result4 = await updateOutputs_3(connection, tid, EIScore, SNScore, TFScore, JPScore); 	 //update Outputs_3 table
		if (result2 && result3 && result4) {
			return mbtiType;
		} else {
			return null;
		}
	}	
}

async function updateOutputs_2_guest(connection, username, startDateTime, tid){
	// Convert to ISO string and remove milliseconds and Z
	//startDateTime = "2023-03-25 14:30:15";
	// console.log(timestamp);
	
	const sql = `
	INSERT INTO Outputs_2 (TID, startDateTime, username)
	VALUES (:tid, TO_TIMESTAMP(:startDateTime, 'YYYY-MM-DD HH24:MI:SS'), :username)`;
	
	const result = await connection.execute(sql,
		[tid, startDateTime, username],
		{autoCommit: true});
	return result.rowsAffected && result.rowsAffected > 0;
}


async function updateOutputs_3(connection, tid, EIScore, SNScore, TFScore, JPScore) {
	const sql = `
	INSERT INTO Outputs_3 (TID, EIScore, SNScore, TFScore, JPScore)
	VALUES (:tid, :EIScore, :SNScore, :TFScore, :JPScore)`;
	const result = await connection.execute(sql,
		[tid, EIScore, SNScore, TFScore, JPScore],
		{autoCommit: true});
	  return result.rowsAffected && result.rowsAffected > 0;
}

async function updateOutputs_2(connection, emailAddress, startDateTime, tid){
	const sql = `
	INSERT INTO Outputs_2 (TID, startDateTime, username)
	SELECT :TID, TO_TIMESTAMP(:startDateTime, 'YYYY-MM-DD HH24:MI:SS'), lu.username
	FROM LoginUser lu
	WHERE lu.emailAddress = :emailAddress`;
	const result = await connection.execute(sql,
		{
			TID: tid, 
			startDateTime: startDateTime,
			emailAddress: emailAddress
		},
		{autoCommit: true});
	return result.rowsAffected && result.rowsAffected > 0;
}

async function insertQuestion(connection, tid, EIScore, SNScore, TFScore, JPScore) {
	const insertSql = `
		INSERT INTO Question (questionNumber, TID, questionScoreType, questionAnswer)
		VALUES (:questionNumber, :tid, :questionScoreType, :questionAnswer)
	`;

	const scores = [
		{questionNumber: 1, questionScoreType: 'EI', questionAnswer: EIScore},
		{questionNumber: 2, questionScoreType: 'SN', questionAnswer: SNScore},
		{questionNumber: 3, questionScoreType: 'TF', questionAnswer: TFScore},
		{questionNumber: 4, questionScoreType: 'JP', questionAnswer: JPScore}
	];

	for (const score of scores) {
		await connection.execute(insertSql,
			{
				questionNumber: score.questionNumber,
				tid: tid,
				questionScoreType: score.questionScoreType,
				questionAnswer: score.questionAnswer
			},
			{ autoCommit: true });
	}
	return true;
}

//Get the current max Tid in Db to see how many tests are there
async function getMaxTid(connection) {
	const result = await connection.execute('SELECT MAX(TID) AS max_tid FROM Outputs_2');
	let tid;
	if (result.rows[0][0] === null) {
		console.log('no test existed');
		tid = 1;
	} else {
		tid = result.rows[0][0] + 1;
	}
	return tid;
}

async function updateMBTI(connection, emailAddress, newMBTI) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET mbtiName = :newMBTI WHERE emailAddress = :emailAddress`,
			[newMBTI, emailAddress],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

async function makeGuestUser(connection) {
	let usernameGenerator = 1;
	let takenUsernames = await connection.execute(`SELECT * FROM MyUser`);
	let guestUsername = `user${usernameGenerator}`;
	while (await isUsernameTaken(connection, guestUsername)) {
		usernameGenerator += 1;
		guestUsername = `user${usernameGenerator}`;
	}
	let result = await connection.execute(
		`INSERT INTO MyUser (username) VALUES (:guestUsername)`,
		[guestUsername],
		{ autoCommit: true });
	return guestUsername;
}

async function isUsernameTaken(connection, potentialUsername) {
	let result = await connection.execute(`SELECT username FROM MyUser WHERE username = :potentialUsername`,
	[potentialUsername],
	{ autoCommit: true });
	return result.rows.length > 0;
}

module.exports = {
    calculateMBTIScores,
    submitQuestions,
    getMaxTid
};