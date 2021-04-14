
data "aws_elastic_beanstalk_application" "ebapp" {
  name = "Iaso"
}


data "aws_iam_role" "elbservicerole" {
  name = "aws-elasticbeanstalk-service-role"
}

data "aws_iam_instance_profile" "example" {
  name = "aws-elasticbeanstalk-ec2-role"
}

resource "aws_sqs_queue" "deadletter" {
  name = var.deadletter_name
}
resource "aws_sqs_queue_policy" "deadletter" {
  queue_url = aws_sqs_queue.deadletter.id
  policy = <<POLICY
{
  "Version": "2008-10-17",
  "Id": "__default_policy_ID",
  "Statement": [
    {
      "Sid": "__owner_statement",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::198293380284:root"
      },
      "Action": "SQS:*",
      "Resource": "${aws_sqs_queue.deadletter.arn}"
    }
  ]
}
POLICY
}
resource "aws_sqs_queue_policy" "sqs" {
  queue_url = aws_sqs_queue.sqs.id
  policy = <<POLICY
{
  "Version": "2008-10-17",
  "Id": "__default_policy_ID",
  "Statement": [
    {
      "Sid": "__owner_statement",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::198293380284:root"
      },
      "Action": "SQS:*",
      "Resource": "${aws_sqs_queue.sqs.arn}"
    }
  ]
}
POLICY
}
resource "aws_sqs_queue" "sqs" {
  name = var.sqs_name
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount     = 10
  })
  tags                   = var.tags_sqs
}
resource "aws_elastic_beanstalk_environment" "ebenv" {
  description            = var.description
  name                   = var.eb_name
  tier                   = var.tier
  application            = data.aws_elastic_beanstalk_application.ebapp.name
  solution_stack_name    = var.solution_stack_name
  wait_for_ready_timeout = var.wait_for_ready_timeout
  version_label          = var.version_label
  tags                   = var.tags_eb
  dynamic "setting" {
    for_each = var.iaso_worker_default_beanstalk_settings
    content {
      namespace = setting.value["namespace"]
      name      = setting.value["name"]
      value     = setting.value["value"]
      resource  = ""
    }
  }
  setting {
    name      = "WorkerQueueURL"
    namespace = "aws:elasticbeanstalk:sqsd"
    resource  = ""
    value     = aws_sqs_queue.sqs.id
  }
  setting {
    name      = "BEANSTALK_SQS_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = aws_sqs_queue.sqs.id
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = "iaso-eb"
    resource  = ""
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "ImageId"
    value     = var.ami
    resource  = ""
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = var.eb_size
    resource  = ""
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = data.aws_iam_role.elbservicerole.arn
    resource  = ""
  }
  setting {
    name      = "IamInstanceProfile"
    namespace = "aws:autoscaling:launchconfiguration"
    value     = data.aws_iam_instance_profile.example.name
    resource  = ""
  }
  setting {
    name      = "AWS_ACCESS_KEY_ID"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.access_key
  }
  setting {
    name      = "AWS_SECRET_ACCESS_KEY"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.secret_access_key
  }
  setting {
    name      = "AWS_STORAGE_BUCKET_NAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.bucket_name
  }
  setting {
    name      = "DEBUG"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = "false"
  }

  setting {
    name      = "ENKETO_API_TOKEN"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.enketo_api_token
  }
  setting {
    name      = "ENKETO_URL"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.enketo_url
  }
  setting {
    name      = "LANG"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.lang
  }
  setting {
    name      = "LC_ALL"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.lc_all
  }
  setting {
    name      = "RDS_DB_NAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.rds_db_name
  }
  setting {
    name      = "RDS_HOSTNAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.rds_hostname
  }
  setting {
    name      = "RDS_PASSWORD"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.rds_password
  }
  setting {
    name      = "RDS_PORT"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.rds_port
  }
  setting {
    name      = "RDS_USERNAME"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.rds_username
  }
  setting {
    name      = "STAGING"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.staging
  }
  setting {
    name      = "SECRET_KEY"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.secret_key
  }
  setting {
    name      = "USE_S3"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.use_s3
  }
  setting {
    name      = "WORKER"
    namespace = "aws:elasticbeanstalk:application:environment"
    resource  = ""
    value     = var.worker
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = var.MinSize
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = var.MaxSize
    resource  = ""

  }
  setting {
    namespace = "aws:elasticbeanstalk:sqsd"
    name      = "HttpPath"
    value     = "/tasks/task/"
    resource  = ""
  }
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
    resource  = ""
  }
}
