resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.domain_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Redirects www -> apex, preserving path and query. Runs on the same
# distribution as the apex (www is a second alternate domain name below),
# which is cheaper than standing up a second distribution (SPEC.md §7.1).
resource "aws_cloudfront_function" "www_redirect" {
  name    = "${replace(var.domain_name, ".", "-")}-www-redirect"
  runtime = "cloudfront-js-2.0"
  comment = "301 www.${var.domain_name} -> ${var.domain_name}"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var request = event.request;
      var host = request.headers.host.value;
      if (host.indexOf('www.') === 0) {
        // request.querystring is an object ({key: {value}}), not a string.
        var parts = [];
        var keys = Object.keys(request.querystring);
        for (var i = 0; i < keys.length; i++) {
          var q = request.querystring[keys[i]];
          if (q.multiValue) {
            for (var j = 0; j < q.multiValue.length; j++) {
              parts.push(keys[i] + '=' + q.multiValue[j].value);
            }
          } else {
            parts.push(q.value === '' ? keys[i] : keys[i] + '=' + q.value);
          }
        }
        var qs = parts.length ? '?' + parts.join('&') : '';
        return {
          statusCode: 301,
          statusDescription: 'Moved Permanently',
          headers: {
            location: { value: 'https://${var.domain_name}' + request.uri + qs }
          }
        };
      }
      return request;
    }
  EOT
}

resource "aws_cloudfront_response_headers_policy" "site" {
  name = "${replace(var.domain_name, ".", "-")}-security-headers"

  security_headers_config {
    strict_transport_security {
      override                  = true
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
    }

    content_type_options {
      override = true
    }

    referrer_policy {
      override        = true
      referrer_policy = "strict-origin-when-cross-origin"
    }

    frame_options {
      override     = true
      frame_option = "DENY"
    }
  }

  # aws_cloudfront_response_headers_policy's built-in content_security_policy
  # block always emits an enforcing header — there's no report-only mode for
  # it. So the report-only phase (SPEC.md §7.1: start report-only, verify
  # nothing breaks, then enforce) is a custom header instead. Once verified,
  # delete this items block and move the same policy string into
  # security_headers_config.content_security_policy above to enforce it.
  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }

    items {
      header   = "Content-Security-Policy-Report-Only"
      value    = local.content_security_policy
      override = true
    }
  }
}

locals {
  content_security_policy = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = [var.domain_name, "www.${var.domain_name}"]
  http_version        = "http2and3"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-${var.domain_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods          = ["GET", "HEAD"]
    target_origin_id        = "s3-${var.domain_name}"
    viewer_protocol_policy  = "redirect-to-https"
    compress                = true
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.www_redirect.arn
    }
  }

  # SPA deep links (?project=<slug>) always resolve to index.html rather
  # than an S3 403/404 (SPEC.md §7.1).
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}
