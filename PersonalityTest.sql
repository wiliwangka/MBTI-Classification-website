CREATE TABLE User (
    username INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (username),
);

CREATE TABLE LoginUser (
    username INT,
    mbtiName CHAR(4),
    username VARCHAR(255) NOT NULL,
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

CREATE TABLE Test (
    TID INT NOT NULL AUTO_INCREMENT,
    RID INT NOT NULL,
    username INT NOT NULL,
    startTime DATETIME NOT NULL,
    testGender CHAR(1),
    PRIMARY KEY (TID),
    UNIQUE (startTime, username),
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
    FOREIGN KEY (RID) REFERENCES Report_2(RID) ON DELETE CASCADE
);

CREATE TABLE Question (
    questionNumber INT NOT NULL AUTO_INCREMENT,
    TID INT NOT NULL,
    questionDescription TEXT NOT NULL,
    questionAnswer INT NOT NULL,PRIMARY KEY (questionNumber, TID),
    FOREIGN KEY (TID) REFERENCES Test(TID) ON DELETE CASCADE
);

CREATE TABLE Outputs_3 (
    TID INT NOT NULL,
    EIScore REAL,
    SNScore REAL,
    TFScore REAL,
    JPScore REAL,
    mbtiName INT NOT NULL,
    PRIMARY KEY (EIScore, EIScore, EIScore, EIScore),
    FOREIGN KEY (EIScore, EIScore, EIScore, EIScore) REFERENCES
    Outputs_4(EIScore, EIScore, EIScore, EIScore) ON DELETE CASCADE
);

CREATE TABLE Outputs_3 (
    TID INT NOT NULL,
    EIScore REAL,
    SNScore REAL,
    TFScore REAL,
    JPScore REAL,
    mbtiName INT NOT NULL,
    PRIMARY KEY (EIScore, EIScore, EIScore, EIScore),
    FOREIGN KEY (EIScore, EIScore, EIScore, EIScore) REFERENCES
    Outputs_4(EIScore, EIScore, EIScore, EIScore) ON DELETE CASCADE
);

CREATE TABLE Report_2 (
    RID INT NOT NULL AUTO_INCREMENT,
    TID INT NOT NULL,
    username INT NOT NULL,
    mbtiName INT NOT NULL,
    EIScore REAL NOT NULL,
    SNScore REAL NOT NULL,
    TFScore REAL NOT NULL,
    JPScore REAL NOT NULL,
    reportGender CHAR(1) NOT NULL,
    PRIMARY KEY (RID),
    FOREIGN KEY (TID) REFERENCES Test(TID) ON DELETE CASCADE,
    FOREIGN KEY (EIScore) REFERENCES Report_1(EIScore) ON DELETE CASCADE,
    FOREIGN KEY (SNScore) REFERENCES Report_1(SNScore) ON DELETE CASCADE,
    articleTitle TEXT,
    articleAuthor TEXT,
    PRIMARY KEY (AID),
    UNIQUE (articleURL),
    FOREIGN KEY (articleTitle) REFERENCES
    Article_1(articleTitle) ON DELETE CASCADE,
    FOREIGN KEY (articleAuthor) REFERENCES
    Article_2(articleAuthor) ON DELETE CASCADE
);

CREATE TABLE Video (
    VID INT NOT NULL AUTO_INCREMENT,
    videoLink VARCHAR(255),
    videoType VARCHAR(255) NOT NULL,
    videoTitle VARCHAR(255) NOT NULL,
    PRIMARY KEY (VID)
);

CREATE TABLE IsRecommendedVideo (
    mbtiName INT,
    VID INT,
    PRIMARY KEY (mbtiName, VID),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type_2(mbtiName) ON
    DELETE CASCADE,
    FOREIGN KEY (VID) REFERENCES Video(VID) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedBook (
    mbtiName INT,
    BID INT,
    PRIMARY KEY (mbtiName, BID),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type_2(mbtiName) ON
    DELETE CASCADE,
    FOREIGN KEY (BID) REFERENCES Book(BID) ON DELETE CASCADE
);

CREATE TABLE IsRecommendedArticle (
    mbtiName INT,
    AID INT,
    PRIMARY KEY (mbtiName, AID),
    FOREIGN KEY (mbtiName) REFERENCES MBTI_Type_2(mbtiName) ON
    DELETE CASCADE,
    FOREIGN KEY (AID) REFERENCES Article(AID) ON DELETE CASCADE
);