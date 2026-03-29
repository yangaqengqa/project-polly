variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as a prefix for all resources"
  type        = string
  default     = "project-polly"
}

variable "frontend_url" {
  description = "Vercel frontend URL (update after first Vercel deploy)"
  type        = string
  default     = "https://project-polly-rho.vercel.app"
}
