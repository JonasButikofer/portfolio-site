# Must live in us-east-1 for CloudFront (SPEC.md §7.1), regardless of
# var.aws_region. Covers both the apex and www via a SAN.
resource "aws_acm_certificate" "site" {
  provider                 = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method          = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# DNS is hosted at Cloudflare (Cloudflare Registrar domains must stay on
# Cloudflare nameservers), so the validation CNAMEs are added there by hand.
# With no validation_record_fqdns, this resource simply waits until ACM sees
# the CNAMEs and issues the certificate. See outputs.tf: acm_validation_records.
resource "aws_acm_certificate_validation" "site" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site.arn
}
