import * as cdk from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction, StateMachineInput, StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PipelineCrossRegionStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const stateMachineArnFromAnotherRegion = cdk.Arn.format({
      service: 'states',
      resource: 'stateMachine',
      partition: cdk.ArnFormat.COLON_RESOURCE_NAME,
      resourceName: 'stateMachineFromAnotherRegion',
      region: 'eu-west-1'
    }, this)
    const stateMachine = StateMachine.fromStateMachineArn(this, 'StateMachine', stateMachineArnFromAnotherRegion)

    const pipeline = new Pipeline(this, "Pipeline", {
      crossAccountKeys: true,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new GitHubSourceAction({
              actionName: 'Github',
              owner: 'aws',
              repo: 'aws-cdk',
              branch: 'master',
              oauthToken: SecretValue.unsafePlainText('test'),
              output: new Artifact('Pipeline')
            })
          ]
        },
        {
          stageName: 'Test',
          actions: [
            new StepFunctionInvokeAction({
              actionName: 'Test',
              stateMachine: stateMachine,
              stateMachineInput: StateMachineInput.literal({})
            })
          ]
        }
      ]
    });
  }
}
