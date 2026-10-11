output "s3_bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "acm_validation_records" {
  description = "Add these as DNS-only CNAME records at Cloudflare so ACM can issue the certificate."
  value = [
    for dvo in aws_acm_certificate.site.domain_validation_options : {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  ]
}

output "github_actions_role_arn" {
  description = "Set this as the role-to-assume in the deploy workflow."
  value       = aws_iam_role.github_actions_deploy.arn
}
