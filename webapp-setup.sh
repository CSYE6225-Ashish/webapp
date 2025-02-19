    #!/bin/bash

if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)

else
    echo ".env file not found make sure .env file is present in current directory"
    exit 1
fi

trap 'echo "Script Interrupted Exiting...."; exit 1' SIGINT SIGTERM
#1. Update the package lists for upgrades for packages that need upgrading.
echo "Upgrading packages..."
sudo apt upgrade -y

#2. Update the packages on the system.

echo "Updating packages..."
sudo apt update -y

echo "Packages updated!"
# 3. Install the RDBMS (MySQL/PostgreSQL/MariaDB).


# Check if MySQL is installed
if ! dpkg -l | grep -q mysql-server; then
    echo "MySQL not found. Installing MySQL..."
    sudo apt-get install mysql-server=8.0.41* -y
    sudo systemctl start mysql
else
    echo "MySQL already installed."
fi

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    echo "Starting MySQL service..."
    sudo systemctl start mysql
else
    echo "MySQL service is already running."
fi


#4. Create the database in the RDBMS.

# Alter MySQL user password 
sudo mysql -e "ALTER USER '${DB_USERNAME}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"

DB_EXISTS=$(mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_USERNAME';" | grep "$DB_NAME" > /dev/null; echo $?)

if [ $DB_EXISTS -eq 0 ]; then
  echo "Database '$DB_NAME' already exists. Skipping creation."
else
  echo "Database '$DB_NAME' does not exist. Creating database..."
  mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME;"
  echo "Database '$DB_NAME' created successfully."
fi


#5. Create a new Linux group for the application.


if (getent group $GROUP_NAME >/dev/null 2>&1); then
        echo "'$GROUP_NAME' already exist!"
else	
	echo "'$GROUP_NAME' does not exist!"
	groupadd $GROUP_NAME
	echo "'$GROUP_NAME' created successfully!"
        
fi

#6. Create a new user of the application.
if (getent passwd $USER_NAME >/dev/null 2>&1); then
        echo "'$USER_NAME' already exists!"
else
	echo "User does not exist creating user..."
	sudo useradd -m -G $GROUP_NAME $USER_NAME
	echo "$USER_NAME:$USER_PASSWORD" | sudo chpasswd
	echo "user '$USER_NAME' successfully created and added in '$GROUP_NAME' group"
fi



if ! dpkg -l | grep -q nodejs; then
    echo "Installing Node.js..."
    sudo apt-get install nodejs -y
fi

if ! dpkg -l | grep -q unzip; then
    echo "Installing unzip..."
    sudo apt-get install unzip -y
fi

if ! dpkg -l | grep -q npm; then
    echo "Installing npm..."
    sudo apt-get install npm -y
fi




echo "Creating directory /opt/csye6225"
sudo mkdir -p /opt/csye6225

# 7 . Unzip the application in /opt/csye6225 directory.

echo "Extracting '$ZIP_FILE' to /opt/csye6225 ....."

sudo unzip -o $ZIP_FILE  -d /opt/csye6225

#8. Update the permissions of the folder and artifacts in the directory.
echo "Updating permissions for $APP_DIR and its contents"
sudo chown -R $USER_NAME:$GROUP_NAME $APP_DIR
sudo chmod -R 750 $APP_DIR

echo "Setup completed successfully!"


    