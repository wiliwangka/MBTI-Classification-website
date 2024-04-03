drop table IsRecommendedArticle;
drop table IsRecommendedBook;
drop table IsRecommendedVideo;
drop table MyArticle;
drop table MyBook;
drop table MyVideo;
drop table Outputs_3;
drop table Outputs_4;
drop table Question;
drop table Outputs_2;
drop table LoginUser;
drop table MBTI_Type;
drop table MyUser;

CREATE TABLE MyUser (
    username VARCHAR(63) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE MBTI_Type (
    mbtiName CHAR(4) NOT NULL,
    mbtiDescription VARCHAR(1000) NOT NULL,
    PRIMARY KEY (mbtiName)
);

CREATE TABLE LoginUser (
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
);

CREATE TABLE Outputs_2 (
    TID INT NOT NULL,
    -- RID INT NOT NULL,
    startDateTime TIMESTAMP NOT NULL,
    username VARCHAR(63) NOT NULL,
    PRIMARY KEY (TID),
    FOREIGN KEY (username) REFERENCES MyUser(username) ON DELETE CASCADE
);

CREATE TABLE Question (
    questionNumber INT NOT NULL,
    TID INT NOT NULL,
    -- questionDescription VARCHAR(1000) NOT NULL,
    questionAnswer INT,
    questionScoreType CHAR(2) NOT NULL,
    PRIMARY KEY (questionNumber, TID),
    FOREIGN KEY (TID) REFERENCES Outputs_2(TID) ON DELETE CASCADE
);

CREATE TABLE Outputs_4 (
    mbtiName CHAR(4) NOT NULL,
    EIScore REAL NOT NULL,
    SNScore REAL NOT NULL,
    TFScore REAL NOT NULL,
    JPScore REAL NOT NULL,
    PRIMARY KEY (EIScore, SNScore, TFScore, JPScore)
);

CREATE TABLE Outputs_3 (
    TID INT NOT NULL,
    EIScore REAL NOT NULL,
    SNScore REAL NOT NULL,
    TFScore REAL NOT NULL,
    JPScore REAL NOT NULL,
    PRIMARY KEY (TID, EIScore, SNScore, TFScore, JPScore),
    FOREIGN KEY (EIScore, SNScore, TFScore, JPScore) REFERENCES Outputs_4(EIScore, SNScore, TFScore, JPScore) ON DELETE CASCADE,
    FOREIGN KEY (TID) REFERENCES Outputs_2(TID) ON DELETE CASCADE
);

CREATE TABLE MyVideo (
    videoLink VARCHAR(255) NOT NULL,
    videoType VARCHAR(255),
    videoTitle VARCHAR(255) NOT NULL,
    PRIMARY KEY (videoLink)
);

CREATE TABLE MyBook (
    bookURL VARCHAR(255) NOT NULL,
    bookTitle VARCHAR(255) NOT NULL,
    bookAuthor VARCHAR(255) NOT NULL,
    PRIMARY KEY (bookURL)
);

CREATE TABLE MyArticle (
    articleURL VARCHAR(255) NOT NULL,
    articleTitle VARCHAR(255) NOT NULL,
    articleAuthor VARCHAR(255) NOT NULL,
    articleText VARCHAR(1000) NOT NULL,
    PRIMARY KEY (articleURL)
);

CREATE TABLE IsRecommendedVideo (
    mbtiName CHAR(4) NOT NULL,
    videoLink VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, videoLink),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (videoLink) REFERENCES MyVideo(videoLink) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedBook (
    mbtiName CHAR(4) NOT NULL,
    bookURL VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, bookURL),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (bookURL) REFERENCES MyBook(bookURL) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedArticle (
    mbtiName CHAR(4) NOT NULL,
    articleURL VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, articleURL),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (articleURL) REFERENCES MyArticle(articleURL) ON DELETE CASCADE
);


-- why do we need this?
INSERT INTO MBTI_Type VALUES ('ISTJ', 'Number A');
INSERT INTO MBTI_Type VALUES ('ISTP', 'Number B');
INSERT INTO MBTI_Type VALUES ('ISFJ', 'Number C');
INSERT INTO MBTI_Type VALUES ('ISFP', 'Number D');
INSERT INTO MBTI_Type VALUES ('INTJ', 'Number E');
INSERT INTO MBTI_Type VALUES ('INTP', 'Number F');
INSERT INTO MBTI_Type VALUES ('INFJ', 'Number G');
INSERT INTO MBTI_Type VALUES ('INFP', 'Number H');
INSERT INTO MBTI_Type VALUES ('ESTJ', 'Number I');
INSERT INTO MBTI_Type VALUES ('ESTP', 'Number J');
INSERT INTO MBTI_Type VALUES ('ESFJ', 'Number K');
INSERT INTO MBTI_Type VALUES ('ESFP', 'Number L');
INSERT INTO MBTI_Type VALUES ('ENTJ', 'Number M');
INSERT INTO MBTI_Type VALUES ('ENTP', 'Number N');
INSERT INTO MBTI_Type VALUES ('ENFJ', 'Number O');
INSERT INTO MBTI_Type VALUES ('ENFP', 'Number P');