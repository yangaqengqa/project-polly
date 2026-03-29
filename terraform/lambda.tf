data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/lambda/polly-handler"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "polly_handler" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  function_name    = "${var.project_name}-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.audio.bucket
      TABLE_NAME  = aws_dynamodb_table.history.name
      REGION      = var.aws_region
    }
  }

  tags = {
    Project = var.project_name
  }
}
