# web app

## Health  check api /healthz

## Introduction
The `/healthz` API is designed to monitor the health of the application instance and help ensure smooth operations by detecting when a service instance is unable to handle requests. This API provides the following benefits:

- **Monitoring**: Helps monitor the health status of the application.
- **Traffic Management**: Prevents routing traffic to unhealthy application instances.
- **Auto Recovery**: Assists in automatically replacing or repairing unhealthy instances.
- **Improved User Experience**: Ensures that user requests are routed to healthy instances only.

## Prerequisites
### 1. Install Node.js
Download and install Node.js version **22.11.0** from [Node.js Official Website](https://nodejs.org/en/download) according to your operating system.

### 2. Install MySQL Server
Download and install **MySQL Server Version 8.0.41** from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/) according to your operating system.

#### MySQL Setup
1. **Access Initial Password:**
   ```sh
   sudo more /var/log/mysqld.log | grep "password"
   ```
2. **Secure Installation:**
   ```sh
   mysql_secure_installation
   ```
   - Enter the initial password retrieved from the previous step.
   - Set up a new password and confirm it.
   - Remove anonymous users: **Yes**
   - Disallow root login remotely: **No**
   - Remove test database and access to it: **Yes**

3. **Connect to MySQL:**
   ```sh
   mysql -u root -p
   ```
   Enter the password you set up.

4. **Create Database:**
   ```sql
   CREATE DATABASE health_check_db;
   ```

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <repository-url>
cd <repository-directory>
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and populate it with the following values:

```
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_HOST=localhost
DB_NAME=health_check_db
TABLE_NAME=health_check_table
PORT=8080
```
> Note: Update `PORT` and other values as per your requirements.

### 3. Install Dependencies
```sh
npm install
```

### 4. Start the Server
```sh
node app.js
```

## API Testing
Use **curl** commands or **Postman** to test the `/healthz` endpoint.

### Test Commands
```sh
curl -vvvv http://localhost:8080/healthz
curl -vvvv http://localhost:8080/healthz
curl -vvvv -X PUT http://localhost:8080/healthz
```

### Expected Responses
- **200 OK** if the service is healthy.
- **503 Service Unavailable** if the service is unhealthy.

## Conclusion
The `/healthz` API is a crucial tool for maintaining the health and stability of web application instances. By following this setup and testing guide, you can efficiently deploy and monitor your application.

