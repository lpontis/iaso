terraform {
  required_version = ">= 0.14, < 0.15"

  required_providers {
    aws = {
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

module "iaso-prod-worker" {
  source      = "./terraform-iaso-beanstalk"
  tier        = "Worker"
  eb_name     = "Iaso-env-worker"
  eb_size     = "t3.small"
  bucket_name = "iaso-prod"
  sqs_name    = "iaso-prod-queue"
  tags_eb = {
    env     = "prod"
    manager = "Martin DW"
    project = "iaso"
    type    = "worker"
  }
  tags_sqs = {
    env                                 = "prod"
    manager                             = "Martin DW"
    project                             = "iaso"
    type                                = "worker"

  }
}