const appServiceMain = require('./appService');

async function initiateAllTables(connection) {
	try {
		const result1 = await dropAllTables(connection);
		const result2 = await createAllTables(connection);
		const result3 = await insertMBTI_Types(connection);
		const result4 = await insertOutputs_4(connection); //populate Outputs_4 table
		const result5 = await insertMyArticle(connection);
		const result6 = await 	insertMyBook(connection);
		const result7 = await 	insertMyVideo(connection);
		const result8 = await insertRecommendedArticles(connection);
		const result9 = await insertRecommendedBooks(connection);
		const result10 = await insertRecommendedVideos(connection);
		
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


async function insertrecommendedcontent(connection){

	 insertMyArticle(connection);
	 insertMyBook(connection);
	 insertMyVideo(connection);
 insertRecommendedArticles(connection);
 insertRecommendedBooks(connection);
 insertRecommendedVideos(connection);


}

async function insertRecommendedVideos(connection) {
    const videos = [

		{mbtiName: 'ISTJ', videoLink: 'https://www.imdb.com/title/tt1895587/'},
		{mbtiName: 'ISFJ', videoLink: 'https://www.imdb.com/title/tt2980516/'},
		{mbtiName: 'INFJ', videoLink: 'https://www.imdb.com/title/tt0359950/'},
		{mbtiName: 'INTJ', videoLink: 'https://www.imdb.com/title/tt2543164/'},
		{mbtiName: 'ISTP', videoLink: 'https://www.imdb.com/title/tt2911666/'},
		{mbtiName: 'ISFP', videoLink: 'https://www.imdb.com/title/tt3783958/'},
		{mbtiName: 'INFP', videoLink: 'https://www.imdb.com/title/tt1605783/'},
		{mbtiName: 'INTP', videoLink: 'https://www.imdb.com/title/tt0470752/'},
		{mbtiName: 'ESTP', videoLink: 'https://www.imdb.com/title/tt1392190/'},
		{mbtiName: 'ESFP', videoLink: 'https://www.imdb.com/title/tt1981677/'},
		{mbtiName: 'ENFP', videoLink: 'https://www.imdb.com/title/tt2278388/'},
		{mbtiName: 'ENTP', videoLink: 'https://www.imdb.com/title/tt0993846/'},
		{mbtiName: 'ESTJ', videoLink: 'https://www.imdb.com/title/tt3659388/'},
		{mbtiName: 'ESFJ', videoLink: 'https://www.imdb.com/title/tt2380307/'},
		{mbtiName: 'ENFJ', videoLink: 'https://www.imdb.com/title/tt1020072/'},
		{mbtiName: 'ENTJ', videoLink: 'https://www.imdb.com/title/tt1285016/'},
		





		{mbtiName: 'INFP', videoLink: 'http://example.com/video/infp'},
		{mbtiName: 'INFJ', videoLink: 'http://example.com/video/infj'},
		{mbtiName: 'INTJ', videoLink: 'http://example.com/video/intj'},
		{mbtiName: 'INTP', videoLink: 'http://example.com/video/intp'},
		{mbtiName: 'ISFP', videoLink: 'http://example.com/video/isfp'},
		{mbtiName: 'ISFJ', videoLink: 'http://example.com/video/isfj'},
		{mbtiName: 'ISTP', videoLink: 'http://example.com/video/istp'},
		{mbtiName: 'ISTJ', videoLink: 'http://example.com/video/istj'},
		{mbtiName: 'ENFP', videoLink: 'http://example.com/video/enfp'},
		{mbtiName: 'ENFJ', videoLink: 'http://example.com/video/enfj'},
		{mbtiName: 'ENTJ', videoLink: 'http://example.com/video/entj'},
		{mbtiName: 'ENTP', videoLink: 'http://example.com/video/entp'},
		{mbtiName: 'ESFP', videoLink: 'http://example.com/video/esfp'},
		{mbtiName: 'ESFJ', videoLink: 'http://example.com/video/esfj'},
		{mbtiName: 'ESTP', videoLink: 'http://example.com/video/estp'},
		{mbtiName: 'ESTJ', videoLink: 'http://example.com/video/estj'}
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
		{mbtiName: 'INFP', bookURL: 'https://a.co/d/hak3RIa'},

		{mbtiName: 'INFJ', bookURL: 'http://amzn.to/2ayQC63'},
    {mbtiName: 'INTJ', bookURL: 'http://amzn.to/2ayQzXI'},
    {mbtiName: 'INTP', bookURL: 'http://amzn.to/2apDoCL'},
    {mbtiName: 'ISFJ', bookURL: 'http://amzn.to/2amlftS'},
    {mbtiName: 'ISTJ', bookURL: 'http://amzn.to/2amll4T'},
    {mbtiName: 'ISTP', bookURL: 'http://amzn.to/2apEn5H'},
    {mbtiName: 'ISFP', bookURL: 'http://amzn.to/2amlftS'},
    {mbtiName: 'ENFJ', bookURL: 'http://amzn.to/2aXoOb4'},
    {mbtiName: 'ENFP', bookURL: 'http://amzn.to/2ay7sf9'},
    {mbtiName: 'ENTJ', bookURL: 'http://amzn.to/2ay7YK3'},
    {mbtiName: 'ENTP', bookURL: 'http://amzn.to/2ammN79'},
    {mbtiName: 'ESFJ', bookURL: 'http://amzn.to/2amn6Ps'},
    {mbtiName: 'ESFP', bookURL: 'http://amzn.to/2azbCXf'},
    {mbtiName: 'ESTJ', bookURL: 'http://amzn.to/2aBUWyO'},
    {mbtiName: 'ESTP', bookURL: 'http://amzn.to/2azbCXf'},
		
		{mbtiName: 'INFP', bookURL: 'http://example.com/book'},
		{mbtiName: 'INFP', bookURL: 'http://example.com/book/infj'},
		{mbtiName: 'INFJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'INTJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'INTP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ISFP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ISFJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'ISTP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ISTJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'ENFP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ENFJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'ENTJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'ENTP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ESFP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ESFJ', bookURL: 'http://example.com/book'},
		{mbtiName: 'ESTP', bookURL: 'http://example.com/book'},
		{mbtiName: 'ESTJ', bookURL: 'http://example.com/book'}
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
		{mbtiName: 'INFP', articleURL: 'http://example.com/article/infp'},


		{mbtiName: 'INFJ', articleURL: 'http://example.com/article/infj'},


		{mbtiName: 'INTJ', articleURL: 'http://example.com/article/intj'},

		{mbtiName: 'INTP', articleURL: 'http://example.com/article/intp'},

		{mbtiName: 'ISFP', articleURL: 'http://example.com/article/isfp'},

		{mbtiName: 'ISFJ', articleURL: 'http://example.com/article/isfj'},

		{mbtiName: 'ISTP', articleURL: 'http://example.com/article/istp'},

		{mbtiName: 'ISTJ', articleURL: 'http://example.com/article/istj'},
		{mbtiName: 'ENFP', articleURL: 'http://example.com/article/enfp'},
		{mbtiName: 'ENFJ', articleURL: 'http://example.com/article/enfj'},
		{mbtiName: 'ENTJ', articleURL: 'http://example.com/article/entj'},
		{mbtiName: 'ENTP', articleURL: 'http://example.com/article/entp'},
		{mbtiName: 'ESFP', articleURL: 'http://example.com/article/esfp'},
		{mbtiName: 'ESFJ', articleURL: 'http://example.com/article/esfj'},
		{mbtiName: 'ESTP', articleURL: 'http://example.com/article/estp'},
		{mbtiName: 'ESTJ', articleURL: 'http://example.com/article/estj'}
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

		{videoLink: 'https://www.imdb.com/title/tt1895587/', videoType: 'Drama', videoTitle: 'Spotlight'},
		{videoLink: 'https://www.imdb.com/title/tt2980516/', videoType: 'Biographical', videoTitle: 'The Theory of Everything'},
		{videoLink: 'https://www.imdb.com/title/tt0359950/', videoType: 'Adventure', videoTitle: 'The Secret Life of Walter Mitty'},
		{videoLink: 'https://www.imdb.com/title/tt2543164/', videoType: 'Science Fiction', videoTitle: 'Arrival'},
		{videoLink: 'https://www.imdb.com/title/tt2911666/', videoType: 'Action', videoTitle: 'John Wick'},
		{videoLink: 'https://www.imdb.com/title/tt3783958/', videoType: 'Musical', videoTitle: 'La La Land'},
		{videoLink: 'https://www.imdb.com/title/tt1605783/', videoType: 'Fantasy', videoTitle: 'Midnight in Paris'},
		{videoLink: 'https://www.imdb.com/title/tt0470752/', videoType: 'Science Fiction', videoTitle: 'Ex Machina'},
		{videoLink: 'https://www.imdb.com/title/tt1392190/', videoType: 'Action', videoTitle: 'Mad Max: Fury Road'},
		{videoLink: 'https://www.imdb.com/title/tt1981677/', videoType: 'Comedy', videoTitle: 'Pitch Perfect'},
		{videoLink: 'https://www.imdb.com/title/tt2278388/', videoType: 'Comedy', videoTitle: 'The Grand Budapest Hotel'},
		{videoLink: 'https://www.imdb.com/title/tt0993846/', videoType: 'Biographical', videoTitle: 'The Wolf of Wall Street'},
		{videoLink: 'https://www.imdb.com/title/tt3659388/', videoType: 'Science Fiction', videoTitle: 'The Martian'},
		{videoLink: 'https://www.imdb.com/title/tt2380307/', videoType: 'Animated', videoTitle: 'Coco'},
		{videoLink: 'https://www.imdb.com/title/tt1020072/', videoType: 'Historical', videoTitle: 'Selma'},
		{videoLink: 'https://www.imdb.com/title/tt1285016/', videoType: 'Biographical', videoTitle: 'The Social Network'},
		





        {videoLink: 'http://example.com/video/infp', videoType: 'Motivational', videoTitle: 'INFP Inspiration'},
    {videoLink: 'http://example.com/video/infj', videoType: 'Motivational', videoTitle: 'INFJ Inspiration'},
    {videoLink: 'http://example.com/video/intj', videoType: 'Motivational', videoTitle: 'INTJ Inspiration'},
    {videoLink: 'http://example.com/video/intp', videoType: 'Motivational', videoTitle: 'INTP Inspiration'},
    {videoLink: 'http://example.com/video/isfp', videoType: 'Motivational', videoTitle: 'ISFP Inspiration'},
    {videoLink: 'http://example.com/video/isfj', videoType: 'Motivational', videoTitle: 'ISFJ Inspiration'},
    {videoLink: 'http://example.com/video/istp', videoType: 'Motivational', videoTitle: 'ISTP Inspiration'},
    {videoLink: 'http://example.com/video/istj', videoType: 'Motivational', videoTitle: 'ISTJ Inspiration'},
    {videoLink: 'http://example.com/video/enfp', videoType: 'Motivational', videoTitle: 'ENFP Inspiration'},
    {videoLink: 'http://example.com/video/enfj', videoType: 'Motivational', videoTitle: 'ENFJ Inspiration'},
    {videoLink: 'http://example.com/video/entj', videoType: 'Motivational', videoTitle: 'ENTJ Inspiration'},
    {videoLink: 'http://example.com/video/entp', videoType: 'Motivational', videoTitle: 'ENTP Inspiration'},
    {videoLink: 'http://example.com/video/esfp', videoType: 'Motivational', videoTitle: 'ESFP Inspiration'},
    {videoLink: 'http://example.com/video/esfj', videoType: 'Motivational', videoTitle: 'ESFJ Inspiration'},
    {videoLink: 'http://example.com/video/estp', videoType: 'Motivational', videoTitle: 'ESTP Inspiration'},
    {videoLink: 'http://example.com/video/estj', videoType: 'Motivational', videoTitle: 'ESTJ Inspiration'}
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

		{bookURL: 'https://a.co/d/hak3RIa', bookTitle: 'The Courage to Be Disliked', bookAuthor: ' Ichiro Kishimi , Fumitake Koga '},
		{bookURL: 'http://amzn.to/2ayQC63', bookTitle: 'Man’s Search for Meaning', bookAuthor: 'Viktor Frankl'},
    {bookURL: 'http://amzn.to/2ayQzXI', bookTitle: 'The 48 Laws of Power', bookAuthor: 'Robert Greene'},
    {bookURL: 'http://amzn.to/2apDoCL', bookTitle: 'Predictably Irrational', bookAuthor: 'Dan Ariely'},
    {bookURL: 'http://amzn.to/2amlftS', bookTitle: 'Self-Promotion for Introverts: The Quiet Guide of Getting Ahead', bookAuthor: 'Nancy Ancowitz'},
    {bookURL: 'http://amzn.to/2amll4T', bookTitle: 'Emotional Intelligence: Why It Can Matter More Than IQ', bookAuthor: 'Daniel Goleman'},
    {bookURL: 'http://amzn.to/2apEn5H', bookTitle: 'How to Win Friends & Influence People', bookAuthor: 'Dale Carnegie'},
    {bookURL: 'http://amzn.to/2aXoOb4', bookTitle: 'Authentic Happiness', bookAuthor: 'Martin Seligman'},
    {bookURL: 'http://amzn.to/2ay7sf9', bookTitle: 'Flow: The Psychology of Optimal Experience', bookAuthor: 'Mihaly Csikszentmihalyi'},
    {bookURL: 'http://amzn.to/2ay7YK3', bookTitle: 'Influence: The Psychology of Persuasion', bookAuthor: 'Robert Cialdini'},
    {bookURL: 'http://amzn.to/2ammN79', bookTitle: 'The 4-Hour Workweek', bookAuthor: 'Tim Ferris'},
    {bookURL: 'http://amzn.to/2amn6Ps', bookTitle: 'How to Stop Worrying and Start Living', bookAuthor: 'Dale Carnegie'},
    {bookURL: 'http://amzn.to/2azbCXf', bookTitle: 'What Color is Your Parachute?', bookAuthor: 'Richard Bolles'},
    {bookURL: 'http://amzn.to/2aBUWyO', bookTitle: 'The 7 Habits of Highly Effective People', bookAuthor: 'Stephen Covey'},
		


		{bookURL: 'http://example.com/book', bookTitle: 'Example book', bookAuthor: 'Jane Doe'},
		{bookURL: 'http://example.com/book/infp', bookTitle: 'INFP: The Dreamer', bookAuthor: 'Jane Doe'},
		{bookURL: 'http://example.com/book/infj', bookTitle: 'INFJ: The Advocate', bookAuthor: 'John Smith'},
		{bookURL: 'http://example.com/book/intj', bookTitle: 'INTJ: The Architect', bookAuthor: 'Alex Johnson'},
		{bookURL: 'http://example.com/book/intp', bookTitle: 'INTP: The Thinker', bookAuthor: 'Sam Lee'},
		{bookURL: 'http://example.com/book/isfp', bookTitle: 'ISFP: The Artist', bookAuthor: 'Chris Wong'},
		{bookURL: 'http://example.com/book/isfj', bookTitle: 'ISFJ: The Defender', bookAuthor: 'Morgan Taylor'},
		{bookURL: 'http://example.com/book/istp', bookTitle: 'ISTP: The Craftsman', bookAuthor: 'Jordan Casey'},
		{bookURL: 'http://example.com/book/istj', bookTitle: 'ISTJ: The Inspector', bookAuthor: 'Taylor Morgan'},
		{bookURL: 'http://example.com/book/enfp', bookTitle: 'ENFP: The Champion', bookAuthor: 'Jamie Reed'},
		{bookURL: 'http://example.com/book/enfj', bookTitle: 'ENFJ: The Giver', bookAuthor: 'Casey Jordan'},
		{bookURL: 'http://example.com/book/entj', bookTitle: 'ENTJ: The Commander', bookAuthor: 'Jordan Alex'},
		{bookURL: 'http://example.com/book/entp', bookTitle: 'ENTP: The Debater', bookAuthor: 'Alexis King'},
		{bookURL: 'http://example.com/book/esfp', bookTitle: 'ESFP: The Performer', bookAuthor: 'Dylan Carter'},
		{bookURL: 'http://example.com/book/esfj', bookTitle: 'ESFJ: The Caregiver', bookAuthor: 'Charlie Quinn'},
		{bookURL: 'http://example.com/book/estp', bookTitle: 'ESTP: The Dynamo', bookAuthor: 'Quinn Charlie'},
		{bookURL: 'http://example.com/book/estj', bookTitle: 'ESTJ: The Director', bookAuthor: 'Carter Dylan'}

		

		


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
        {articleURL: 'http://example.com/article/infp', articleTitle: 'Understanding the INFP', articleAuthor: 'John Smith', articleText: 'INFPs are...'},
    {articleURL: 'http://example.com/article/infj', articleTitle: 'Exploring the INFJ Personality', articleAuthor: 'Jane Doe', articleText: 'INFJs are...'},
    {articleURL: 'http://example.com/article/intj', articleTitle: 'The World of the INTJ', articleAuthor: 'Alex Johnson', articleText: 'INTJs are...'},
    {articleURL: 'http://example.com/article/intp', articleTitle: 'Inside the Mind of an INTP', articleAuthor: 'Sam Lee', articleText: 'INTPs are...'},
    {articleURL: 'http://example.com/article/isfp', articleTitle: 'ISFP: The Artistic Spirit', articleAuthor: 'Chris Wong', articleText: 'ISFPs are...'},
    {articleURL: 'http://example.com/article/isfj', articleTitle: 'The ISFJ Personality: A Closer Look', articleAuthor: 'Morgan Taylor', articleText: 'ISFJs are...'},
    {articleURL: 'http://example.com/article/istp', articleTitle: 'ISTP: Understanding the Mechanic', articleAuthor: 'Jordan Casey', articleText: 'ISTPs are...'},
    {articleURL: 'http://example.com/article/istj', articleTitle: 'The ISTJ Type: An Overview', articleAuthor: 'Taylor Morgan', articleText: 'ISTJs are...'},
    {articleURL: 'http://example.com/article/enfp', articleTitle: 'ENFP: The Inspirational Motivator', articleAuthor: 'Jamie Reed', articleText: 'ENFPs are...'},
    {articleURL: 'http://example.com/article/enfj', articleTitle: 'Decoding the ENFJ Personality', articleAuthor: 'Casey Jordan', articleText: 'ENFJs are...'},
    {articleURL: 'http://example.com/article/entj', articleTitle: 'The ENTJ Leader', articleAuthor: 'Jordan Alex', articleText: 'ENTJs are...'},
    {articleURL: 'http://example.com/article/entp', articleTitle: 'The Visionary ENTP', articleAuthor: 'Alexis King', articleText: 'ENTPs are...'},
    {articleURL: 'http://example.com/article/esfp', articleTitle: 'ESFP: The Life of the Party', articleAuthor: 'Dylan Carter', articleText: 'ESFPs are...'},
    {articleURL: 'http://example.com/article/esfj', articleTitle: 'The Care and Feeding of the ESFJ', articleAuthor: 'Charlie Quinn', articleText: 'ESFJs are...'},
    {articleURL: 'http://example.com/article/estp', articleTitle: 'The Dynamic ESTP', articleAuthor: 'Quinn Charlie', articleText: 'ESTPs are...'},
    {articleURL: 'http://example.com/article/estj', articleTitle: 'The ESTJ at Work and Play', articleAuthor: 'Carter Dylan', articleText: 'ESTJs are...'}
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