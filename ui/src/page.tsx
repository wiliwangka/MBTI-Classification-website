function Message(){
return  (
    <>
      <div>
        <h2>New User</h2>
        <form id="registrationForm">
          <label htmlFor="newUserId">User ID:</label>
          <input type="text" id="newUserId" name="user_id" required /><br />
          <label htmlFor="newPassword">Password:</label>
          <input type="password" id="newPassword" name="password" required /><br />
          <label htmlFor="newEmail">Email:</label>
          <input type="email" id="newEmail" name="email" required /><br />
          {/* Add other fields as necessary */}
          <input type="submit" value="Register" />
        </form>
      </div>

      <div>
        <h2>Login</h2>
        <form id="loginForm">
          <label htmlFor="loginUserId">User ID:</label>
          <input type="text" id="loginUserId" name="user_id" required /><br />
          <label htmlFor="loginPassword">Password:</label>
          <input type="password" id="loginPassword" name="password" required /><br />
          <input type="submit" value="Login" />
        </form>
      </div>

      <div>
        <h2>Test</h2>
        <button type="button">Test Button</button>
      </div>

      <div>
        <h2>Report</h2>
        <p>Your MBTI is: {/* Add dynamic content here */}</p>
      </div>

      <div>
        <h2>Recommendations for INTP</h2>
        <div>
          <h3>Videos</h3>
          {/* Add video recommendations here */}
        </div>
        <div>
          <h3>Books</h3>
          {/* Add book recommendations here */}
        </div>
        <div>
          <h3>Articles</h3>
          {/* Add article recommendations here */}
        </div>
      </div>
    </>
  );
}
export default Message;