#!/bin/bash
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN

cdk deploy --outputs-file outputs.json

tester01AccessKeyId=`jq -r '.IssueReplicationStack''.IAMUsertester01AccessKeyIdOutput' outputs.json`
tester01SecretAccessKey=`jq -r '.IssueReplicationStack''.IAMUsertester01SecretAccessKeyOutput' outputs.json`
administratorRoleARNOutput=`jq -r '.IssueReplicationStack''.AdministratorRoleARNOutput' outputs.json`

aws configure set profile.tester01.aws_access_key_id $tester01AccessKeyId
aws configure set profile.tester01.aws_secret_access_key $tester01SecretAccessKey
aws configure set profile.tester01.region us-east-1

AWS_CREDENTIAL=$(aws sts assume-role --profile tester01 --role-arn $administratorRoleARNOutput --role-session-name administratorRoleTester01 --duration-seconds 3600)

export AWS_ACCESS_KEY_ID=$(echo $AWS_CREDENTIAL | jq -r '.Credentials''.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $AWS_CREDENTIAL | jq -r '.Credentials''.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $AWS_CREDENTIAL | jq -r '.Credentials''.SessionToken')

cdk diff

unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN