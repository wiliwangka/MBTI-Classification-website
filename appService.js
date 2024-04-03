// Adapted from Tutorial 8 - CPSC304_Node_Project, https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project.git at appService.js

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const initialization = require('./Initialization')

const envVariables = loadEnvFile('./.env');

var usernameGenerator = 0;

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
	user: envVariables.ORACLE_USER,
	password: envVariables.ORACLE_PASS,
	connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
	poolMin: 1,
	poolMax: 3,
	poolIncrement: 1,
	poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
	try {
		await oracledb.createPool(dbConfig);
		console.log('Connection pool started');
	} catch (err) {
		console.error('Initialization error: ' + err.message);
	}
}

async function closePoolAndExit() {
	console.log('\nTerminating');
	try {
		await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
		console.log('Pool closed');
		process.exit(0);
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
}

initializeConnectionPool();

process
	.once('SIGTERM', closePoolAndExit)
	.once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
	let connection;
	try {
		connection = await oracledb.getConnection(); // Gets a connection from the default pool 
		return await action(connection);
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (err) {
				console.error(err);
			}
		}
	}
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
	return await withOracleDB(async (connection) => {
		return true;
	}).catch(() => {
		return false;
	});
}

async function logIn(emailAddress, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM LoginUser WHERE emailAddress=:emailAddress AND password=:password', {
            emailAddress: emailAddress,
            password: password
        });
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return [];
        }
        
    }).catch((error) => { 
        throw error;
    });
}

async function fetchDemotableFromDb() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT * FROM DEMOTABLE');
		return result.rows;
	}).catch(() => {
		return [];
	});
}

async function initialize() {
	usernameGenerator = 0;
	return await withOracleDB((connection) => {
		const result = initialization.initiateAllTables(connection);
		return result;
	}).catch((err) => {
		if (typeof err === "string") {
			throw Error(err);
		} else if (err instanceof Error) {
			throw err;
		} else {
			console.log(err);
		}
	});
}


async function insertLoginUser(emailAddress, password, mbtiName = null, age = null, country = null, userGender = null) {
	return await withOracleDB(async (connection) => {
		
		let username = getUsername();
		const result1 = await connection.execute(
			`INSERT INTO MyUser (username) VALUES (:username)`,
			[username],
			{ autoCommit: true }
		);

		//let foreignUsername = "(SELECT username FROM MyUser WHERE username = :username)";
		const result2 = await connection.execute(
			`INSERT INTO LoginUser (username, emailAddress, password, mbtiName, age, country, userGender)
			VALUES (:username, :emailAddress, :password, :mbtiName, :age, :country, :userGender)`,
			[username, emailAddress, password, mbtiName, age, country, userGender],
			{ autoCommit: true });
		console.log("insert success");
		/*
		try {
			const result2 = await connection.execute(
				`INSERT INTO LoginUser (username, emailAddress, password, mbtiName, age, country, userGender)
				VALUES (:username, :emailAddress, :password, :mbtiName, :age, :country, :userGender)`,
				[username, emailAddress, password, mbtiName, age, country, userGender],
				{ autoCommit: true });
				
			console.log("insert success");
		} catch (err) {
			// Delete result1 from MyUser
			if (typeof err === "string") {
				throw Error(err);
			} else if (err instanceof Error) {
				throw err;
			} else {
				console.log(err);
			}
		}
		*/
		return result1.rowsAffected && result1.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
	}).catch((err) => {
		console.log(err);
		return false;
	});
}

function getUsername() {
	usernameGenerator += 1;
	return `user${usernameGenerator}`;
	// oracle, is the string is just number orical will auto convert to interger
	// return toString(usernameGenerator);
}

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

async function submitQuestions(emailAddress, startDateTime, EIScore, SNScore, TFScore, JPScore) {
	let mbtiType = calculateMBTIScores(EIScore, SNScore, TFScore, JPScore);  //get the test result mbtiType
	const tid = await getMaxTid();	// assign a tid for the test
	if (tid == -1) {
		return null;
	}
	if (emailAddress) {
		// the user is login user
		const result1 = await updateLoginUserMbti(emailAddress, mbtiType);       		//update user's mbti
		const result2 = await updateOutputs_2(emailAddress, startDateTime, tid); 		//update Outputs_2 table
		const result3 = await insertQuestion(tid, EIScore, SNScore, TFScore, JPScore);  //update question table
		const result4 = await updateOutputs_3(tid, EIScore, SNScore, TFScore, JPScore); 	 //update Outputs_3 table
		if (result1 && result2 && result3 && result4) {
			return mbtiType;
		} else {
			return null;
		}
	} else {
		// the user is guestUser
		let username = getUsername();
		const result1 = await connection.execute(
			`INSERT INTO MyUser (username) VALUES (:username)`,
			[username],
			{ autoCommit: true });
		const result2 = await updateOutputs_2_guest(username, startDateTime, tid); 		//update Outputs_2 table
		const result3 = await insertQuestion(tid, EIScore, SNScore, TFScore, JPScore);  //update question table
		const result4 = await updateOutputs_3(tid, EIScore, SNScore, TFScore, JPScore); 	 //update Outputs_3 table
		if (result1 && result2 && result3 && result4) {
			return mbtiType;
		} else {
			return null;
		}
	}	
}

