import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineCrossRegionStack } from './pipeline-cross-region-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new PipelineCrossRegionStack(this, 'PipelineCrossRegionStack', props)
  }
}
