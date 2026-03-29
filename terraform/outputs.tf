output "api_url" {
  description = "API Gateway invoke URL — set as NEXT_PUBLIC_API_URL in Vercel"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID — set as NEXT_PUBLIC_USER_POOL_ID in Vercel"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID — set as NEXT_PUBLIC_CLIENT_ID in Vercel"
  value       = aws_cognito_user_pool_client.web.id
}

output "cognito_hosted_ui_domain" {
  description = "Cognito Hosted UI domain — set as NEXT_PUBLIC_COGNITO_DOMAIN in Vercel"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "s3_bucket_name" {
  description = "S3 bucket name for audio files"
  value       = aws_s3_bucket.audio.bucket
}

output "dynamodb_table_name" {
  description = "DynamoDB table name for synthesis history"
  value       = aws_dynamodb_table.history.name
}

output "lambda_function_name" {
  description = "Lambda function name — used by Jenkins deploy stage"
  value       = aws_lambda_function.polly_handler.function_name
}
