// Adapted from Tutorial 8 - CPSC304_Node_Project, https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project.git at appService.js

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

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
            return null;
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

async function initiateAllTables() {
	return await withOracleDB(async (connection) => {
		await dropAllTables(connection);
		await createAllTables(connection);
		await insertMBTI_Types(connection);
		await insertOutputs_4(connection); //populate Outputs_4 table
		usernameGenerator = 0;
		return true;
	}).catch(() => {
		return false;
	});
}

async function dropAllTables(connection) {
	let tableNames = [
		"IsRecommendedArticle",
		"IsRecommendedBook",
		"IsRecommendedVideo",
		"MyArticle",
		"MyBook",
		"MyVideo",
		"Outputs_3",
		"Outputs_4",
		"Question",
		"Outputs_2",
		"LoginUser",
		"MBTI_Type",
		"MyUser"
	];
	for (let tableName of tableNames) {
		try {
			await connection.execute(`DROP TABLE :tableName`,
			[tableName],
			{autoCommit: true});
		} catch(err) {
			console.log("Table " + tableName + " might not exist, proceeding to create...");
		}
	}
}

async function createAllTables(connection) {
	await createMyUser(connection);
	await createMBTI_Type(connection);
	await createLoginUser(connection);
	await createOutputs_2(connection);
	await createQuestion(connection);
	await createOutputs_4(connection);
	await createOutputs_3(connection);
	await createMyVideo(connection);
	await createMyBook(connection);
	await createMyArticle(connection);
	await createIsRecommendedVideo(connection);
	await createIsRecommendedBook(connection);
	await createIsRecommendedArticle(connection);
}

async function createMyUser(connection) {
	return await connection.execute(
		`CREATE TABLE MyUser (
			username VARCHAR(63) NOT NULL,
			PRIMARY KEY (username)
		)`
	);
}

async function createMBTI_Type(connection) {
	return await connection.execute(
		`CREATE TABLE MBTI_Type (
			mbtiName CHAR(4) NOT NULL,
			mbtiDescription VARCHAR(1000) NOT NULL,
			PRIMARY KEY (mbtiName)
		)`
	);
}

async function createLoginUser(connection) {
	return await connection.execute(
		`CREATE TABLE LoginUser (
			mbtiName CHAR(4) NOT NULL,
			username VARCHAR(63) NOT NULL,
			password VARCHAR(255) NOT NULL,
			emailAddress VARCHAR(255) NOT NULL,
			age INT,
			country VARCHAR(255),
			userGender CHAR(1),
			PRIMARY KEY (username),
			UNIQUE (emailAddress),
			FOREIGN KEY (username) REFERENCES MyUser(username) ON DELETE CASCADE,
			FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE
		)`
	);
}

async function createOutputs_2(connection) {
	return await connection.execute(
		`CREATE TABLE Outputs_2 (
			TID INT NOT NULL,
			RID INT NOT NULL,
			startDateTime TIMESTAMP NOT NULL,
			username VARCHAR(63) NOT NULL,
			PRIMARY KEY (TID),
			FOREIGN KEY (username) REFERENCES MyUser(username) ON DELETE CASCADE
		)`
	);
}

async function createQuestion(connection) {
	return await connection.execute(
		`CREATE TABLE Question (
			questionNumber INT NOT NULL,
			TID INT NOT NULL,
			questionDescription VARCHAR(1000) NOT NULL,
			questionAnswer INT,
			questionScoreType CHAR(2) NOT NULL,
			PRIMARY KEY (questionNumber, TID),
			FOREIGN KEY (TID) REFERENCES Outputs_2(TID) ON DELETE CASCADE
		)`
	);
}

async function createOutputs_4(connection) {
	return await connection.execute(
		`CREATE TABLE Outputs_4 (
			mbtiName CHAR(4) NOT NULL,
			EIScore REAL NOT NULL,
			SNScore REAL NOT NULL,
			TFScore REAL NOT NULL,
			JPScore REAL NOT NULL,
			PRIMARY KEY (EIScore, SNScore, TFScore, JPScore)
		)`
	);
}

