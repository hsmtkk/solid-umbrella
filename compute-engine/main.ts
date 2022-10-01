import { Construct } from "constructs";
import { App, TerraformStack, CloudBackend, NamedCloudWorkspace, TerraformOutput } from "cdktf";
import * as google from '@cdktf/provider-google';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new google.GoogleProvider(this, 'Google', {
      project: 'lustrous-bit-361320',
    });

    const www1 = new google.ComputeInstance(this, 'www1', {
      machineType: 'e2-micro',
      name: 'www1',
      bootDisk: {
        initializeParams: {
          image: 'debian-cloud/debian-11',
        },
      },
      networkInterface: [
        {network: 'default'}
      ],
      zone: 'asia-northeast1-a',
    });

    new google.ComputeInstance(this, 'www2', {
      machineType: 'e2-micro',
      name: 'www2',
      bootDisk: {
        initializeParams: {
          image: 'debian-cloud/debian-11',
        },
      },
      networkInterface: [
        {network: 'default'}
      ],
      zone: 'us-central1-a',
    });

    const mynetwork1 = new google.ComputeNetwork(this, 'mynetwork1', {
      name: 'mynetwork1',
      autoCreateSubnetworks: true,
    });

    const www3_zone = 'europe-west1-b';

    const disk3 = new google.ComputeDisk(this, 'disk3', {
      name: 'disk3',
      size: 10,
      zone: www3_zone,
    });

    new google.ComputeInstance(this, 'www3', {
      machineType: 'e2-micro',
      name: 'www3',
      bootDisk: {
        initializeParams: {
          image: 'debian-cloud/debian-11',
        },
      },
      networkInterface: [
        {network: mynetwork1.name}
      ],
      zone: www3_zone,
      attachedDisk: [{
        source: disk3.name,
      }],
    });


    new TerraformOutput(this, 'www1_id', {
      value: www1.id,
    });
  }
}

const app = new App();
const stack = new MyStack(app, "solid-umbrella");
new CloudBackend(stack, {
  hostname: "app.terraform.io",
  organization: "hsmtkkdefault",
  workspaces: new NamedCloudWorkspace("solid-umbrella")
});
app.synth();
