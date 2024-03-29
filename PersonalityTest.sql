CREATE TABLE User (
    username VARCHAR(63) NOT NULL,
    PRIMARY KEY (username),
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
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE
);

CREATE TABLE Question (
    questionNumber INT NOT NULL AUTO_INCREMENT,
    TID INT NOT NULL,
    questionDescription TEXT NOT NULL,
    questionAnswer INT NOT NULL,
    PRIMARY KEY (questionNumber, TID),
    FOREIGN KEY (TID) REFERENCES Test(TID) ON DELETE CASCADE
);

CREATE TABLE Outputs_2 (
    TID INT NOT NULL AUTO_INCREMENT,
    RID INT NOT NULL,
    startDateTime DATETIME NOT NULL,
    username VARCHAR(63) NOT NULL,
    PRIMARY KEY (TID)
)

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

CREATE TABLE Outputs_4 (
    mbtiName CHAR(4) NOT NULL,
    EIScore REAL NOT NULL,
    SNScore REAL NOT NULL,
    TFScore REAL NOT NULL,
    JPScore REAL NOT NULL,
    PRIMARY KEY (EIScore, SNScore, TFScore, JPScore)
);

CREATE TABLE MBTI_Type (
    mbtiName CHAR(4) NOT NULL,
    mbtiDescription TEXT NOT NULL,
    PRIMARY KEY (mbtiName)
)

CREATE TABLE Video (
    videoLink VARCHAR(255) NOT NULL,
    videoType VARCHAR(255),
    videoTitle VARCHAR(255) NOT NULL,
    PRIMARY KEY (videoLink)
);

CREATE TABLE Book (
    bookURL VARCHAR(255) NOT NULL,
    bookTitle VARCHAR(255) NOT NULL,
    bookAuthor VARCHAR(255) NOT NULL,
    PRIMARY KEY (bookURL)
);

CREATE TABLE Article (
    articleURL VARCHAR(255) NOT NULL,
    articleTitle VARCHAR(255) NOT NULL,
    articleAuthor VARCHAR(255) NOT NULL,
    articleText TEXT NOT NULL,
    PRIMARY KEY (articleURL)
);

CREATE TABLE IsRecommendedVideo (
    mbtiName CHAR(4) NOT NULL,
    videoLink VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, videoLink),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (videoLink) REFERENCES Video(videoLink) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedBook (
    mbtiName CHAR(4) NOT NULL,
    bookURL VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, bookURL),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (bookURL) REFERENCES Book(bookURL) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedArticle (
    mbtiName CHAR(4) NOT NULL,
    articleURL VARCHAR(255) NOT NULL,
    PRIMARY KEY (mbtiName, articleURL),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type(mbtiName) ON DELETE CASCADE,
    FOREIGN KEY (articleURL) REFERENCES Article(articleURL) ON DELETE CASCADE
);