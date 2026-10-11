variable "domain_name" {
  description = "Apex domain the site is served from. See SPEC.md §1 — confirm before applying."
  type        = string
  default     = "jonasbutikofer.com"
}

variable "aws_region" {
  description = "Default AWS region for non-global resources (the S3 bucket)."
  type        = string
  default     = "us-west-2"
}

variable "github_org" {
  description = "GitHub org/user that owns the site repo, for the OIDC trust policy."
  type        = string
}

variable "github_repo" {
  description = "GitHub repo name (without the org prefix), for the OIDC trust policy."
  type        = string
  default     = "portfolio-site"
}
