/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
	const statusElem = document.getElementById('dbStatus');
	const loadingGifElem = document.getElementById('loadingGif');

	const response = await fetch('/check-db-connection', {
		method: "GET"
	});

	// Hide the loading GIF once the response is received.
	loadingGifElem.style.display = 'none';
	// Display the statusElem's text in the placeholder.
	statusElem.style.display = 'inline';

	response.text()
	.then((text) => {
		statusElem.textContent = text;
	})
	.catch((error) => {
		statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
	});
}



// This function resets or initializes the demotable.
async function resetDemotable() {
	const response = await fetch("/initiate-All-Tables", {
		method: 'POST'
	});
	const responseData = await response.json();

	if (responseData.success) {
		const messageElement = document.getElementById('resetResultMsg');
		messageElement.textContent = "reset successfully!";
		// fetchTableData();
	} else {
		alert("Error resetting!");
	}
}

// Inserts new records into the demotable.
async function register(event) {
	event.preventDefault();

	const emailValue = document.getElementById('insertEmail').value;
	const passwordValue = document.getElementById('insertPassword').value;
	const mbtiValue  = document.getElementById('insertMbti').value;
	const ageValue = document.getElementById('insertAge').value;
	const countryValue = document.getElementById('insertCountry').value;
	const genderValue = document.getElementById('insertGender').value;

	const response = await fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			emailAddress: emailValue,
			password: passwordValue,
			mbtiName: mbtiValue,
			age: ageValue,
			country: countryValue,
			userGender: genderValue
		})
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('insertResultMsg');

	if (responseData.success) {
		messageElement.textContent = "register successfully!";
	} else {
		messageElement.textContent = "Error in registering!";
	}
}



//login 

async function login(event) {
	event.preventDefault();
   
	const emailValue = document.getElementById('loginEmail').value;
	const passwordValue = document.getElementById('loginPassword').value;

	const response = await fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: emailValue,
			password: passwordValue
		})
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('loginResultMsg');

	if (responseData.success) {
		messageElement.textContent = "login successfully!";
	} else {
		messageElement.textContent = "Error in login!";
	}
}

// Updates account information
async function updateAccountInfo(event) {
	event.preventDefault();

	// Get the form data
	const emailValue = document.getElementById('updateEmail').value;
	const passwordValue = document.getElementById('updatePassword').value;
	const mbtiValue = document.getElementById('updateMbti').value;
	const ageValue = document.getElementById('updateAge').value;
	const countryValue = document.getElementById('updateCountry').value;
	const genderValue = document.getElementById('updateGender').value;

	// Send the data to the server
	const response = await fetch('/update-account-info', {  // Adjust the endpoint as necessary
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			emailAddress: emailValue,
			password: passwordValue,
			mbtiName: mbtiValue,
			age: ageValue,
			country: countryValue,
			userGender: genderValue
		})
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('updateNameResultMsg');

	if (responseData.success) {
		messageElement.textContent = "Account updated successfully!";
	} else {
		messageElement.textContent = "Error updating account!";
	}
}



//mbti test 

async function submitPersonalityTest(event) {
	event.preventDefault();  // Prevent the form from submitting in the traditional way

	// Get the binary values from the form
	const answers = {
		E: document.querySelector('input[name="question1"]:checked')?.value === 'E' ? 1 : 0,
		S: document.querySelector('input[name="question2"]:checked')?.value === 'S' ? 1 : 0,
		T: document.querySelector('input[name="question3"]:checked')?.value === 'T' ? 1 : 0,
		J: document.querySelector('input[name="question4"]:checked')?.value === 'J' ? 1 : 0,
	};

	const emailValue = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : null;
	const now = new Date();
	const timestamp = formatToTimestamp(now);

	const testData = {
		emailAddress: emailValue, // Use null if the user isn't logged in
		startDateTime: timestamp,
		EIScore: answers.E,
		SNScore: answers.S,
		TFScore: answers.T,
		JPScore: answers.J
	};

	const messageElement = document.getElementById('testResultMsg');
	const mbtiElement = document.getElementById('mbtiTypeDisplay');

	try {
		const response = await fetch('/submit-test-questions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(testData)
		});


		const responseData = await response.json();

		if (responseData.success) {
			messageElement.textContent = "Test submitted successfully!";
			mbtiElement.textContent = responseData.mbtiType;
			fetchAndUpdateRecommendations();
		} else {
			throw new Error('Server response error');
		}
	} catch (error) {
		console.error('Error:', error);
		messageElement.textContent = "Error submitting test!";
	}   
}

function fetchAndUpdateRecommendations() {
	fetch('/path/to/recommendations/api')
		.then(response => response.json())
		.then(data => {
			updateTable('books', data.books);
			updateTable('videos', data.videos);
			updateTable('articles', data.articles);
		})
		.catch(error => console.error('Failed to fetch recommendations:', error));
}



function updateTable(type, items) {
	const table = document.querySelector(`.${type}-section table`);
	let rows = '';

	items.forEach(item => {
		rows += `<tr>
					<td>${item.title}</td>
					<td>${item.author || item.creator || item.source}</td>
					<td>${item.description || `<a href="${item.link}">${item.linkText || 'View'}</a>`}</td>
				 </tr>`;
	});

	table.innerHTML = `<tr>
						  <th>Title</th>
						  <th>${type === 'books' ? 'Author' : type === 'videos' ? 'Creator' : 'Source'}</th>
						  <th>${type === 'books' ? 'Description' : 'Link'}</th>
					   </tr>` + rows;
}









// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countMBTItype() {
	const response = await fetch("/count-mbtitable", {
		method: 'GET'
	});

	const responseData = await response.json();
	const messageElement = document.getElementById('countResultMsg');

	if (responseData.success) {
		const tupleCount = responseData.count;
		messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
	} else {
		messageElement.textContent = `Error in count demotable!`;
	 
		
	}
}
//helper that turn New Date(); into sql timestamp formate
function formatToTimestamp(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
	checkDbConnection();
	// fetchTableData();
	document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
	document.getElementById("insertDemotable").addEventListener("submit", register);
	document.getElementById("loginForm").addEventListener("submit", login);
	document.getElementById("personalityTestForm").addEventListener("submit", submitPersonalityTest);
	document.getElementById("updataUserTable").addEventListener("submit", updateAccountInfo);
	document.getElementById("countmbtitable").addEventListener("click", countMBTItype);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }
