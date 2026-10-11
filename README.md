# jonasbutikofer.com

Personal portfolio site. Static Vite + React + TypeScript SPA, hand-rolled CSS on Tailwind
utilities, no backend. Hosted on S3 + CloudFront via Terraform, deployed by GitHub Actions on
every push to `main`. See [SPEC.md](../SPEC.md) for the full build spec.

All commands below are PowerShell (the owner develops on Windows).

## Local development

```powershell
npm install
npm run dev
```

Opens the dev server at `http://localhost:5173`.

```powershell
npm run build    # typecheck + static build to dist/
npm run preview  # serve the production build locally
npm run lint      # oxlint
npm run format    # prettier --write .
```

## Before shipping

A few things are intentionally left as placeholders and are marked `REPLACE_ME` or `TODO(owner)`
in the source — search for `REPLACE_ME` to find them all:

- `src/data/site.ts` — GitHub URL, LinkedIn URL, email, experience dates
- `src/data/projects.ts` — repo/demo/writeup links (all empty until repos go public)
- `index.html` — the `sameAs` links in the JSON-LD `Person` schema
- `public/resume.pdf` — replace with the real resume PDF
- `infra/*.tf` — `github_org` has no default; set it (and confirm `domain_name`) before applying

## One-time infrastructure bootstrap

Requires the [AWS CLI](https://aws.amazon.com/cli/), [Terraform](https://developer.hashicorp.com/terraform/install) `>= 1.7`, and an AWS account with credentials configured
(`aws configure` or an SSO profile).

```powershell
cd infra
terraform init
```

Create `infra/terraform.tfvars` (not committed) with at least:

```hcl
github_org  = "your-github-username-or-org"
domain_name = "jonasbutikofer.com"  # only if it differs from the default
```

If the AWS account already has `token.actions.githubusercontent.com` registered as an OIDC
provider (any prior repo in the account may have created it — it's a per-account resource), also
add:

```hcl
github_oidc_provider_already_exists = true
```

Same idea if the Route 53 hosted zone for the domain already exists:

```hcl
route53_zone_already_exists = true
```

Then:

```powershell
terraform apply
```

This creates the S3 bucket, CloudFront distribution, ACM certificate, Route 53 records, the
response headers policy, and the GitHub Actions OIDC role. ACM DNS validation and CloudFront
distribution propagation both take a few minutes — `terraform apply` waits for them.

If the hosted zone was created here (not pre-existing), point the domain registrar's nameservers
at the ones Terraform prints:

```powershell
terraform output route53_name_servers
```

DNS propagation for nameserver changes can take up to 48 hours, though it's usually much faster.

### Wire up GitHub Actions

In the GitHub repo settings, add:

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

- `AWS_DEPLOY_ROLE_ARN` — from `terraform output github_actions_role_arn`

**Variables** (same page, Variables tab):

- `AWS_REGION` — the region you set as `aws_region` in `terraform.tfvars` (default `us-west-2`)
- `S3_BUCKET` — from `terraform output s3_bucket_name`
- `CLOUDFRONT_DISTRIBUTION_ID` — from `terraform output cloudfront_distribution_id`

```powershell
terraform output github_actions_role_arn
terraform output s3_bucket_name
terraform output cloudfront_distribution_id
```

### First deploy

The very first sync has to happen before GitHub Actions can take over (or just push to `main` once
the secrets/variables above are set — the workflow does the same thing):

```powershell
cd ..
npm run build
aws s3 sync dist/assets "s3://jonasbutikofer.com/assets" --cache-control "public, max-age=31536000, immutable"
aws s3 sync dist "s3://jonasbutikofer.com" --delete --exclude "assets/*" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/index.html" "/"
```

### CSP: report-only, then enforce

`infra/cloudfront.tf` ships the Content-Security-Policy as `Content-Security-Policy-Report-Only`
at first (see the comment in that file). Once the deployed site has been exercised and nothing in
the browser console reports a CSP violation, move the same policy string into the
`content_security_policy` block under `security_headers_config` to enforce it, then
`terraform apply` again.

## Recurring deploy flow

Just push to `main`. GitHub Actions builds, syncs `dist/` to S3 (hashed assets get an immutable
cache header, everything else gets `no-cache`), and invalidates `/index.html` and `/` on
CloudFront — never `/*`, since hashed filenames make that unnecessary and it costs money.

## Cost

Route 53 hosted zone: ~$0.50/month, plus the domain registration itself. S3 and CloudFront on a
personal-traffic portfolio site land in the free tier or a few cents a month.
