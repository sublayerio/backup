# Sublayer Backup

Does a mysqldump of a remote database and uploads the mysqldump with a timestamp to a S3 bucket.

## Usage 

```
docker run -e MYSQL_HOST=<MYSQL_HOST_HERE> \
 -e MYSQL_PORT=<MYSQL_PORT_HERE> \
 -e MYSQL_USER=<MYSQL_USER_HERE> \
 -e MYSQL_DATABASE=<MYSQL_DATABASE_HERE> \
 -e MYSQL_PASSWORD=<MYSQL_PASSWORD_HERE> \
 -e AWS_ACCESS_KEY=<AWS_ACCESS_KEY_HERE> \
 -e AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY_HERE> \
 -e AWS_BUCKET_NAME=<AWS_BUCKET_NAME_HERE> sublayer/backup:v1.0.2
```

## Environment variables

### MySQL

- MYSQL_HOST
- MYSQL_PORT
- MYSQL_USER
- MYSQL_DATABASE
- MYSQL_PASSWORD

### S3 Bucket

- AWS_ACCESS_KEY
- AWS_SECRET_ACCESS_KEY
- AWS_BUCKET_NAME

## GitHub Actions Automation Workflow example

```yaml
name: Backup

on:
  schedule:
    - cron: 6 3 * * *" # every morning at 03:06am

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - name: Backup
        id: vars
        run: |
            docker run -e MYSQL_HOST=<MYSQL_HOST_HERE> \
                -e MYSQL_PORT=<MYSQL_PORT_HERE> \
                -e MYSQL_USER=<MYSQL_USER_HERE> \
                -e MYSQL_DATABASE=<MYSQL_DATABASE_HERE> \
                -e MYSQL_PASSWORD=<MYSQL_PASSWORD_HERE> \
                -e AWS_ACCESS_KEY=<AWS_ACCESS_KEY_HERE> \
                -e AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY_HERE> \
                -e AWS_BUCKET_NAME=<AWS_BUCKET_NAME_HERE> sublayer/backup:v1.0.2   
```

## Kubernetes Cronjob example

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: backup-cronjob
spec:
  schedule: "6 3 * * *" # every morning at 03:06am
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: sublayer/backup:v1.0.2
              env:
                - name: MYSQL_HOST
                  value: <MYSQL_HOST_HERE>
                - name: MYSQL_PORT
                  value: <MYSQL_PORT_HERE>
                - name: MYSQL_USER
                  value: <MYSQL_USER_HERE>
                - name: MYSQL_DATABASE
                  value: <MYSQL_DATABASE_HERE>
                - name: MYSQL_PASSWORD
                  value: <MYSQL_PASSWORD_HERE>
                - name: AWS_ACCESS_KEY
                  value: <AWS_ACCESS_KEY_HERE>
                - name: AWS_SECRET_ACCESS_KEY
                  value: <AWS_SECRET_ACCESS_KEY_HERE>
                - name: AWS_BUCKET_NAME
                  value: <AWS_BUCKET_NAME_HERE>
          restartPolicy: Never
      backoffLimit: 2
```