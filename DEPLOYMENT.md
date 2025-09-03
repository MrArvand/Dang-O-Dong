# Deployment Guide - Hostinger CI/CD Setup

This guide explains how to set up continuous deployment from GitHub to Hostinger for your React application.

## Prerequisites

- GitHub repository with your source code
- Hostinger hosting account
- SSH access enabled on Hostinger (if using SSH deployment)

## Setup Instructions

### 1. GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/hostinger-deploy.yml`) that:

1. Builds your React application using `npm run build`
2. Creates a `hostinger-deploy` branch with only the built files
3. This branch contains only the production-ready files from the `build/` directory

### 2. Hostinger Git Deployment Setup

1. **Log in to Hostinger hPanel**
2. **Navigate to Git section**
3. **Create a new repository connection:**
   - Repository URL: `https://github.com/MrArvand/Dang-O-Dong.git`
   - Branch: `hostinger-deploy` (not main!)
   - Install Path: Leave empty (deploys to `public_html`)

### 3. How It Works

1. **Development Workflow:**

   - You push changes to the `main` branch
   - GitHub Actions automatically builds the project
   - Built files are pushed to the `hostinger-deploy` branch
   - Hostinger detects changes and deploys from `hostinger-deploy` branch

2. **Deployment Process:**
   - Source files stay in `main` branch
   - Build folder remains in `.gitignore`
   - Only production files are deployed to Hostinger
   - Each push to main triggers a new deployment

### 4. Alternative: Direct SSH Deployment

If you prefer direct SSH deployment instead of Git deployment, you can use this alternative workflow:

```yaml
name: Deploy to Hostinger via SSH

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to Hostinger
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USERNAME }}
          password: ${{ secrets.HOSTINGER_PASSWORD }}
          port: ${{ secrets.HOSTINGER_PORT }}
          script: |
            cd public_html
            rm -rf *
            echo "Deployment completed"
```

### 5. Environment Variables (for SSH deployment)

If using SSH deployment, add these secrets to your GitHub repository:

- `HOSTINGER_HOST`: Your server hostname
- `HOSTINGER_USERNAME`: SSH username
- `HOSTINGER_PASSWORD`: SSH password
- `HOSTINGER_PORT`: SSH port (usually 22)

## Troubleshooting

### Common Issues:

1. **Deployment fails on Hostinger:**

   - Ensure the `public_html` directory is empty
   - Check that the branch name matches exactly (`hostinger-deploy`)
   - Verify repository URL is correct

2. **Build fails in GitHub Actions:**

   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Review build logs for specific errors

3. **Files not updating on website:**
   - Clear browser cache
   - Check Hostinger deployment logs
   - Verify webhook is properly configured

## Benefits of This Setup

- ✅ Source code stays clean in main branch
- ✅ Build artifacts are automatically generated
- ✅ No manual deployment steps required
- ✅ Rollback capability through Git history
- ✅ Separate deployment branch for production files
- ✅ Automatic deployment on every push to main

## Next Steps

1. Push this workflow to your repository
2. Configure Hostinger Git deployment with the `hostinger-deploy` branch
3. Test by making a small change and pushing to main
4. Monitor the deployment process in both GitHub Actions and Hostinger
