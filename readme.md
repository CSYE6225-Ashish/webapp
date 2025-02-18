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


# Assignment 2

## Testing Using Jest

This project includes a testing setup using the following dependencies:

- `jest`: ^29.7.0
- `supertest`: ^7.0.0

### Test Setup

1. Modify the `package.json` file by adding the following script under the `scripts` section:
   ```json
   "scripts": {
       "test": "jest --coverage"
   }
   ```
   This will ensure that tests can be run with the `npm test` command.

### Test Coverage

The tests ensure the following:

- **Successful Data Entry:** Return a status code `200` if a result is successfully entered into the table.
- **Invalid HTTP Methods:** Return status code `405` for unsupported HTTP methods such as POST, PUT, DELETE, and PATCH.
- **Database Connectivity:** Return status code `503` if the database is not connected.
- **Payload and Parameter Validation:** Validate if payload is missing from the request body or if request parameters are not included.

## Preparing for Digital Ocean Deployment

### Step 1: Create a Droplet in Digital Ocean

1. Navigate to Digital Ocean and click on **Create Droplet**.
2. Select the server location closest to your region.
3. Choose **Regular SSD** as the storage option.
4. Select the configuration with **1 GB RAM / 1 CPU** and **25 GB SSD disk**.
5. Set the OS to **Ubuntu 24.04 LTS**.
6. Generate an **SSH key** for secure access.
7. Click **Create Droplet** to complete the setup.

### Step 2: Transfer Files to the Droplet

Copy the `script` folder, application zip file, and the `.env` file to the newly created droplet using the following command:

```bash
thescp <zip_file> <script_folder> <.env_file> root@<droplet_ip>:/root
```

### Step 3: Run the Deployment Script

Execute the deployment script on the droplet:

```bash
bash <script_name>.sh
```

### Script Operations

The deployment script performs the following tasks:

1. **Update Packages:** Updates the package lists and upgrades system packages.
2. **RDBMS Installation:** Installs the mysql
3. **Database Creation:** Sets up the database in the RDBMS.
4. **User and Group Setup:** Creates a new Linux group and user for the application.
5. **Application Deployment:** Unzips the application to `/opt/csye6225`.
6. **Permission Management:** Updates the permissions for the directory and its contents to ensure proper access control.


## pr-checks with Github Actions..


## Conclusion
The `/healthz` API is a crucial tool for maintaining the health and stability of web application instances. By following this setup and testing guide, you can efficiently deploy and monitor your application.
