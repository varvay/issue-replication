#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IssueReplicationStack } from '../lib/issue-replication-stack';
import { Tags } from 'aws-cdk-lib';

const app = new cdk.App();

const issueReplicationStack = new IssueReplicationStack(app, 'IssueReplicationStack', {});

Tags.of(issueReplicationStack).add('Environment', 'Test');