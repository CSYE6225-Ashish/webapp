# Define the template format (Packer HCL v2)
packer {
  required_version = ">= 1.7.0"
  required_plugins {
    amazon = {
      version = ">= 1.3.4"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
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

#GCP VARIABLES



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


#GCP VARIABLES

variable "gcp_dev_project_id" {
  type    = string
  default = "dev-csye6225-452002"
}


variable "gcp_zone" {
  type    = string
  default = "us-central1-a"
}

variable "gcp_credentials_json" {
  type = string
}

variable "gcp_source_image_family" {
  type    = string
  default = "ubuntu-minimal-2404-lts-amd64"
}
variable "gcp_machine_type" {
  type    = string
  default = "e2-small"
}

variable "gcp_source_image" {
  type    = string
  default = "ubuntu-minimal-2404-noble-amd64-v20250221a X86_64 "
}
variable "gcp_image_user_email" {
  type    = string
  default = null
}

variable "gcp_demo_project_id" {
  type    = string
  default = null
}





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
locals {
  image_timestamp = formatdate("YYYYMMDDHHmmss", timestamp()) # Generates YYYYMMDDHHmmss
}

source "googlecompute" "gce" {
  project_id          = var.gcp_dev_project_id
  image_name          = "${var.ami_name_prefix}-${local.image_timestamp}"
  source_image_family = var.gcp_source_image_family
  machine_type        = var.gcp_machine_type
  zone                = var.gcp_zone
  ssh_username        = "packer"
  image_family        = "custom-family"
  image_description   = "Custom GCP image built with Packer"
  credentials_json    = var.gcp_credentials_json
}



# Define the build
build {
  sources = [
    "source.amazon-ebs.aws",
    # "source.googlecompute.gce",
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
    ]
  }

  provisioner "shell" {
    script = "./folderPermissions.sh"
  }

  provisioner "shell" {
    inline = [
      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
      "rm amazon-cloudwatch-agent.deb"
    ]
  }

  provisioner "file" {
    source      = "config.json"
    destination = "/tmp"
  }

  provisioner "shell" {
    inline = [
      "sudo cp /tmp/config.json /opt/aws/amazon-cloudwatch-agent/bin/",
    ]
  }



  provisioner "shell" {
    inline = [
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service"
    ]
  }



  # post-processor "shell-local" {
  #   only = ["googlecompute.gce"]
  #   inline = [
  #     "gcloud compute images add-iam-policy-binding ${var.ami_name_prefix}-${local.image_timestamp} --project=${var.gcp_dev_project_id} --member=serviceAccount:${var.gcp_image_user_email} --role=roles/compute.imageUser"
  #   ]
  # }
}