---
id: deploy-hello-world-to-glueops
title: Deploy a "Hello World" Application
type: tutorial
---

# Deploy a "Hello World" Application

In this guide, we will walk you through the process of deploying a "Hello World" application onto the GlueOps platform. We'll start from scratch and cover each step in detail to ensure you have a smooth deployment experience.

## Create a New Repository and set up your application folder

1. Create a new repository for your application within your organization. 

2. Set up the necessary folders and files for your application. You can use the following folder structure:

```
demo-app-1
├── .github
│   └── workflows
├── README.md
└── index.html
```

## Set Up GitHub Actions for Docker Image Publishing

Now, let's configure GitHub Actions to automatically publish a Docker image of your application. This will allow the GlueOps platform to use the latest version of your app. As a happy path, we have provided this [Custom Action to push Docker images to GitHub Container Registry](https://github.com/marketplace/actions/build-docker-image-and-push-to-ghcr). Here's how you can set it up:

1. In your newly created repository, navigate to the `.github/workflows` folder.
2. Create a new file named `ghcr.yaml` in the `workflows` folder.
3. Copy and paste the following code into `ghcr.yaml`:

```yaml
name: GlueOps Action
 
on: [push]

jobs:
  build_tag_push_to_ghcr:
    runs-on: ubuntu-latest
    steps:
      - name: Build, Tag and Push Docker Image to GHCR
        uses: GlueOps/github-actions-build-push-containers@v0.1.2
```

:::info
GlueOps only supports container images published to the supported registry.
:::

## Configure GitHub Token as a Repository Secret

To enable GitHub Actions to notify our Argo CD of code changes, we need to configure a GitHub token as a repository secret. Here's how you can set it up:

1. Go to your repository and navigate to **Settings > Security > Secrets and Variables > Actions**.
<img width="422" alt="Screenshot 2023-07-28 at 02 47 16" src="https://github.com/GlueOps/glueops-dev/assets/39309699/f3468172-98cb-4b4f-a2fe-42e1006d772c"/>

2. Click on **New repository secret** to create a new token.

<img width="830" alt="Screenshot 2023-07-28 at 02 48 23" src="https://github.com/GlueOps/glueops-dev/assets/39309699/a4aca65d-483a-4b43-b55e-1a4080eb62e1"/>

3. To get your token secret, go to https://github.com/settings/tokens and click on **Generate new token**.

<img width="927" alt="Screenshot 2023-07-28 at 02 51 03" src="https://github.com/GlueOps/glueops-dev/assets/39309699/158bbb62-6710-4933-b076-1efb8d6bdc02"/>

4. Use the onscreen information to generate your token. The only scope required is the "repo" scope. Click on **Generate token** and copy your token.

<img width="869" alt="Screenshot 2023-07-28 at 02 55 12" src="https://github.com/GlueOps/glueops-dev/assets/39309699/a7bca229-ed48-4679-ba45-6a863977820c"/>

5. Add your secret name and place your copied token in the secret input field  and click **Add secret**. In our case we called our secret name `GH_TOKEN`

<img width="870" alt="Screenshot 2023-07-28 at 02 58 50" src="https://github.com/GlueOps/glueops-dev/assets/39309699/a356b1c6-6040-46f0-9b50-c57a2b606dc2"/>

## Configure GitHub Workflows for Each Environment

In the `.github/workflows` directory of your application repository, we will add GitHub Actions  workflow files for three environment: `prod-ci.yaml`, `stage-ci.yaml`, and `uat-ci.yaml`.
```
.
├── .github
│   └── workflows
│       ├── ghcr.yaml
│       ├── prod-ci.yaml
│       ├── stage-ci.yaml
│       └── uat-ci.yaml
├── Dockerfile
├── README.md
└── index.html
```

Each workflow file uses the `GlueOps/github-workflows/.github/workflows/argocd-tags-ci.yml` action to notify Argo CD about the new image tags and initiate the deployment process.


###  `prod-ci.yaml` Environment Sample Configuration:

In the `prod-ci.yaml` file add the following content:

```yaml
# .github/workflows/prod-ci.yaml

name: ArgoCD - Prod Tags CI

on:
  release:
    types:
      - created
jobs:
  update-tags:
    uses: GlueOps/github-workflows/.github/workflows/argocd-tags-ci.yml@main
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
    with:
      STACK_REPO: 'deployment-configurations'
      ENV: 'prod'
      CREATE_PR: true
```

###  `stage-ci.yaml` Environment Sample Configuration:

In the `stage-ci.yaml` file add the following content:

```yaml
# .github/workflows/stage-ci.yaml

name: ArgoCD - Staging Tags CI

on:
  pull_request:
    types:
      - closed
jobs:
  update-tags:
    uses: GlueOps/github-workflows/.github/workflows/argocd-tags-ci.yml@main
    if: github.event.pull_request.merged == true
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
    with:
      STACK_REPO: 'deployment-configurations'
      ENV: 'stage'
      CREATE_PR: false
```

###  `uat-ci.yaml` Environment Sample Configuration:

In the `uat-ci.yaml` file add the following content: 

```yaml
# .github/workflows/uat-ci.yaml

name: ArgoCD - QA Tags CI

on:
  release:
    types:
      - created
jobs:
  update-tags:
    uses: GlueOps/github-workflows/.github/workflows/argocd-tags-ci.yml@main
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
    with:
      STACK_REPO: 'deployment-configurations'
      ENV: 'uat'
      CREATE_PR: true
```

:::info
Replace `secrets.GH_TOKEN` with the correct secret name if you used a different name for the GitHub token secret.
:::

## Deploy the App and Register Environments

