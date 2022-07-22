import { CfnOutput, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { AccessKey, AccessKeyStatus, AccountRootPrincipal, Effect, ManagedPolicy, PolicyDocument, PolicyStatement, Role, User } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IssueReplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //define administrator role
    const administratorRole = new Role(this, 'AdministratorRole', {
      roleName: 'AdministratorRole',
      description: `Allow user to have AdministratorAccess permission`,
      assumedBy: new AccountRootPrincipal(),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    //define IAM view and update access keys role
    const viewAndUpdateAccessKeysManagedPolicy = new ManagedPolicy(this, 'ViewAndUpdateAccessKeysManagedPolicy', {
      managedPolicyName: 'ViewAndUpdateAccessKeys',
      description: 'Allows users to change access keys',
      document: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: [
              'iam:UpdateAccessKey',
              'iam:CreateAccessKey',
              'iam:ListAccessKeys',
            ],
            effect: Effect.ALLOW,
            resources: [
              `*`,
            ],
          }),
        ],
      }),
    });

    //define user
    const iamUser = new User(this, 'IAMUser', {
      userName: 'tester01',
      password: SecretValue.unsafePlainText('P4ssword'),
      managedPolicies: [
        viewAndUpdateAccessKeysManagedPolicy,
        new ManagedPolicy(this, 'AssumeAdministratorRoleManagedPolicy', {
          managedPolicyName: 'AssumeAdministratorRole',
          description: 'Allow user to assume administrator role',
          document: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: [
                  'sts:AssumeRole',
                ],
                effect: Effect.ALLOW,
                resources: [
                  administratorRole.roleArn,
                ],
              }),
            ],
          }),
        }),
      ],
    });

    //generate access key
    const accessKey = new AccessKey(this, 'IAMUsertester01AccessKey', {
      user: iamUser,
      status: AccessKeyStatus.ACTIVE,
    });

    //outputs
    new CfnOutput(this, 'AdministratorRoleARNOutput', {
      description: 'AdministratorRole ARN',
      value: administratorRole.roleArn,
    });

    new CfnOutput(this, 'IAMUsertester01AccessKeyIdOutput', {
      description: 'tester01 Access Key',
      value: accessKey.accessKeyId,
    });

    new CfnOutput(this, 'IAMUsertester01SecretAccessKeyOutput', {
      description: 'tester01 Secret Access Key',
      value: accessKey.secretAccessKey.unsafeUnwrap(),
    });

  }
}
