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

---

# PR Check Test Workflow

This GitHub Actions workflow is designed to run automated tests on your repository whenever a pull request is created or updated. It sets up a MySQL service, configures environment variables, installs dependencies, and runs tests for your Node.js application.

## Workflow Overview

The workflow does the following:

1. **Check out the repository**: Pulls the latest changes from the pull request branch.
2. **Set environment variables**: Uses secrets stored in GitHub to set up environment variables needed for testing.
3. **Start MySQL service**: Starts the MySQL database service.
4. **Set up Node.js**: Installs the required version of Node.js to run the application and tests.
5. **Install dependencies**: Runs `npm install` to install necessary packages.
6. **Wait for MySQL to be ready**: Ensures MySQL is up and running before proceeding with database initialization and tests.
7. **Initialize MySQL database**: Creates the test database if it doesn't exist.
8. **Run tests**: Executes your tests using `npm test`.

### Workflow Trigger

This workflow is triggered on the following event:
- **Pull request** targeting the `main` branch.

### Workflow Steps

1. **Checkout Repository**  
   The repository code is checked out using the `actions/checkout@v3` action so that the workflow can interact with the code in the pull request.

2. **Set Environment Variables for Tests**  
   The necessary environment variables are set by creating a `.env` file. These variables are taken from GitHub Secrets to avoid exposing sensitive data, such as database credentials.
   
   - `DB_USERNAME`: The MySQL root username.
   - `DB_PASSWORD`: The MySQL root password.
   - `DB_HOST`: The host of the MySQL service.
   - `ENV`: The environment (e.g., `production`, `development`).
   - `DB_NAME_TEST`: The name of the test database to be used.

3. **Enable MySQL Service**  
   The MySQL service is started using `systemctl` to ensure it's ready to accept connections.

4. **Set Up Node.js**  
   The required version of Node.js is set up using the `actions/setup-node@v3` action. In this case, Node.js version 20 is installed.

5. **Install Dependencies**  
   The `npm install` command is executed to install the required Node.js dependencies for the project.

6. **Wait for MySQL to Be Ready**  
   The workflow waits for MySQL to be ready by using `mysqladmin ping`. It tries for 30 attempts, with a 2-second interval between each attempt.

7. **Initialize MySQL Database as Root**  
   Once MySQL is ready, the database is initialized. The test database is created (if it doesn't already exist) using the root MySQL credentials stored in GitHub Secrets.

8. **Run Tests**  
   Finally, `npm test` is run to execute the application tests to ensure that everything is functioning correctly.

## Prerequisites

Before using this workflow, make sure the following are set up in your GitHub repository:

- **MySQL**: Ensure that MySQL is properly configured in your project.
- **Node.js**: This workflow is set to use Node.js version `20`. You can update this version if required.
- **GitHub Secrets**: The following secrets must be configured in your GitHub repository:
  - `DB_USER_ROOT`: MySQL root username.
  - `DB_ROOT_PASSWORD`: MySQL root password.
  - `DB_HOST`: Host for MySQL connection (usually `localhost` or `127.0.0.1`).
  - `ENV`: Your environment (e.g., `production`, `development`).
  - `DB_NAME_TEST`: The name of the database used for tests.

## How to Use

1. **Set up GitHub Secrets**: In your GitHub repository, go to **Settings** > **Secrets** and add the necessary secrets (as mentioned in the Prerequisites section).
2. **Create or update the workflow file**: Place the `.yml` file (from the code you provided) in the `.github/workflows/` directory of your repository.
3. **Push changes**: Once your workflow is set up, push changes to the repository.
4. **Create a pull request**: Whenever a pull request is opened or updated targeting the `main` branch, the workflow will automatically run, setting up MySQL, installing dependencies, and executing tests.




## Conclusion
The `/healthz` API is a crucial tool for maintaining the health and stability of web application instances. By following this setup and testing guide, you can efficiently deploy and monitor your application.
#Test review1
