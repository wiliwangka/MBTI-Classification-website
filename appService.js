// Adapted from Tutorial 8 - CPSC304_Node_Project, https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project.git at appService.js

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

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
        dropAllTables(connection);
        const result = await createAllTables(connection);
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
            questionAnswer INT NOT NULL,
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

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
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
    initiateDemotable: initiateAllTables, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};