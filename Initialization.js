const appServiceMain = require('./appService');

async function initiateAllTables(connection) {
	try {
		const result1 = await dropAllTables(connection);
		const result2 = await createAllTables(connection);
		const result3 = await insertMBTI_Types(connection);
		const result4 = await insertOutputs_4(connection); //populate Outputs_4 table
		return true;
	} catch(err) {
		if (typeof err === "string") {
			throw Error(err);
		} else if (err instanceof Error) {
			throw err;
		} else {
			console.log(err);
		}
	}
	
}

// async function dropAllTables(connection) {
// 	let tableNames = [
// 		"IsRecommendedArticle",
// 		"IsRecommendedBook",
// 		"IsRecommendedVideo",
// 		"MyArticle",
// 		"MyBook",
// 		"MyVideo",
// 		"Outputs_3",
// 		"Outputs_4",
// 		"Question",
// 		"Outputs_2",
// 		"LoginUser",
// 		"MBTI_Type",
// 		"MyUser"
// 	];
// 	for (let tableName of tableNames) {
// 		try {
// 			await connection.execute(`DROP TABLE :tableName`,
// 			[tableName],
// 			{autoCommit: true});

// 			console.log(`drop table ${tableName}`);
// 		} catch(err) {
// 			console.log("Table " + tableName + " might not exist, proceeding to create...");
// 		}
// 	}
// }
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
			await connection.execute(`DROP TABLE ${tableName}`, [], {autoCommit: true});
			// console.log(`Dropped table ${tableName}`);
		} catch (err) {
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
			username VARCHAR(63) NOT NULL,
			emailAddress VARCHAR(255) NOT NULL,
			password VARCHAR(255) NOT NULL,
			mbtiName CHAR(4),
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
		[mbtiNames[i], mbtiDescriptions[i]],
		{ autoCommit: true }
		);
	}
}