async function createOutputs_3(connection) {
	return await connection.execute(
		`CREATE TABLE Outputs_3 (
			TID INT NOT NULL,
			EIScore REAL NOT NULL,
			SNScore REAL NOT NULL,
			TFScore REAL NOT NULL,
			JPScore REAL NOT NULL,
			PRIMARY KEY (TID, EIScore, SNScore, TFScore, JPScore),
			FOREIGN KEY (EIScore, SNScore, TFScore, JPScore) REFERENCES Outputs_4(EIScore, SNScore, TFScore, JPScore) ON DELETE CASCADE,
			FOREIGN KEY (TID) REFERENCES Outputs_2(TID) ON DELETE CASCADE
		)`
	);
}

async function createMyVideo(connection) {
	return await connection.execute(
		`CREATE TABLE MyVideo (
			videoLink VARCHAR(255) NOT NULL,
			videoType VARCHAR(255),
			videoTitle VARCHAR(255) NOT NULL,
			PRIMARY KEY (videoLink)
		)`
	);
}

async function createMyBook(connection) {
	return await connection.execute(
		`CREATE TABLE MyBook (
			bookURL VARCHAR(255) NOT NULL,
			bookTitle VARCHAR(255) NOT NULL,
			bookAuthor VARCHAR(255) NOT NULL,
			PRIMARY KEY (bookURL)
		)`
	);
}

async function createMyArticle(connection) {
	return await connection.execute(
		`CREATE TABLE MyArticle (
			articleURL VARCHAR(255) NOT NULL,
			articleTitle VARCHAR(255) NOT NULL,
			articleAuthor VARCHAR(255) NOT NULL,
			articleText VARCHAR(1000) NOT NULL,
			PRIMARY KEY (articleURL)
		)`
	);
}

async function createIsRecommendedVideo(connection) {
	return await connection.execute(
		`CREATE TABLE IsRecommendedVideo (
			mbtiName CHAR(4) NOT NULL,
			videoLink VARCHAR(255) NOT NULL,
			PRIMARY KEY (mbtiName, videoLink),
			FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
			FOREIGN KEY (videoLink) REFERENCES MyVideo(videoLink) ON DELETE CASCADE
		)`
	);
}

async function createIsRecommendedBook(connection) {
	return await connection.execute(
		`CREATE TABLE IsRecommendedBook (
			mbtiName CHAR(4) NOT NULL,
			bookURL VARCHAR(255) NOT NULL,
			PRIMARY KEY (mbtiName, bookURL),
			FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
			FOREIGN KEY (bookURL) REFERENCES MyBook(bookURL) ON DELETE CASCADE
		)`
	);
}

async function createIsRecommendedArticle(connection) {
	return await connection.execute(
		`CREATE TABLE IsRecommendedArticle (
			mbtiName CHAR(4) NOT NULL,
			articleURL VARCHAR(255) NOT NULL,
			PRIMARY KEY (mbtiName, articleURL),
			FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
			FOREIGN KEY (articleURL) REFERENCES MyArticle(articleURL) ON DELETE CASCADE
		)`
	);
}

async function insertMBTI_Types(connection) {
	mbtiNames = [
		"ISTJ", "ISTP", "ISFJ", "ISFP",
		"INTJ", "INTP", "INFJ", "INFP",
		"ESTJ", "ESTP", "ESFJ", "ESFP",
		"ENTJ", "ENTP", "ENFJ", "ENFP"
	];
	mbtiDescriptions = [
		"Number A", "Number B", "Number C", "Number D",
		"Number E", "Number F", "Number G", "Number H",
		"Number I", "Number J", "Number K", "Number L",
		"Number M", "Number N", "Number O", "Number P"
	];
	for (let i = 0; i < 16; i++) {
		await connection.execute(`INSERT INTO MBTI_Type (mbtiName, mbtiDescription) VALUES (:mbtiName, :mbtiDescription)`,
		[mbtiNames, mbtiDescriptions],
		{ autoCommit: true }
		);
	}
}

