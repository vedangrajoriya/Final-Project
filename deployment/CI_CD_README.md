# 🚀 Continuous Integration & Deployment Guide

This document outlines the GitHub Actions pipelines, AWS EC2 automation, and Kubernetes manifests for the AI Hospitality Experience Platform.

## 🔐 Required GitHub Secrets

Before the pipelines can run successfully, you **must** configure the following secrets in your GitHub repository (`Settings` > `Secrets and variables` > `Actions`):

### Core Application Secrets
| Secret Name | Description | Example |
|---|---|---|
| `GROQ_API_KEY` | Groq LLM API Key | `gsk_...` |
| `DEAPI_API_KEY` | deAPI Image Generation Key | `6829|...` |
| `PROD_API_URL` | The public URL of the backend API (used by Vite frontend build) | `https://api.yourdomain.com` or `http://<EC2-IP>:8000` |

### EC2 Deployment Secrets
| Secret Name | Description | Example |
|---|---|---|
| `EC2_HOST` | The public IP or DNS of the AWS EC2 instance | `54.123.45.67` |
| `EC2_USER` | The SSH username | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | The raw contents of your `.pem` or `.ed25519` private key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

---

## ☁️ Deploying to AWS EC2

The GitHub Actions `deploy.yml` workflow automates this. However, if you need to manually deploy or rollback on the server:

```bash
# Connect to your server
ssh ubuntu@<EC2_HOST>

# Navigate to the project directory
cd /home/ubuntu/app

# Run the deployment script manually
chmod +x ./deployment/scripts/deploy.sh
./deployment/scripts/deploy.sh ghcr.io/your_github_username/repo_name
```

---

## ☸️ Deploying to Kubernetes (EKS / GKE)

If you decide to move from Docker Compose on EC2 to a fully scalable Kubernetes cluster, follow these steps:

### 1. Create a Namespace
```bash
kubectl create namespace ai-hospitality
```

### 2. Configure Secrets in Kubernetes
Create a generic secret for the API keys:
```bash
kubectl create secret generic ai-secrets \
  --namespace ai-hospitality \
  --from-literal=GROQ_API_KEY="your_groq_key" \
  --from-literal=DEAPI_API_KEY="your_deapi_key"
```

Create a docker-registry secret to pull images from GitHub Container Registry:
```bash
kubectl create secret docker-registry ghcr-login-secret \
  --namespace ai-hospitality \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GHCR_PAT \
  --docker-email=your_email@example.com
```

### 3. Apply the Manifests
```bash
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/frontend-deployment.yaml
kubectl apply -f deployment/kubernetes/services.yaml
```

### 4. Verify the Deployment
```bash
kubectl get pods -n ai-hospitality
kubectl get services -n ai-hospitality
```

Wait until the `frontend-service` provisions an external LoadBalancer IP, then access the platform in your browser.
