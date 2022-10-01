import { Construct } from "constructs";
import { App, TerraformStack, CloudBackend, NamedCloudWorkspace } from "cdktf";
import * as google from '@cdktf/provider-google';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new google.GoogleProvider(this, 'Google', {
      project: 'lustrous-bit-361320',
    });

    const my_location = 'asia-northeast1-a';

    const cluster1 = new google.ContainerCluster(this, 'container_cluster', {
      name: 'cluster-1',
      location: my_location,
      initialNodeCount: 1,
      removeDefaultNodePool: true,
    });

    new google.ContainerNodePool(this, 'node_pool', {
      cluster: cluster1.name,
      nodeCount: 3,
      location: my_location,
      nodeConfig: {
        preemptible: true,
        machineType: 'e2-micro',
      },
    });
  }
}

const app = new App();
const stack = new MyStack(app, "kubernetes");
new CloudBackend(stack, {
  hostname: "app.terraform.io",
  organization: "hsmtkkdefault",
  workspaces: new NamedCloudWorkspace("kubernetes")
});
app.synth();