async function insertOutputs_4(connection) {
	const scores = [
		{mbtiName: 'INFP', EIScore: 0, SNScore: 0,TFScore: 0, JPScore: 0},
		{mbtiName: 'INFJ', EIScore: 0, SNScore: 0,TFScore: 0, JPScore: 100},
		{mbtiName: 'INTP', EIScore: 0, SNScore: 0,TFScore: 100, JPScore: 0},
		{mbtiName: 'INTJ', EIScore: 0, SNScore: 0,TFScore: 100, JPScore: 100},
		{mbtiName: 'ISFP', EIScore: 0, SNScore: 100,TFScore: 0, JPScore: 0},
		{mbtiName: 'ISFJ', EIScore: 0, SNScore: 100,TFScore: 0, JPScore: 100},
		{mbtiName: 'ISTP', EIScore: 0, SNScore: 100,TFScore: 100, JPScore: 0},
		{mbtiName: 'ISTJ', EIScore: 0, SNScore: 100,TFScore: 100, JPScore: 100},
		{mbtiName: 'ENFP', EIScore: 100, SNScore: 0,TFScore: 0, JPScore: 0},
		{mbtiName: 'ENFJ', EIScore: 100, SNScore: 0,TFScore: 0, JPScore: 100},
		{mbtiName: 'ENTP', EIScore: 100, SNScore: 0,TFScore: 100, JPScore: 0},
		{mbtiName: 'ENTJ', EIScore: 100, SNScore: 0,TFScore: 100, JPScore: 100},
		{mbtiName: 'ESFP', EIScore: 100, SNScore: 100,TFScore: 0, JPScore: 0},
		{mbtiName: 'ESFJ', EIScore: 100, SNScore: 100,TFScore: 0, JPScore: 100},
		{mbtiName: 'ESTP', EIScore: 100, SNScore: 100,TFScore: 100, JPScore: 0},
		{mbtiName: 'ESTJ', EIScore: 100, SNScore: 100,TFScore: 100, JPScore: 100},
	];

	const insertSql = `
            INSERT INTO Outputs_4 (mbtiName, EIScore, SNScore, TFScore, JPScore)
            VALUES (:mbtiName, :EIScore, :SNScore, :TFScore, :JPScore)
        `;

	for (const score of scores) {
		await connection.execute(insertSql, {
			mbtiName: score.mbtiName,
			EIScore: score.EIScore,
			SNScore: score.SNScore,
			TFScore: score.TFScore,
			JPScore: score.JPScore
		}, { autoCommit: true });

	}
}

async function insertUser(mbtiName, password, emailAddress, age = "null", country = "null", userGender = "null") {
	return await withOracleDB(async (connection) => {
		let username = getUsername();
		const result1 = await connection.execute(
			`INSERT INTO MyUser (username) VALUES (:username)`,
			[username],
			{ autoCommit: true });

		if (mbtiName !== undefined && password !== undefined && emailAddress !== undefined) {
			const result2 = await connection.execute(
				`INSERT INTO LoginUser (mbtiName, username, password, emailAddress, age, country, userGender)
				VALUES (:mbtiName, :username, :password, :emailAddress, :age, :country, :userGender)`,
				[mbtiName, username, password, emailAddress, age, country, userGender],
				{ autoCommit: true });
			
			return result1.rowsAffected && result1.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
		} else {
			return result1.rowsAffected && result1.rowsAffected > 0;
		}
	}).catch(() => {
		return false;
	});
}

function getUsername() {
	usernameGenerator += 1;
	return toString(usernameGenerator);
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
			tid=1;
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

async function updateNameDemotable(oldName, newName) {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute(
			`UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
			[newName, oldName],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
	}).catch(() => {
		return false;
	});
}

async function countDemotable() {
	return await withOracleDB(async (connection) => {
		const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
		return result.rows[0][0];
	}).catch(() => {
		return -1;
	});
}

module.exports = {
	testOracleConnection,
	fetchDemotableFromDb,
	initiateAllTables,
	insertUser,
	updateNameDemotable,
	countDemotable,
    logIn,
	calculateMBTIScores,
	submitQuestions

};