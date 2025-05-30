
## Steps to Run

1. **Clone the repository to your IDE**

2. **Set up Client environment**
   - Create a .env file in the Client directory
   - Add: REACT_APP_BASE_URL='http://localhost:5001/'
   - because our server is configured to run at this address

3. **Set up Server environment**
   - Create a .env file in the Server directory
   - Add: JWT_SECRET="Any strong random key to secure authentication"

4. **Start the Client**
   - Navigate to Client directory
   - Run npm install
   - Run npm start

5. **Start the Server**
   - Navigate to Server directory
   - Run npm install
   - Run npm start

6. **Start MongoDB services**
   - From the root directory, run: brew services start mongodb-community
   
   **If MongoDB is not installed:**
   - Run brew tap mongodb/brew
   - Run brew install mongodb-community
   - Run brew services start mongodb-community

7. **Login to the application**
   - Use credentials: 
     - Email: admin@gmail.com
     - Password: admin123

## Changes/Additions

### Bug Fixes for Login
1. **Client-side fix**: Added .env file in client directory to use Base URL in API file
2. **Server-side fix**: Added .env file in Server directory to secure authentication using a JWT key (was previously hardcoded)

### Restful API "Meeting"
1. **Backend Implementation**:
   - Completed the AddData and FetchAllData functions
   - Completed the Controllers for functions: Add, Index, View, Delete, DeleteMany
   - Set up routes for the backend so declared functions can interact with frontend payload
   - Added Meeting Schema model to add entries in the database

2. **Frontend Integration**:
   - Connected frontend components with backend API endpoints
   - Implemented proper error handling and data validation
