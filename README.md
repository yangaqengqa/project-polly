# Project Polly

Real-time text-to-audio web app powered by Amazon Polly.

**Stack:** Next.js · AWS Amplify (Cognito) · API Gateway · Lambda · S3 · DynamoDB · Terraform · Vercel · Jenkins

---

## Repository Structure

```
project-polly/
├── backend/
│   └── lambda/
│       └── polly-handler/
│           ├── index.mjs        # Lambda handler (Polly + S3 + DynamoDB)
│           └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── AuthButton.tsx
│   │   ├── history/
│   │   │   └── page.tsx         # Synthesis history page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Main TTS page
│   ├── lib/
│   │   ├── auth.ts              # Amplify Cognito config
│   │   └── api.ts               # Typed API Gateway client
│   ├── .env.local.example
│   ├── next.config.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── cognito.tf
│   ├── lambda.tf
│   ├── api_gateway.tf
│   ├── s3.tf
│   ├── dynamodb.tf
│   └── iam.tf
├── .gitignore
├── Jenkinsfile
└── README.md
```

---

## Deployment Order

### 1 — Provision AWS Infrastructure

```bash
cd terraform
terraform init
terraform apply
```

Note the outputs — you will need them in the next step.

### 2 — Configure Frontend Environment

```bash
cp frontend/.env.local.example frontend/.env.local
```

Fill in `frontend/.env.local` using `terraform output`:

| Variable                      | Terraform Output          |
|-------------------------------|---------------------------|
| NEXT_PUBLIC_USER_POOL_ID      | cognito_user_pool_id      |
| NEXT_PUBLIC_CLIENT_ID         | cognito_client_id         |
| NEXT_PUBLIC_COGNITO_DOMAIN    | cognito_hosted_ui_domain  |
| NEXT_PUBLIC_API_URL           | api_url                   |
| NEXT_PUBLIC_APP_URL           | your Vercel URL           |

### 3 — Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

### 4 — Deploy Frontend to Vercel

1. Push repo to GitHub
2. Import project in [vercel.com](https://vercel.com) → set root directory to `frontend`
3. Add all `NEXT_PUBLIC_*` env vars in Vercel project settings
4. Copy the Vercel deploy hook URL (Settings → Git → Deploy Hooks)

### 5 — Update Terraform with Vercel URL

```bash
cd terraform
terraform apply -var="frontend_url=https://your-real-app.vercel.app"
```

### 6 — Configure Jenkins

Add the following credentials in Jenkins (Manage Jenkins → Credentials):

| ID                  | Type                          | Value                        |
|---------------------|-------------------------------|------------------------------|
| `aws-creds`         | AWS Credentials               | IAM user access key + secret |
| `vercel-deploy-hook`| Secret text                   | Vercel deploy hook URL       |

Create a Jenkins Pipeline job pointing at this repository. The `Jenkinsfile` will:
- Run `terraform plan` on every Pull Request
- Run `terraform apply` + Lambda deploy + Vercel trigger on every merge to `main`

---

## API Endpoints

| Method | Path         | Description                        |
|--------|--------------|------------------------------------|
| POST   | /synthesize  | Convert text to MP3, store in S3   |
| GET    | /history     | Fetch last 20 synthesis records    |

Both endpoints require a valid Cognito JWT in the `Authorization: Bearer <token>` header.
