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

INSERT INTO Outputs_4 VALUES ('ISTJ', 0, 100, 100, 100);
INSERT INTO Outputs_4 VALUES ('ISTP', 0, 100, 100, 0);
INSERT INTO Outputs_4 VALUES ('ISFJ', 0, 100, 0, 100);
INSERT INTO Outputs_4 VALUES ('ISFP', 0, 100, 0, 0);
INSERT INTO Outputs_4 VALUES ('INTJ', 0, 0, 100, 100);
INSERT INTO Outputs_4 VALUES ('INTP', 0, 0, 100, 0);
INSERT INTO Outputs_4 VALUES ('INFJ', 0, 0, 0, 100);
INSERT INTO Outputs_4 VALUES ('INFP', 0, 0, 0, 0);
INSERT INTO Outputs_4 VALUES ('ESTJ', 100, 100, 100, 100);
INSERT INTO Outputs_4 VALUES ('ESTP', 100, 100, 100, 0);
INSERT INTO Outputs_4 VALUES ('ESFJ', 100, 100, 0, 100);
INSERT INTO Outputs_4 VALUES ('ESFP', 100, 100, 0, 0);
INSERT INTO Outputs_4 VALUES ('ENTJ', 100, 0, 100, 100);
INSERT INTO Outputs_4 VALUES ('ENTP', 100, 0, 100, 0);
INSERT INTO Outputs_4 VALUES ('ENFJ', 100, 0, 0, 100);
INSERT INTO Outputs_4 VALUES ('ENFP', 100, 0, 0, 0);


INSERT INTO MyVideo VALUES ('http://example.com/video/istj', 'Motivational', 'ISTJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/istp', 'Motivational', 'ISTP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/isfj', 'Motivational', 'ISFJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/isfp', 'Motivational', 'ISFP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/intj', 'Motivational', 'INTJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/intp', 'Motivational', 'INTP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/infj', 'Motivational', 'INFJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/infp', 'Motivational', 'INFP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/estj', 'Motivational', 'ESTJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/estp', 'Motivational', 'ESTP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/esfj', 'Motivational', 'ESFJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/esfp', 'Motivational', 'ESFP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/entj', 'Motivational', 'ENTJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/entp', 'Motivational', 'ENTP Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/enfj', 'Motivational', 'ENFJ Inspiration');
INSERT INTO MyVideo VALUES ('http://example.com/video/enfp', 'Motivational', 'ENFP Inspiration');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1895587/', 'Drama', 'Spotlight');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt2980516/', 'Biographical', 'The Theory of Everything');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt0359950/', 'Adventure', 'The Secret Life of Walter Mitty');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt2543164/', 'Science', 'Arrival');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt2911666/', 'Action', 'John Wick');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt3783958/', 'Musical', 'La La Land');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1605783/', 'Fantasy', 'Midnight in Paris');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt0470752/', 'Science Fiction', 'Ex Machina');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1392190/', 'Action', 'Mad Max: Fury Road');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1981677/', 'Comedy', 'Pitch Perfect');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt2278388/', 'Comedy', 'The Grand Budapest Hotel');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt0993846/', 'Biographical', 'The Wolf of Wall Street');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt3659388/', 'Science Fiction', 'The Martian');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt2380307/', 'Animated', 'Coco');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1020072/', 'Historical', 'Selma');
INSERT INTO MyVideo VALUES ('https://www.imdb.com/title/tt1285016/', 'Biographical', 'The Social Network');