Next, let's deploy the app and register the specified environments (prod, stage, uat) inside the GlueOps Argo CD. Here's what you need to do:

1. Go to the [deployment-configurations](https://github.com/GlueOps/deployment-configurations) repository.
2. Inside the `app` directory, duplicate one of the example demo apps and rename it to your application's name.
3. Your application directory should have the following structure:

```
├── demo-app-1
├── base
│   └── base-values.yaml
├── envs
│   ├── previews
│   ├── prod
│   ├── stage
│   └── uat
```

4. In the `base-values.yaml` file inside the `base` directory, update the information to fit your application. For example, the `base-values.yaml` might look like this:

```yaml
image:
  registry: ghcr.io
  repository: venkata-tenant-test-1/demo-app-1
  port: 80
```

Replace `venkata-tenant-test-1/demo-app-1` with your organization and repository name.

5. Update the `values.yaml` file in the `prod`, `stage`, and `uat` folders accordingly. Change the image tag, hostnames, and other necessary details to match your application and GlueOps configuration.

###  `prod` Environment Sample Configuration:

Create a file named `values.yaml` in the `envs/prod` folder and add the following content:

```yaml
# envs/prod/values.yaml

image:
  tag: 'v0.2.0'

ingress:
  enabled: true
  ingressClassName: public
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
  tls:
    - secretName: demo-app-1-prod.yolo.venkatamutyala.com
      hosts:
        - demo-app-1-prod.yolo.venkatamutyala.com
  entries:
    - name: public
      hosts:
        - hostname: demo-app-1-prod.apps.test-80-np.venkata.onglueops.rocks
        - hostname: demo-app-1-prod.yolo.venkatamutyala.com
```

###  `stage` Environment Sample Configuration:

Create a file named `values.yaml` in the `envs/stage` folder and add the following content:

```yaml
# envs/stage/values.yaml

image:
  tag: 'latest'

ingress:
  enabled: true
  ingressClassName: public
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
  tls:
    - secretName: demo-app-1-stage.yolo.venkatamutyala.com
      hosts:
        - demo-app-1-stage.yolo.venkatamutyala.com
  entries:
    - name: public
      hosts:
        - hostname: demo-app-1-stage.apps.test-80-np.venkata.onglueops.rocks
        - hostname: demo-app-1-stage.yolo.venkatamutyala.com
```

### `uat` Environment Sample Configuration:

Create a file named `values.yaml` in the `envs/uat` folder and add the following content:

```yaml
# envs/uat/values.yaml

image:
  tag: 'v0.1.0'

ingress:
  enabled: true
  ingressClassName: public
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
  tls:
    - secretName: demo-app-1-uat.yolo.venkatamutyala.com
      hosts:
        - demo-app-1-uat.yolo.venkatamutyala.com
  entries:
    - name: public
      hosts:
        - hostname: demo-app-1-uat.apps.test-80-np.venkata.onglueops.rocks
        - hostname: demo-app-1-uat.yolo.venkatamutyala.com
```

:::important
Replace the placeholders as follows:
- Replace `demo-app-1` with your actual repository name.
- Replace `venkatamutyala.com` with your actual hosting name.
- Replace `test-80-np.venkata.onglueops.rocks` with the name of your GlueOps cluster provided by GlueOps.
:::

6. Save and commit your changes to the deployment repository.

## Add a Simple HTML "Hello World" Code

Go back to your application repository and edit the `index.html` file. Add a simple "Hello World" HTML code, like this:

```html
<html>
 <head>
 </head>
 <body>
   <h1>Hello World from demo-app-1<h1>
 </body>
</html>
```

Save the file and commit your changes.

## Trigger the GitHub Action for Docker Image Publishing

Create a pull request (PR) to trigger the GitHub Action you set up for publishing the Docker image based on the latest code changes. The platform will automatically spin up a new environment and deploy the application.

To view the app click on the preview URL. You can check the status of the deployment on Argos CD, which will show metrics, logs, and more. The QR code will also lead you to the preview URL.

<img width="420" alt="Screenshot 2023-07-28 at 12 53 14" src="https://github.com/GlueOps/glueops-dev/assets/39309699/9661e169-6eee-4bec-a5ee-145751e40b6f"/>


## Deploying to Environments

### Check application deployed to your Staging Enviroment

The staging enviroment is automatically deployed, to check your application:

1. Navigate to the `envs/stage` directory within the [deployment-configurations](https://github.com/GlueOps/deployment-configurations) repository.

2. In the `values.yaml` file located in the `stage` folder, you will find the configuration for the staging environment. Check the `hostname` entry to check your application deployed to the staging environment.

### Deploying to `prod` and `uat` Environments

1. To deploy your application to the prod and UAT environments, you need to create a release in your application's repository (e.g., v0.1.0, v1.0.0, etc.). This release will mark the specific version of your application that you want to deploy to these environments.

2. Upon creating the release, GitHub will automatically generate pull requests into the deployment-configurations repository. These pull requests will contain the necessary changes for the prod and UAT environments, located in the `envs/prod` and `envs/uat` directories, respectively.

<img width="362" alt="Screenshot 2023-07-28 at 13 19 12" src="https://github.com/GlueOps/glueops-dev/assets/39309699/5bc936a8-adcd-40f4-bdc8-ff8b3290ce0d"/>

3. Review and merge the pull requests in the deployment-configurations repository. This will trigger the deployment process to both the `prod` and `uat` environments.

5. Once the deployment process is completed, your application will be accessible in both the `prod` and `uat` environments hostnames 

## Conclusion

Congratulations! You have successfully deployed a basic "Hello World" application onto the GlueOps platform. 