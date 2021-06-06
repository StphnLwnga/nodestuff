# [Introduction to Advanced Node and Express Challenges](https://www.freecodecamp.org/learn/quality-assurance/advanced-node-and-express/)
- Uncomment **`require('dotenv').config();`** outside Replit environment

## **Setting up a database on MongoDB Atlas**
👉🏾 Create a New Cluster / Existing Cluster ️  
👉🏾 Collections Tab   
👉🏾 Add own data    
👉🏾 Database Name  + Collection Name / Add Database   
👉🏾 Database Access Tab   
👉🏾 Create / Add User   
👉🏾 Network Tab   
👉🏾 Set IP address access (Everywhere)   
👉🏾 Cluster Overview Tab   
👉🏾 Connect   
👉🏾 Connect your application   
👉🏾 Copy URI & set as environmental variable in own app

## **Github Authorization**
👉🏾 Obtaining your Client ID and Secret from GitHub is done in your account profile settings under 'developer settings', then 'OAuth applications'.   

👉🏾 Click 'Register a new application', name your app, paste in the url to your Replit homepage (Not the project code's url), and lastly, for the callback url, paste in the same url as the homepage but with /auth/github/callback added on.  

👉🏾 This is where users will be redirected for us to handle after authenticating on GitHub. Save the returned information as 'GITHUB_CLIENT_ID' and 'GITHUB_CLIENT_SECRET' in your .env file.