async function insertOutputs_4(connection) {
	const scores = [
		{mbtiName: 'INFP', EIScore: 0, SNScore: 0, TFScore: 0, JPScore: 0},
		{mbtiName: 'INFJ', EIScore: 0, SNScore: 0, TFScore: 0, JPScore: 100},
		{mbtiName: 'INTP', EIScore: 0, SNScore: 0, TFScore: 100, JPScore: 0},
		{mbtiName: 'INTJ', EIScore: 0, SNScore: 0, TFScore: 100, JPScore: 100},
		{mbtiName: 'ISFP', EIScore: 0, SNScore: 100, TFScore: 0, JPScore: 0},
		{mbtiName: 'ISFJ', EIScore: 0, SNScore: 100, TFScore: 0, JPScore: 100},
		{mbtiName: 'ISTP', EIScore: 0, SNScore: 100, TFScore: 100, JPScore: 0},
		{mbtiName: 'ISTJ', EIScore: 0, SNScore: 100, TFScore: 100, JPScore: 100},
		{mbtiName: 'ENFP', EIScore: 100, SNScore: 0, TFScore: 0, JPScore: 0},
		{mbtiName: 'ENFJ', EIScore: 100, SNScore: 0, TFScore: 0, JPScore: 100},
		{mbtiName: 'ENTP', EIScore: 100, SNScore: 0, TFScore: 100, JPScore: 0},
		{mbtiName: 'ENTJ', EIScore: 100, SNScore: 0, TFScore: 100, JPScore: 100},
		{mbtiName: 'ESFP', EIScore: 100, SNScore: 100, TFScore: 0, JPScore: 0},
		{mbtiName: 'ESFJ', EIScore: 100, SNScore: 100, TFScore: 0, JPScore: 100},
		{mbtiName: 'ESTP', EIScore: 100, SNScore: 100, TFScore: 100, JPScore: 0},
		{mbtiName: 'ESTJ', EIScore: 100, SNScore: 100, TFScore: 100, JPScore: 100},
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


async function insertrecommendedcontent(){
 insertRecommendedArticles();
 insertRecommendedBooks();
 insertRecommendedVideos();
 insertMyArticle();
 insertMyBook();
 insertMyVideo();

}
//   mbtiName CHAR(4) NOT NULL,
//     videoLink VARCHAR(255) NOT NULL,
//     PRIMARY KEY (mbtiName, videoLink),
//     FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
//     FOREIGN KEY (videoLink) REFERENCES MyVideo(videoLink) ON DELETE CASCADE
async function insertRecommendedVideos(connection) {
    const videos = [
        { mbtiName: 'INFP', videoLink: 'http://example.com/video/infp' },
        // Add more entries for each MBTI type with appropriate video links
    ];

    const insertSql = `
        INSERT INTO IsRecommendedVideo (mbtiName, videoLink)
        VALUES (:mbtiName, :videoLink)
    `;

    for (const video of videos) {
        await connection.execute(insertSql, {
            mbtiName: video.mbtiName,
            videoLink: video.videoLink
        }, { autoCommit: true });
    }
}


async function insertRecommendedBooks(connection) {
    const books = [
        { mbtiName: 'INFP', bookURL: 'http://example.com/book/infp' },
        // Add more entries for each MBTI type with appropriate book URLs
    ];

    const insertSql = `
        INSERT INTO IsRecommendedBook (mbtiName, bookURL)
        VALUES (:mbtiName, :bookURL)
    `;

    for (const book of books) {
        await connection.execute(insertSql, {
            mbtiName: book.mbtiName,
            bookURL: book.bookURL
        }, { autoCommit: true });
    }
}

async function insertRecommendedArticles(connection) {
    const articles = [
        { mbtiName: 'INFP', articleURL: 'http://example.com/article/infp' },
        // Add more entries for each MBTI type with appropriate article URLs
    ];

    const insertSql = `
        INSERT INTO IsRecommendedArticle (mbtiName, articleURL)
        VALUES (:mbtiName, :articleURL)
    `;

    for (const article of articles) {
        await connection.execute(insertSql, {
            mbtiName: article.mbtiName,
            articleURL: article.articleURL
        }, { autoCommit: true });
    }
}

async function insertMyVideo(connection) {
    const videos = [
        { videoLink: 'http://example.com/video/infp', videoType: 'Motivational', videoTitle: 'INFP Inspiration' },
        // Add more entries for each MBTI type with appropriate video links, types, and titles
    ];

    const insertSql = `
        INSERT INTO MyVideo (videoLink, videoType, videoTitle)
        VALUES (:videoLink, :videoType, :videoTitle)
    `;

    for (const video of videos) {
        await connection.execute(insertSql, {
            videoLink: video.videoLink,
            videoType: video.videoType,
            videoTitle: video.videoTitle
        }, { autoCommit: true });
    }
}

async function insertMyBook(connection) {
    const books = [
        { bookURL: 'http://example.com/book/infp', bookTitle: 'INFP: The Dreamer', bookAuthor: 'Jane Doe' },
        // Add more entries for each MBTI type with appropriate book URLs, titles, and authors
    ];

    const insertSql = `
        INSERT INTO MyBook (bookURL, bookTitle, bookAuthor)
        VALUES (:bookURL, :bookTitle, :bookAuthor)
    `;

    for (const book of books) {
        await connection.execute(insertSql, {
            bookURL: book.bookURL,
            bookTitle: book.bookTitle,
            bookAuthor: book.bookAuthor
        }, { autoCommit: true });
    }
}
async function insertMyArticle(connection) {
    const articles = [
        { articleURL: 'http://example.com/article/infp', articleTitle: 'Understanding the INFP', articleAuthor: 'John Smith', articleText: 'INFPs are...' },
        // Add more entries for each MBTI type with appropriate article URLs, titles, authors, and texts
    ];

    const insertSql = `
        INSERT INTO MyArticle (articleURL, articleTitle, articleAuthor, articleText)
        VALUES (:articleURL, :articleTitle, :articleAuthor, :articleText)
    `;

    for (const article of articles) {
        await connection.execute(insertSql, {
            articleURL: article.articleURL,
            articleTitle: article.articleTitle,
            articleAuthor: article.articleAuthor,
            articleText: article.articleText
        }, { autoCommit: true });
    }
}



module.exports = {
	initiateAllTables
};