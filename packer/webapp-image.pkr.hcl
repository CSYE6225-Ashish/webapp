# Define the template format (Packer HCL v2)
packer {
  required_version = ">= 1.7.0"
  required_plugins {
    amazon = {
      version = ">= 1.3.4"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

# AWS Variables
variable "aws_region" {
          default = env("AWS_REGION")
}

variable "aws_instance_type" {
  default = env("AWS_INSTANCE_TYPE")
}

variable "aws_access_key" {
  default = env("AWS_ACCESS_KEY")
}

variable "aws_secret_key" {
  default = env("AWS_SECRET_ACCESS_KEY")
}

# Define the source AMI directly (also via env)
variable "source_ami" {
  default = env("SOURCE_AMI")
}

# Common Variables
variable "ami_name_prefix" {
  default = env("AMI_NAME_PREFIX")
}


variable "db_name" {
  default = env("DB_NAME")
}

variable "db_user" {
  default = env("DB_USER")
}

variable "db_password" {
  default = env("DB_PASSWORD")
}

variable "db_host" {
  default = env("DB_HOST")
}

variable "dev_user" {}


# Define the AWS builder
source "amazon-ebs" "aws" {
  region        = var.aws_region
  source_ami    = var.source_ami
  instance_type = var.aws_instance_type
  ssh_username  = "ubuntu"

  access_key = var.aws_access_key
  secret_key = var.aws_secret_key

  ami_name = "${var.ami_name_prefix}-{{timestamp}}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  ami_users = [var.dev_user]



}

# Define the build
build {
  sources = [
    "source.amazon-ebs.aws",
  ]

  provisioner "shell" {
    script = "./updateOs.sh"
  }

  provisioner "shell" {
    script = "./fileSetup.sh"
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }


  provisioner "shell" {
    inline = [
      "sudo unzip -o -q /tmp/webapp.zip -d /opt/csye6225",
      "sudo cp /tmp/webapp.service /etc/systemd/system/",
      "sudo mysql -e \"CREATE DATABASE ${var.db_name};\"",
      "sudo mysql -e \"ALTER USER '${var.db_user}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${var.db_password}';\"",
      "sudo systemctl restart mysql"
    ]
  }

  provisioner "shell" {
    script = "./folderPermissions.sh"
  }



  provisioner "shell" {
    inline = [
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service"
    ]
  }



}