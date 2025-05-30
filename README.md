# React & Node.js Skill Test

## Estimated Time

- 60 min

## Requirements

- Bug fix to login without any issues (20min) <br/>
  There is no need to change or add login function.
  Interpret the code structure and set the correct environment by the experience of building projects. <br/>
  Here is a login information. <br/>
  ✓ email: admin@gmail.com  ✓ password: admin123

- Implement Restful API of "Meeting" in the both of server and client sides (40min)<br/>
  Focus Code Style and Code Optimization. <br/>
  Reference other functions.


Steps to Run - 
1. Clone the repository to your IDE
2. Create a .env in Client Directory and type REACT_APP_BASE_URL='http://localhost:5001/' as our server is configured to run at this address
3. Create a .env in Server and type JWT_SECRET= """Any strong random key to secure authentication"""
4. Open 3 Terminals, 
  4.1 Navigate to Client, Run npm install then npm start
  4.2 Navigate to Server, Run npm install then npm start
  4.3 Be on the root directory, Start the MongoDB services by running brew services start mongodb-community 
    4.3.1 If MongoDB services not installed 
    - run brew tap mongodb/brew
    - run brew install mongodb-community   
    Then start the services
5. Use credentials ✓ email: admin@gmail.com  ✓ password: admin123 to login    



Changes/Additions - 

Bug Fixes of Login-
1. Addition of .env in client directory to use Base Url in Api file (Client side)
2. Addition of .env in Server directory to secure the authentication using a JWT key which was hardcoded in the project

Restful API "Meeting"
1. Completed the AddData and FetchAlldata functions
2. Completed the Controllers for functions of Add, Index, View, Delete, DeleteMany
3. Set up routes for the backend so that these declared functions can interact with frontend payload
4. Added Meeting Schema model to add entries in the database. 