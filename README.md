# Welcome to CDK TypeScript project
This cdk app created to replicate the issue of cdk inability to assume the cdk bootstrapped role i.e. `cdk-<random string>-deploy-role-<account ID>-<region>`, `cdk-<random string>-lookup-role-<account ID>-<region>`

To replicate the issue, you can bootstrap the cdk first and then deploy the `IssueReplicationStack` stack that provisions:
* IAM Role
  * role name: AdministratorRole
  * assumed by: account root principal
  * policy: AWS managed policy of `AdministratorAccess`
* IAM User
  * username: tester01
  * password: P4ssword
  * policy: `sts:AssumeRole` on `AdministratorRole` role


You can deploy the cdk app and replicate the issue using `replicate.sh` script provided, you can make some adjustments as needed like change the AWS region, add additional options on `cdk` command, etc.

As comparison I've created `workaround.sh` script that assume the `AdministratorRole` using AWS CLI and execute the cdk command which is works