INSERT INTO MyBook VALUES ('https://a.co/d/hak3RIa', 'The Courage to Be Disliked', ' Ichiro Kishimi , Fumitake Koga ');
INSERT INTO MyBook VALUES ('http://amzn.to/2ayQC63', 'Man’s Search for Meaning', 'Viktor Frankl');
INSERT INTO MyBook VALUES ('http://amzn.to/2ayQzXI', 'The 48 Laws of Power', 'Robert Greene');
INSERT INTO MyBook VALUES ('http://amzn.to/2apDoCL', 'Predictably Irrational', 'Dan Ariely');
INSERT INTO MyBook VALUES ('http://amzn.to/2amlftS', 'Self-Promotion for Introverts: The Quiet Guide of Getting Ahead', 'Nancy Ancowitz');
INSERT INTO MyBook VALUES ('http://amzn.to/2amll4T', 'Emotional Intelligence: Why It Can Matter More Than IQ', 'Daniel Goleman');
INSERT INTO MyBook VALUES ('http://amzn.to/2apEn5H', 'How to Win Friends & Influence People', 'Dale Carnegie');
INSERT INTO MyBook VALUES ('http://amzn.to/2aXoOb4', 'Authentic Happiness', 'Martin Seligman');
INSERT INTO MyBook VALUES ('http://amzn.to/2ay7sf9', 'Flow: The Psychology of Optimal Experience', 'Mihaly Csikszentmihalyi');
INSERT INTO MyBook VALUES ('http://amzn.to/2ay7YK3', 'Influence: The Psychology of Persuasion', 'Robert Cialdini');
INSERT INTO MyBook VALUES ('http://amzn.to/2ammN79', 'The 4-Hour Workweek', 'Tim Ferris');
INSERT INTO MyBook VALUES ('http://amzn.to/2amn6Ps', 'How to Stop Worrying and Start Living', 'Dale Carnegie');
INSERT INTO MyBook VALUES ('http://amzn.to/2azbCXf', 'What Color is Your Parachute?', 'Richard Bolles');
INSERT INTO MyBook VALUES ('http://amzn.to/2aBUWyO', 'The 7 Habits of Highly Effective People', 'Stephen Covey');
INSERT INTO MyBook VALUES ('http://example.com/book', 'Example book', 'Jane Doe');
INSERT INTO MyBook VALUES ('http://example.com/book/infp', 'INFP: The Dreamer', 'Jane Doe');
INSERT INTO MyBook VALUES ('http://example.com/book/infj', 'INFJ: The Advocate', 'John Smith');
INSERT INTO MyBook VALUES ('http://example.com/book/intj', 'INTJ: The Architect', 'Alex Johnson');
INSERT INTO MyBook VALUES ('http://example.com/book/intp', 'INTP: The Thinker', 'Sam Lee');
INSERT INTO MyBook VALUES ('http://example.com/book/isfp', 'ISFP: The Artist', 'Chris Wong');
INSERT INTO MyBook VALUES ('http://example.com/book/isfj', 'ISFJ: The Defender', 'Morgan Taylor');
INSERT INTO MyBook VALUES ('http://example.com/book/istp', 'ISTP: The Craftsman', 'Jordan Casey');
INSERT INTO MyBook VALUES ('http://example.com/book/istj', 'ISTJ: The Inspector', 'Taylor Morgan');
INSERT INTO MyBook VALUES ('http://example.com/book/enfp', 'ENFP: The Champion', 'Jamie Reed');
INSERT INTO MyBook VALUES ('http://example.com/book/enfj', 'ENFJ: The Giver', 'Casey Jordan');
INSERT INTO MyBook VALUES ('http://example.com/book/entj', 'ENTJ: The Commander', 'Jordan Alex');
INSERT INTO MyBook VALUES ('http://example.com/book/entp', 'ENTP: The Debater', 'Alexis King');
INSERT INTO MyBook VALUES ('http://example.com/book/esfp', 'ESFP: The Performer', 'Dylan Carter');
INSERT INTO MyBook VALUES ('http://example.com/book/esfj', 'ESFJ: The Caregiver', 'Charlie Quinn');
INSERT INTO MyBook VALUES ('http://example.com/book/estp', 'ESTP: The Dynamo', 'Quinn Charlie');
INSERT INTO MyBook VALUES ('http://example.com/book/estj', 'ESTJ: The Director', 'Carter Dylan');

