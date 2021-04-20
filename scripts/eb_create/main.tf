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
  eb_name     = "Iaso-staging-worker"
  eb_size     = "t3.small"
  bucket_name = "iaso-staging"
  sqs_name    = "iaso-staging-queue"
  deadletter_name = "staging-dead-letter"
  access_key = "XXXXXXXXXXXXXXXXXXXXX"
  secret_access_key = "XXXXXXXXXXXXXXXXXXXXXXXX"
  enketo_api_token = "XXXXXXXXXXXXXXXXXXXXXXXXXX"
  rds_hostname = "staging-iaso.ct2pysztqwxb.eu-central-1.rds.amazonaws.com"
  rds_db_name  = "iaso"
  rds_password = "XXXXXXXXXXXXXXXXXXXXXX"
  secret_key = "XXXXXXXXXXXXXXXXXXXXXXXX"
  tags_eb = {
    env     = "staging"
    manager = "Manager"
    project = "iaso"
    type    = "worker"
  }
  tags_sqs = {
    env                                 = "staging"
    manager                             = "Manager"
    project                             = "iaso"
    type                                = "worker"

  }
}