async function updateOutputs_2_guest(username, startDateTime, tid){
	return await withOracleDB(async (connection) => {
	  const sql = `
	  INSERT INTO Outputs_2 (TID, startDateTime, username)
	  VALUES (:tid, :startDateTime, :username)`;
	  const result = await connection.execute(sql, [tid, startDateTime, username], {
		  autoCommit: true 
		});
		return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
	  return false;
  });
}


async function updateOutputs_3(tid, EIScore, SNScore, TFScore, JPScore) {
	return await withOracleDB(async (connection) => {
		const sql = `
		INSERT INTO Outputs_3 (TID, EIScore, SNScore, TFScore, JPScore)
		VALUES (:tid, :EIScore, :SNScore, :TFScore, :JPScore)`;
		const result = await connection.execute(sql, [tid, EIScore, SNScore, TFScore, JPScore], {
			autoCommit: true 
		  });
		  return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function updateOutputs_2(emailAddress, startDateTime, tid){
  	return await withOracleDB(async (connection) => {
		const sql = `
		INSERT INTO Outputs_2 (TID, startDateTime, username)
		SELECT :TID, TO_TIMESTAMP(:startDateTime, 'YYYY-MM-DD HH24:MI:SS'), lu.username
		FROM LoginUser lu
		WHERE lu.emailAddress = :emailAddress`;
		const result = await connection.execute(sql, {
			TID: tid, 
			startDateTime: startDateTime,
			emailAddress: emailAddress
		  }, {
			autoCommit: true 
		  });
		  return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function insertQuestion(tid, EIScore, SNScore, TFScore, JPScore) {
	return await withOracleDB(async (connection) => {
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
            await connection.execute(insertSql, {
                questionNumber: score.questionNumber,
                tid: tid,
                questionScoreType: score.questionScoreType,
                questionAnswer: score.questionAnswer
            }, { autoCommit: true });

        }
		return true;

	}).catch(() => {
		return false;
	});
	

}

//Get the current max Tid in Db to see how many tests are there
async function getMaxTid() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT MAX(TID) AS max_tid FROM Outputs_2');
		let tid;
		if (result.rows[0][0] === null) {
			console.log('no test existed');
			tid = 1;
		} else {
			tid = result.rows[0][0] + 1;
		}
		return tid;
	}).catch(() => {
		return -1;
	});
}



async function getRecommendedVideos(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT videoTitle, videoType, videoLink
		FROM IsRecommendedVideo IRV, MyVideo V
		WHERE IRV.videoLink = V.videoLink AND IRV.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
		return result;
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function countRecommendedVideos(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT COUNT (*)
		FROM IsRecommendedVideo IRV
		WHERE IRV.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function getRecommendedBooks(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT bookTitle, bookAuthor, bookURL
		FROM IsRecommendedBook IRB, MyBook B
		WHERE IRB.bookURL = B.bookURL AND IRB.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
		return result;
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function countRecommendedBooks(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT COUNT (*)
		FROM IsRecommendedBook IRB
		WHERE IRB.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
		return result;
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function getRecommendedArticles(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT articleTitle, articleAuthor, articleText, articleURL
		FROM IsRecommendedArticle IRA, MyArticle A
		WHERE IRA.articleURL = A.articleURL AND IRA.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
		return result;
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function countRecommendedArticles(mbtiType) {
	return withOracleDB(async(connection) => {
		const result = await connection.execute(
		`SELECT COUNT (*)
		FROM IsRecommendedArticle IRA
		WHERE IRA.mbtiName = :mbtiType
		`,
		[mbtiType],
		{ autoCommit: true });
	}).catch(() => {
		// What should happen if there is an error?
	});
}

async function updateEmail(username, oldEmail, newEmail) {
	// Find a way to only update if the given username is correct
	return await withOracleDB(async (connection) => {
		const result = await connection.execute(
			`UPDATE LoginUser SET name=:newEmail WHERE name=:oldEmail`,
			[newEmail, oldEmail],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function updatePassword(username, oldPassword, newPassword) {
	// Find a way to only update if the given username is correct
	return await withOracleDB(async (connection) => {
		const result = await connection.execute(
			`UPDATE LoginUser SET name=:newPassword WHERE name=:oldPassword`,
			[newPassword, oldPassword],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function updateLoginUserMbti(emailAddress, mbtiType) {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute(
			`UPDATE LoginUser SET mbtiName=:mbtiType WHERE emailAddress=:emailAddress`,
			[mbtiType, emailAddress],
			{ autoCommit: true }
		);
		return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function updateAccountInfo(email, mbti, age, country) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE AccountTable SET mbti = :mbti, age = :age, country = :country WHERE email = :email`,
            { mbti, age, country, email },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error updating account info:', error);
        return false;
    });
}

async function countUsers() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT Count(*) FROM MyUser');
		return result.rows[0][0];
	}).catch(() => {
		return -1;
	});
}

async function countLoginUsers() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT Count(*) FROM LoginUser');
		return result.rows[0][0];
	}).catch(() => {
		return -1;
	});
}

async function getUserTable() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT * FROM User');
		return result
	}).catch(() => {
		return -1;
	});
}

async function getLoginUserTable() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT * FROM LoginUser');
		return result
	}).catch(() => {
		return -1;
	});
}

module.exports = {
	testOracleConnection,
	fetchDemotableFromDb,
	initialize,
	insertLoginUser,
	updateAccountInfo,
	countUsers,
	countLoginUsers,
    logIn,
	calculateMBTIScores,
	submitQuestions
};