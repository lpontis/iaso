output "eb_name" {
  value       = aws_elastic_beanstalk_environment.ebenv.name
  description = "Name of the Elastic Beanstalk Environment"
}
