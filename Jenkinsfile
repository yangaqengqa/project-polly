pipeline {
  agent any

  environment {
    AWS_DEFAULT_REGION = 'us-east-1'
    LAMBDA_FUNCTION    = 'project-polly-handler'
    TF_DIR             = 'terraform'
    LAMBDA_DIR         = 'backend/lambda/polly-handler'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // ── Runs on every Pull Request ──────────────────────────────────────────
    stage('Terraform Plan') {
      when { changeRequest() }
      steps {
        dir(env.TF_DIR) {
          withCredentials([[
            $class:             'AmazonWebServicesCredentialsBinding',
            credentialsId:      'aws-creds',
            accessKeyVariable:  'AWS_ACCESS_KEY_ID',
            secretKeyVariable:  'AWS_SECRET_ACCESS_KEY'
          ]]) {
            sh 'terraform init -input=false'
            sh 'terraform validate'
            sh 'terraform plan -input=false -out=tfplan'
          }
        }
      }
    }

    // ── Runs only on merges to main ─────────────────────────────────────────
    stage('Terraform Apply') {
      when { branch 'main' }
      steps {
        dir(env.TF_DIR) {
          withCredentials([[
            $class:             'AmazonWebServicesCredentialsBinding',
            credentialsId:      'aws-creds',
            accessKeyVariable:  'AWS_ACCESS_KEY_ID',
            secretKeyVariable:  'AWS_SECRET_ACCESS_KEY'
          ]]) {
            sh 'terraform init -input=false'
            sh 'terraform apply -input=false -auto-approve'
          }
        }
      }
    }

    stage('Deploy Lambda') {
      when { branch 'main' }
      steps {
        dir(env.LAMBDA_DIR) {
          withCredentials([[
            $class:             'AmazonWebServicesCredentialsBinding',
            credentialsId:      'aws-creds',
            accessKeyVariable:  'AWS_ACCESS_KEY_ID',
            secretKeyVariable:  'AWS_SECRET_ACCESS_KEY'
          ]]) {
            sh 'npm ci --omit=dev'
            sh 'zip -r lambda.zip . --exclude "*.zip"'
            sh """
              aws lambda update-function-code \
                --function-name ${env.LAMBDA_FUNCTION} \
                --zip-file fileb://lambda.zip \
                --region ${env.AWS_DEFAULT_REGION}
            """
            sh """
              aws lambda wait function-updated \
                --function-name ${env.LAMBDA_FUNCTION} \
                --region ${env.AWS_DEFAULT_REGION}
            """
          }
        }
      }
    }

    stage('Trigger Vercel Deploy') {
      when { branch 'main' }
      steps {
        withCredentials([string(credentialsId: 'vercel-deploy-hook', variable: 'HOOK_URL')]) {
          sh 'curl -s -X POST "$HOOK_URL"'
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline complete — all stages passed."
    }
    failure {
      echo "❌ Pipeline failed — review stage logs above."
    }
  }
}
