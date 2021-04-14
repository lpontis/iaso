# terraform-iasso-beanstalk

This module create an AWS Elastic Beanstalk Worker environment and SQS queues. 

## Usage 
Using local path 
```hcl
module "iaso-staging-worker" {
  source      = "./terraform-iaso-beanstalk"
  tier        = "Worker"
  eb_name     = "Iaso-staging-worker"
  eb_size     = "t3.small"
  bucket_name = "iaso-staging"
  sqs_name    = "iaso-staging-queue"
  deadletter_name = "staging-dead-letter"
  access_key = "XXXXXXXXXXXXXXXXXXXXXX"
  secret_access_key = "XXXXXXXXXXXXXXXXXXXXXX"
  enketo_api_token = "XXXXXXXXXXXXXXXXXXXXXX"
  rds_hostname = "staging-iaso.ct2pysztqwxb.eu-central-1.rds.amazonaws.com"
  rds_db_name  = "iaso"
  rds_password = "XXXXXXXXXXXXXXXXXXXXXX"
  secret_key = "XXXXXXXXXXXXXXXXXXXXXX"
  tags_eb = {
    env     = "staging"
    manager = "Martin"
    project = "iaso"
    type    = "worker"
  }
  tags_sqs = {
    env                                 = "staging"
    manager                             = "Martin"
    project                             = "iaso"
    type                                = "worker"

  }
}
```

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14, < 0.15 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |


## Resources