INSERT INTO MyArticle VALUES ('http://example.com/article/infp', 'Understanding the INFP', 'John Smith', 'INFPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/infj', 'Exploring the INFJ Personality', 'Jane Doe', 'INFJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/intj', 'The World of the INTJ', 'Alex Johnson', 'INTJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/intp', 'Inside the Mind of an INTP', 'Sam Lee', 'INTPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/isfp', 'ISFP: The Artistic Spirit', 'Chris Wong', 'ISFPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/isfj', 'The ISFJ Personality: A Closer Look', 'Morgan Taylor', 'ISFJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/istp', 'ISTP: Understanding the Mechanic', 'Jordan Casey', 'ISTPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/istj', 'The ISTJ Type: An Overview', 'Taylor Morgan', 'ISTJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/enfp', 'ENFP: The Inspirational Motivator', 'Jamie Reed', 'ENFPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/enfj', 'Decoding the ENFJ Personality', 'Casey Jordan', 'ENFJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/entj', 'The ENTJ Leader', 'Jordan Alex', 'ENTJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/entp', 'The Visionary ENTP', 'Alexis King', 'ENTPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/esfp', 'ESFP: The Life of the Party', 'Dylan Carter', 'ESFPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/esfj', 'The Care and Feeding of the ESFJ', 'Charlie Quinn', 'ESFJs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/estp', 'The Dynamic ESTP', 'Quinn Charlie', 'ESTPs are...');
INSERT INTO MyArticle VALUES ('http://example.com/article/estj', 'The ESTJ at Work and Play', 'Carter Dylan', 'ESTJs are...');

INSERT INTO IsRecommendedVideo VALUES ('ISTJ', 'https://www.imdb.com/title/tt1895587/');
INSERT INTO IsRecommendedVideo VALUES ('ISFJ', 'https://www.imdb.com/title/tt2980516/');
INSERT INTO IsRecommendedVideo VALUES ('INFJ', 'https://www.imdb.com/title/tt0359950/');
INSERT INTO IsRecommendedVideo VALUES ('INTJ', 'https://www.imdb.com/title/tt2543164/');
INSERT INTO IsRecommendedVideo VALUES ('ISTP', 'https://www.imdb.com/title/tt2911666/');
INSERT INTO IsRecommendedVideo VALUES ('ISFP', 'https://www.imdb.com/title/tt3783958/');
INSERT INTO IsRecommendedVideo VALUES ('INFP', 'https://www.imdb.com/title/tt1605783/');
INSERT INTO IsRecommendedVideo VALUES ('INTP', 'https://www.imdb.com/title/tt0470752/');
INSERT INTO IsRecommendedVideo VALUES ('ESTP', 'https://www.imdb.com/title/tt1392190/');
INSERT INTO IsRecommendedVideo VALUES ('ESFP', 'https://www.imdb.com/title/tt1981677/');
INSERT INTO IsRecommendedVideo VALUES ('ENFP', 'https://www.imdb.com/title/tt2278388/');
INSERT INTO IsRecommendedVideo VALUES ('ENTP', 'https://www.imdb.com/title/tt0993846/');
INSERT INTO IsRecommendedVideo VALUES ('ESTJ', 'https://www.imdb.com/title/tt3659388/');
INSERT INTO IsRecommendedVideo VALUES ('ESFJ', 'https://www.imdb.com/title/tt2380307/');
INSERT INTO IsRecommendedVideo VALUES ('ENFJ', 'https://www.imdb.com/title/tt1020072/');
INSERT INTO IsRecommendedVideo VALUES ('ENTJ', 'https://www.imdb.com/title/tt1285016/');
INSERT INTO IsRecommendedVideo VALUES ('INFP', 'http://example.com/video/infp');
INSERT INTO IsRecommendedVideo VALUES ('INFJ', 'http://example.com/video/infj');
INSERT INTO IsRecommendedVideo VALUES ('INTJ', 'http://example.com/video/intj');
INSERT INTO IsRecommendedVideo VALUES ('INTP', 'http://example.com/video/intp');
INSERT INTO IsRecommendedVideo VALUES ('ISFP', 'http://example.com/video/isfp');
INSERT INTO IsRecommendedVideo VALUES ('ISFJ', 'http://example.com/video/isfj');
INSERT INTO IsRecommendedVideo VALUES ('ISTP', 'http://example.com/video/istp');
INSERT INTO IsRecommendedVideo VALUES ('ISTJ', 'http://example.com/video/istj');
INSERT INTO IsRecommendedVideo VALUES ('ENFP', 'http://example.com/video/enfp');
INSERT INTO IsRecommendedVideo VALUES ('ENFJ', 'http://example.com/video/enfj');
INSERT INTO IsRecommendedVideo VALUES ('ENTJ', 'http://example.com/video/entj');
INSERT INTO IsRecommendedVideo VALUES ('ENTP', 'http://example.com/video/entp');
INSERT INTO IsRecommendedVideo VALUES ('ESFP', 'http://example.com/video/esfp');
INSERT INTO IsRecommendedVideo VALUES ('ESFJ', 'http://example.com/video/esfj');
INSERT INTO IsRecommendedVideo VALUES ('ESTP', 'http://example.com/video/estp');
INSERT INTO IsRecommendedVideo VALUES ('ESTJ', 'http://example.com/video/estj');

