
variable "description" {
  default     = ""
  description = "Description of the Environment"
}
variable "eb_name" {
  description = "Name of the Environment"
}

variable "tier" {
  type = string
  description = "Elastic Beanstalk Environment tier. Valid values are Worker or WebServer"
}

variable "environment_type" {
  default     = "LoadBalanced"
  description = "Environment type, e.g. 'LoadBalanced' or 'SingleInstance'"
}

variable "version_label" {
  default     = ""
  description = "Elastic Beanstalk Application version to deploy"
}

variable "wait_for_ready_timeout" {
  type        = string
  default     = "20m"
  description = "The maximum duration to wait for the Elastic Beanstalk Environment to be in a ready state before timing out"
}

variable "solution_stack_name" {
  type        = string
  default     = "64bit Amazon Linux 2018.03 v2.9.11 running Python 3.6"
  description = "Elastic Beanstalk stack, e.g. Docker, Go, Node, Java, IIS. For more info, see https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platformssupported.html"
}
variable "tags_eb" {
  type = map(string)
  default ={}
  description = "A map of tags to assign to Environment"
}
variable "tags_sqs" {
  type = map(string)
  default ={}
  description = "A map of tags to assign to the queue"
}
variable "iaso_worker_default_beanstalk_settings" {
  description = "The default settings we use in all our worker"
  type = list(object({
    name      = string
    namespace = string
    value     = string
  }))

  default = [

    {
      namespace = "aws:autoscaling:updatepolicy:rollingupdate"
      name      = "RollingUpdateType"
      value     = "Time"
    },
    { name      = "Timeout"
      namespace = "aws:autoscaling:updatepolicy:rollingupdate"
      resource  = ""
      value     = "PT30M"
    },
    {
      namespace = "aws:elasticbeanstalk:command"
      name      = "IgnoreHealthCheck"
      value     = "false"
    },
    {
      namespace = "aws:autoscaling:asg"
      name      = "Availability Zones"
      value     = "Any"
    },
    {
      namespace = "aws:elasticbeanstalk:command"
      name      = "DeploymentPolicy"
      value     = "AllAtOnce"
    },
    {
      namespace = "aws:autoscaling:updatepolicy:rollingupdate"
      name      = "RollingUpdateEnabled"
      value     = "false"
    },
    {
      namespace = "aws:elasticbeanstalk:environment"
      name      = "EnvironmentType"
      value     = "LoadBalanced"
    },

  ]
}
variable "eb_size" {
  default     = "t2.micro"
  description = "EC2size to be used"
}
variable "maxSize" {
  default     = 4
  description = "The maximum number of instances that you want in your Auto Scaling group"
}
variable "minSize" {
  default     = 1
  description = "The minimum number of instances that you want in your Auto Scaling group"
}
variable "elastic_beanstalk" {
  type = list(object({
    namespace = string
    name      = string
    value     = string
  }))

  default     = []
  description = "Override Elastic Beanstalk setttings"
}

variable "access_key" {
  default = ""
  description = "AWS Access key for bucket which is the value of AWS_ACCESS_KEY_ID env"
}
variable "secret_access_key" {
  default = ""
  description = "AWS Secret key for bucket which is the value of AWS_SECRET_ACCESS_KEY env"

}
variable "bucket_name" {
  default = ""
  description = "Bucket name which is the value of AWS_STORAGE_BUCKET_NAME env"
}
variable "enketo_api_token" {
  default = ""
  description = "Enketo Api Token which is the value of ENKETO_API_TOKEN env"

}
variable "enketo_url" {
  default = "https://enketo-iaso.bluesquare.org"
  description = "Enketo url which is the value of ENKETO_URL env"

}
variable "lang" {
  default = "en_GB.UTF-8"
  description = "Lang which is the value of LANG env"

}
variable "lc_all" {
  default = "en_GB.UTF-8"
  description = "LC_all which is the value of LC_ALL env"

}
variable "rds_db_name" {
  default = "iaso"
  description = "Database name for Iaso which is the value of RDS_DB_NAME env"
}
variable "rds_username" {
  default = "iaso"
  description = "Username for the Iaso DB user which is the value of RDS_USERNAME env"
}
variable "rds_hostname" {
  default = ""
  description = "The hostname of RDS instance which is the value of RDS_HOSTNAME env"
}
variable "rds_password" {
  default = ""
  description = "Password for the DHIS DB user which is the value of RDS_PASSWORD env"
}
variable "rds_port" {
  default = "5432"
  description = "The database port which is the value of RDS_PORD env"
}
variable "staging" {
  default = "true"
  description = "The value of STAGING env"

}
variable "secret_key" {
  default = ""
  description = "The value of SECRET_KEY env"

}
variable "use_s3" {
  default = "true"
  description = "The value of USE_S3 env"

}
variable "worker" {
  default = "true"
  description = "Define the type of environment. It is the value of WORKER env"

}

variable "sqs_name" {
  default = "iaso-staging-queue"
  description = "The name of queue"

}

variable "deadletter_name" {
  default = "iaso-staging-queue"
  description = "The name of dead letter queue"

}
variable "ami" {
  default = "ami-043e4e49a1b1c990a"
  description = "AMI to use for the instance"

}