| Name | Type |
|------|------|
| [aws_elastic_beanstalk_environment.ebenv](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elastic_beanstalk_environment) | resource |
| [aws_sqs_queue.deadletter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue.sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue) | resource |
| [aws_sqs_queue_policy.deadletter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue_policy) | resource |
| [aws_sqs_queue_policy.sqs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue_policy) | resource |
| [aws_elastic_beanstalk_application.ebapp](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/elastic_beanstalk_application) | data source |
| [aws_iam_instance_profile.example](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_instance_profile) | data source |
| [aws_iam_role.elbservicerole](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_role) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_MaxSize"></a> [MaxSize](#input\_MaxSize) | The maximum number of instances that you want in your Auto Scaling group | `number` | `4` | no |
| <a name="input_MinSize"></a> [MinSize](#input\_MinSize) | The minimum number of instances that you want in your Auto Scaling group | `number` | `1` | no |
| <a name="input_access_key"></a> [access\_key](#input\_access\_key) | AWS Access key for bucket which is the value of AWS\_ACCESS\_KEY\_ID env | `string` | `""` | no |
| <a name="input_ami"></a> [ami](#input\_ami) | AMI to use for the instance | `string` | `"ami-043e4e49a1b1c990a"` | no |
| <a name="input_bucket_name"></a> [bucket\_name](#input\_bucket\_name) | Bucket name which is the value of AWS\_STORAGE\_BUCKET\_NAME env | `string` | `""` | no |
| <a name="input_deadletter_name"></a> [deadletter\_name](#input\_deadletter\_name) | The name of dead letter queue | `string` | `"iaso-staging-queue"` | no |
| <a name="input_description"></a> [description](#input\_description) | Description of the Environment | `string` | `""` | no |
| <a name="input_eb_name"></a> [eb\_name](#input\_eb\_name) | Name of the Environment | `any` | n/a | yes |
| <a name="input_eb_size"></a> [eb\_size](#input\_eb\_size) | EC2size to be used | `string` | `"t2.micro"` | no |
| <a name="input_elastic_beanstalk"></a> [elastic\_beanstalk](#input\_elastic\_beanstalk) | Override Elastic Beanstalk setttings | <pre>list(object({<br>    namespace = string<br>    name      = string<br>    value     = string<br>  }))</pre> | `[]` | no |
| <a name="input_enketo_api_token"></a> [enketo\_api\_token](#input\_enketo\_api\_token) | Enketo Api Token which is the value of ENKETO\_API\_TOKEN env | `string` | `""` | no |
| <a name="input_enketo_url"></a> [enketo\_url](#input\_enketo\_url) | Enketo url which is the value of ENKETO\_URL env | `string` | `"https://enketo-iaso.bluesquare.org"` | no |
| <a name="input_environment_type"></a> [environment\_type](#input\_environment\_type) | Environment type, e.g. 'LoadBalanced' or 'SingleInstance' | `string` | `"LoadBalanced"` | no |
| <a name="input_iaso_worker_default_beanstalk_settings"></a> [iaso\_worker\_default\_beanstalk\_settings](#input\_iaso\_worker\_default\_beanstalk\_settings) | The default settings we use in all our worker | <pre>list(object({<br>    name      = string<br>    namespace = string<br>    value     = string<br>  }))</pre> | <pre>[<br>  {<br>    "name": "RollingUpdateType",<br>    "namespace": "aws:autoscaling:updatepolicy:rollingupdate",<br>    "value": "Time"<br>  },<br>  {<br>    "name": "Timeout",<br>    "namespace": "aws:autoscaling:updatepolicy:rollingupdate",<br>    "resource": "",<br>    "value": "PT30M"<br>  },<br>  {<br>    "name": "IgnoreHealthCheck",<br>    "namespace": "aws:elasticbeanstalk:command",<br>    "value": "false"<br>  },<br>  {<br>    "name": "Availability Zones",<br>    "namespace": "aws:autoscaling:asg",<br>    "value": "Any"<br>  },<br>  {<br>    "name": "DeploymentPolicy",<br>    "namespace": "aws:elasticbeanstalk:command",<br>    "value": "AllAtOnce"<br>  },<br>  {<br>    "name": "RollingUpdateEnabled",<br>    "namespace": "aws:autoscaling:updatepolicy:rollingupdate",<br>    "value": "false"<br>  },<br>  {<br>    "name": "EnvironmentType",<br>    "namespace": "aws:elasticbeanstalk:environment",<br>    "value": "LoadBalanced"<br>  }<br>]</pre> | no |
| <a name="input_lang"></a> [lang](#input\_lang) | Lang which is the value of LANG env | `string` | `"en_GB.UTF-8"` | no |
| <a name="input_lc_all"></a> [lc\_all](#input\_lc\_all) | LC\_all which is the value of LC\_ALL env | `string` | `"en_GB.UTF-8"` | no |
| <a name="input_rds_db_name"></a> [rds\_db\_name](#input\_rds\_db\_name) | Database name for Iaso which is the value of RDS\_DB\_NAME env | `string` | `"iaso"` | no |
| <a name="input_rds_hostname"></a> [rds\_hostname](#input\_rds\_hostname) | The hostname of RDS instance which is the value of RDS\_HOSTNAME env | `string` | `""` | no |
| <a name="input_rds_password"></a> [rds\_password](#input\_rds\_password) | Password for the DHIS DB user which is the value of RDS\_PASSWORD env | `string` | `""` | no |
| <a name="input_rds_port"></a> [rds\_port](#input\_rds\_port) | The database port which is the value of RDS\_PORD env | `string` | `"5432"` | no |
| <a name="input_rds_username"></a> [rds\_username](#input\_rds\_username) | Username for the Iaso DB user which is the value of RDS\_USERNAME env | `string` | `"iaso"` | no |
| <a name="input_secret_access_key"></a> [secret\_access\_key](#input\_secret\_access\_key) | AWS Secret key for bucket which is the value of AWS\_SECRET\_ACCESS\_KEY env | `string` | `""` | no |
| <a name="input_secret_key"></a> [secret\_key](#input\_secret\_key) | The value of SECRET\_KEY env | `string` | `""` | no |
| <a name="input_solution_stack_name"></a> [solution\_stack\_name](#input\_solution\_stack\_name) | Elastic Beanstalk stack, e.g. Docker, Go, Node, Java, IIS. For more info, see https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platformssupported.html | `string` | `"64bit Amazon Linux 2018.03 v2.9.11 running Python 3.6"` | no |
| <a name="input_sqs_name"></a> [sqs\_name](#input\_sqs\_name) | The name of queue | `string` | `"iaso-staging-queue"` | no |
| <a name="input_staging"></a> [staging](#input\_staging) | The value of STAGING env | `string` | `"true"` | no |
| <a name="input_tags_eb"></a> [tags\_eb](#input\_tags\_eb) | A map of tags to assign to Environment | `map(string)` | `{}` | no |
| <a name="input_tags_sqs"></a> [tags\_sqs](#input\_tags\_sqs) | A map of tags to assign to the queue | `map(string)` | `{}` | no |
| <a name="input_tier"></a> [tier](#input\_tier) | Elastic Beanstalk Environment tier. Valid values are Worker or WebServer | `string` | n/a | yes |
| <a name="input_use_s3"></a> [use\_s3](#input\_use\_s3) | The value of USE\_S3 env | `string` | `"true"` | no |
| <a name="input_version_label"></a> [version\_label](#input\_version\_label) | Elastic Beanstalk Application version to deploy | `string` | `""` | no |
| <a name="input_wait_for_ready_timeout"></a> [wait\_for\_ready\_timeout](#input\_wait\_for\_ready\_timeout) | The maximum duration to wait for the Elastic Beanstalk Environment to be in a ready state before timing out | `string` | `"20m"` | no |
| <a name="input_worker"></a> [worker](#input\_worker) | Define the type of environment. It is the value of WORKER env | `string` | `"true"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_eb_name"></a> [eb\_name](#output\_eb\_name) | Name of the Elastic Beanstalk Environment |