INSERT INTO IsRecommendedBook VALUES ('INFP', 'https://a.co/d/hak3RIa');
INSERT INTO IsRecommendedBook VALUES ('INFJ', 'http://amzn.to/2ayQC63');
INSERT INTO IsRecommendedBook VALUES ('INTJ', 'http://amzn.to/2ayQzXI');
INSERT INTO IsRecommendedBook VALUES ('INTP', 'http://amzn.to/2apDoCL');
INSERT INTO IsRecommendedBook VALUES ('ISFJ', 'http://amzn.to/2amlftS');
INSERT INTO IsRecommendedBook VALUES ('ISTJ', 'http://amzn.to/2amll4T');
INSERT INTO IsRecommendedBook VALUES ('ISTP', 'http://amzn.to/2apEn5H');
INSERT INTO IsRecommendedBook VALUES ('ISFP', 'http://amzn.to/2amlftS');
INSERT INTO IsRecommendedBook VALUES ('ENFJ', 'http://amzn.to/2aXoOb4');
INSERT INTO IsRecommendedBook VALUES ('ENFP', 'http://amzn.to/2ay7sf9');
INSERT INTO IsRecommendedBook VALUES ('ENTJ', 'http://amzn.to/2ay7YK3');
INSERT INTO IsRecommendedBook VALUES ('ENTP', 'http://amzn.to/2ammN79');
INSERT INTO IsRecommendedBook VALUES ('ESFJ', 'http://amzn.to/2amn6Ps');
INSERT INTO IsRecommendedBook VALUES ('ESFP', 'http://amzn.to/2azbCXf');
INSERT INTO IsRecommendedBook VALUES ('ESTJ', 'http://amzn.to/2aBUWyO');
INSERT INTO IsRecommendedBook VALUES ('ESTP', 'http://amzn.to/2azbCXf');
INSERT INTO IsRecommendedBook VALUES ('INFP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('INFJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('INTJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('INTP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ISFP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ISFJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ISTP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ISTJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ENFP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ENFJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ENTJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ENTP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ESFP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ESFJ', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ESTP', 'http://example.com/book');
INSERT INTO IsRecommendedBook VALUES ('ESTJ', 'http://example.com/book');

INSERT INTO IsRecommendedArticle VALUES ('INFP', 'http://example.com/article/infp');
INSERT INTO IsRecommendedArticle VALUES ('INFJ', 'http://example.com/article/infj');
INSERT INTO IsRecommendedArticle VALUES ('INTJ', 'http://example.com/article/intj');
INSERT INTO IsRecommendedArticle VALUES ('INTP', 'http://example.com/article/intp');
INSERT INTO IsRecommendedArticle VALUES ('ISFP', 'http://example.com/article/isfp');
INSERT INTO IsRecommendedArticle VALUES ('ISFJ', 'http://example.com/article/isfj');
INSERT INTO IsRecommendedArticle VALUES ('ISTP', 'http://example.com/article/istp');
INSERT INTO IsRecommendedArticle VALUES ('ISTJ', 'http://example.com/article/istj');
INSERT INTO IsRecommendedArticle VALUES ('ENFP', 'http://example.com/article/enfp');
INSERT INTO IsRecommendedArticle VALUES ('ENFJ', 'http://example.com/article/enfj');
INSERT INTO IsRecommendedArticle VALUES ('ENTJ', 'http://example.com/article/entj');
INSERT INTO IsRecommendedArticle VALUES ('ENTP', 'http://example.com/article/entp');
INSERT INTO IsRecommendedArticle VALUES ('ESFP', 'http://example.com/article/esfp');
INSERT INTO IsRecommendedArticle VALUES ('ESFJ', 'http://example.com/article/esfj');
INSERT INTO IsRecommendedArticle VALUES ('ESTP', 'http://example.com/article/estp');
INSERT INTO IsRecommendedArticle VALUES ('ESTJ', 'http://example.com/article/estj');