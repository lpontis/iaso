
variable "description" {
  default     = ""
  description = "Description of the Environment"
}
variable "eb_name" {
  default     = "iaso"
  description = "Name of the Environment"
}

variable "tier" {
  type = string
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
variable "MaxSize" {
  default     = 4
  description = "The maximum number of instances that you want in your Auto Scaling group"
}
variable "MinSize" {
  default     = 1
  description = "EThe minimum number of instances that you want in your Auto Scaling group"
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
}
variable "secret_access_key" {
  default = ""

}
variable "bucket_name" {
  default = ""

}
variable "enketo_api_token" {
  default = ""

}
variable "enketo_url" {
  default = "https://enketo-iaso.bluesquare.org"

}
variable "lang" {
  default = "en_GB.UTF-8"

}
variable "lc_all" {
  default = "en_GB.UTF-8"

}
variable "rds_db_name" {
  default = "iaso"

}
variable "rds_username" {
  default = "iaso"

}
variable "rds_hostname" {
  default = ""

}
variable "rds_password" {
  default = ""

}
variable "rds_port" {
  default = "5432"

}
variable "staging" {
  default = "true"

}
variable "secret_key" {
  default = ""

}
variable "use_s3" {
  default = "true"

}
variable "worker" {
  default = "true"

}

variable "sqs_name" {
  default = "iaso-staging-queue"

}


