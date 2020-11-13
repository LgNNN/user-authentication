# User Authentication
- [App info](#app-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [License](#license)
- [Future Updates](#future-updates)

## App info
**Authentication process**: A JSON Web Token is created every time the user logs in or signs up. The jwt is stored inside the browser as a cookie. While logging in the remember me checkbox will make both the cookie and token expire after 30 days. Otherwise the the cookie will be available only for the session and the token for 1 hour.  
**Route protection**: A custom express middleware is applied to protected routes, checks the jwt cookie and verifies the token on each request giving access to protected pages, only if the token is valid and not tampered.  
**Security & Privacy**
The jwt is signed with the user's unique database id and no personal information is stored outside the server. Passwords are hashed before being saved.  
Note: Storing tokens as cookies make them vulnerable to cross-site request forgery (CSRF or XSRF) attacks and the topic should be well-researched before being implemented in a production enviroment.

#### Link
[https://the-secret-lgn.herokuapp.com/](https://the-secret-lgn.herokuapp.com/)
#### Author
Elia Tryfonas
## Technologies
- Node.js
- Express
- Mongoose
- JSON Web Token
- bcrypt
## Setup
To run this project create a **.env** file and add 
```
DB_CONNECTION ='your-mongodb-connection-url' 
```
then
```
npm install

npm run start
```
## Future updates  
- Add google login and sign up
- Allow user to customize profile information
- Store cookies in memory
## License
This project is licensed under the MIT License.
