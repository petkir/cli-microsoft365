import * as assert from 'assert';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../../../Auth';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command, { CommandError } from '../../../../Command';
import config from '../../../../config';
import request from '../../../../request';
import { pid } from '../../../../utils/pid';
import { sinonUtil } from '../../../../utils/sinonUtil';
import { spo } from '../../../../utils/spo';
import commands from '../../commands';
const command: Command = require('./term-group-get');

describe(commands.TERM_GROUP_GET, () => {
  let log: string[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => {});
    sinon.stub(spo, 'getRequestDigest').callsFake(() => Promise.resolve({
      FormDigestValue: 'ABC',
      FormDigestTimeoutSeconds: 1800,
      FormDigestExpiresAt: new Date(),
      WebFullUrl: 'https://contoso.sharepoint.com'
    }));
    auth.service.connected = true;
    auth.service.spoUrl = 'https://contoso.sharepoint.com';
    commandInfo = Cli.getCommandInfo(command);
  });

  beforeEach(() => {
    log = [];
    logger = {
      log: (msg: string) => {
        log.push(msg);
      },
      logRaw: (msg: string) => {
        log.push(msg);
      },
      logToStderr: (msg: string) => {
        log.push(msg);
      }
    };
    loggerLogSpy = sinon.spy(logger, 'log');
  });

  afterEach(() => {
    sinonUtil.restore([
      request.post
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      spo.getRequestDigest,
      appInsights.trackEvent,
      pid.getProcessName
    ]);
    auth.service.connected = false;
    auth.service.spoUrl = undefined;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.TERM_GROUP_GET), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('gets taxonomy term group by id', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_vti_bin/client.svc/ProcessQuery') > -1 &&
        opts.headers &&
        opts.headers['X-RequestDigest'] &&
        opts.data === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="25" ObjectPathId="24" /><ObjectIdentityQuery Id="26" ObjectPathId="24" /><ObjectPath Id="28" ObjectPathId="27" /><ObjectIdentityQuery Id="29" ObjectPathId="27" /><ObjectPath Id="31" ObjectPathId="30" /><ObjectPath Id="33" ObjectPathId="32" /><ObjectIdentityQuery Id="34" ObjectPathId="32" /><Query Id="35" ObjectPathId="32"><Query SelectAllProperties="true"><Properties><Property Name="Name" ScalarProperty="true" /><Property Name="Id" ScalarProperty="true" /></Properties></Query></Query></Actions><ObjectPaths><StaticMethod Id="24" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" /><Method Id="27" ParentId="24" Name="GetDefaultSiteCollectionTermStore" /><Property Id="30" ParentId="27" Name="Groups" /><Method Id="32" ParentId="30" Name="GetById"><Parameters><Parameter Type="Guid">{36a62501-17ea-455a-bed4-eff862242def}</Parameter></Parameters></Method></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0",
            "LibraryVersion": "16.0.8105.1217",
            "ErrorInfo": null,
            "TraceCorrelationId": "aa58909e-60c1-0000-29c7-003b321d02d1"
          },
          25,
          {
            "IsNull": false
          },
          26,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:ss:"
          },
          28,
          {
            "IsNull": false
          },
          29,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:st:YU1+cBy9wUuh\u002ffzgFZGpUQ=="
          },
          31,
          {
            "IsNull": false
          },
          33,
          {
            "IsNull": false
          },
          34,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:gr:YU1+cBy9wUuh\u002ffzgFZGpUQElpjbqF1pFvtTv+GIkLe8="
          },
          35,
          {
            "_ObjectType_": "SP.Taxonomy.TermGroup",
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:gr:YU1+cBy9wUuh\u002ffzgFZGpUQElpjbqF1pFvtTv+GIkLe8=",
            "CreatedDate": "\/Date(1529479401033)\/",
            "Id": "\/Guid(36a62501-17ea-455a-bed4-eff862242def)\/",
            "LastModifiedDate": "\/Date(1529479401033)\/",
            "Name": "People",
            "Description": "",
            "IsSiteCollectionGroup": false,
            "IsSystemGroup": false
          }
        ]));
      }

      return Promise.reject('Invalid request');
    });
    await command.action(logger, { options: { debug: false, id: '36a62501-17ea-455a-bed4-eff862242def' } });
    assert(loggerLogSpy.calledWith({
      "CreatedDate": "2018-06-20T07:23:21.033Z",
      "Id": "36a62501-17ea-455a-bed4-eff862242def",
      "LastModifiedDate": "2018-06-20T07:23:21.033Z",
      "Name": "People",
      "Description": "",
      "IsSiteCollectionGroup": false,
      "IsSystemGroup": false
    }));
  });

  it('gets taxonomy term group by name', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_vti_bin/client.svc/ProcessQuery') > -1 &&
        opts.headers &&
        opts.headers['X-RequestDigest'] &&
        opts.data === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="25" ObjectPathId="24" /><ObjectIdentityQuery Id="26" ObjectPathId="24" /><ObjectPath Id="28" ObjectPathId="27" /><ObjectIdentityQuery Id="29" ObjectPathId="27" /><ObjectPath Id="31" ObjectPathId="30" /><ObjectPath Id="33" ObjectPathId="32" /><ObjectIdentityQuery Id="34" ObjectPathId="32" /><Query Id="35" ObjectPathId="32"><Query SelectAllProperties="true"><Properties><Property Name="Name" ScalarProperty="true" /><Property Name="Id" ScalarProperty="true" /></Properties></Query></Query></Actions><ObjectPaths><StaticMethod Id="24" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" /><Method Id="27" ParentId="24" Name="GetDefaultSiteCollectionTermStore" /><Property Id="30" ParentId="27" Name="Groups" /><Method Id="32" ParentId="30" Name="GetByName"><Parameters><Parameter Type="String">People</Parameter></Parameters></Method></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0",
            "LibraryVersion": "16.0.8105.1217",
            "ErrorInfo": null,
            "TraceCorrelationId": "aa58909e-60c1-0000-29c7-003b321d02d1"
          },
          25,
          {
            "IsNull": false
          },
          26,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:ss:"
          },
          28,
          {
            "IsNull": false
          },
          29,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:st:YU1+cBy9wUuh\u002ffzgFZGpUQ=="
          },
          31,
          {
            "IsNull": false
          },
          33,
          {
            "IsNull": false
          },
          34,
          {
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:gr:YU1+cBy9wUuh\u002ffzgFZGpUQElpjbqF1pFvtTv+GIkLe8="
          },
          35,
          {
            "_ObjectType_": "SP.Taxonomy.TermGroup",
            "_ObjectIdentity_": "aa58909e-60c1-0000-29c7-003b321d02d1|fec14c62-7c3b-481b-851b-c80d7802b224:gr:YU1+cBy9wUuh\u002ffzgFZGpUQElpjbqF1pFvtTv+GIkLe8=",
            "CreatedDate": "\/Date(1529479401033)\/",
            "Id": "\/Guid(36a62501-17ea-455a-bed4-eff862242def)\/",
            "LastModifiedDate": "\/Date(1529479401033)\/",
            "Name": "People",
            "Description": "",
            "IsSiteCollectionGroup": false,
            "IsSystemGroup": false
          }
        ]));
      }

      return Promise.reject('Invalid request');
    });
    await command.action(logger, { options: { debug: true, name: 'People' } });
    assert(loggerLogSpy.calledWith({
      "CreatedDate": "2018-06-20T07:23:21.033Z",
      "Id": "36a62501-17ea-455a-bed4-eff862242def",
      "LastModifiedDate": "2018-06-20T07:23:21.033Z",
      "Name": "People",
      "Description": "",
      "IsSiteCollectionGroup": false,
      "IsSystemGroup": false
    }));
  });

  it('correctly handles term group not found via id', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_vti_bin/client.svc/ProcessQuery') > -1 &&
        opts.headers &&
        opts.headers['X-RequestDigest'] &&
        opts.data === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="25" ObjectPathId="24" /><ObjectIdentityQuery Id="26" ObjectPathId="24" /><ObjectPath Id="28" ObjectPathId="27" /><ObjectIdentityQuery Id="29" ObjectPathId="27" /><ObjectPath Id="31" ObjectPathId="30" /><ObjectPath Id="33" ObjectPathId="32" /><ObjectIdentityQuery Id="34" ObjectPathId="32" /><Query Id="35" ObjectPathId="32"><Query SelectAllProperties="true"><Properties><Property Name="Name" ScalarProperty="true" /><Property Name="Id" ScalarProperty="true" /></Properties></Query></Query></Actions><ObjectPaths><StaticMethod Id="24" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" /><Method Id="27" ParentId="24" Name="GetDefaultSiteCollectionTermStore" /><Property Id="30" ParentId="27" Name="Groups" /><Method Id="32" ParentId="30" Name="GetById"><Parameters><Parameter Type="Guid">{36a62501-17ea-455a-bed4-eff862242def}</Parameter></Parameters></Method></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.8105.1217", "ErrorInfo": {
              "ErrorMessage": "Specified argument was out of the range of valid values.\r\nParameter name: index", "ErrorValue": null, "TraceCorrelationId": "3105909e-e037-0000-29c7-078ce31cbc78", "ErrorCode": -2146233086, "ErrorTypeName": "System.ArgumentOutOfRangeException"
            }, "TraceCorrelationId": "3105909e-e037-0000-29c7-078ce31cbc78"
          }
        ]));
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, { options: { 
      debug: false, 
      id: '36a62501-17ea-455a-bed4-eff862242def' } } as any), new CommandError('Specified argument was out of the range of valid values.\r\nParameter name: index'));
  });

  it('correctly handles term group not found via name', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_vti_bin/client.svc/ProcessQuery') > -1 &&
        opts.headers &&
        opts.headers['X-RequestDigest'] &&
        opts.data === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="25" ObjectPathId="24" /><ObjectIdentityQuery Id="26" ObjectPathId="24" /><ObjectPath Id="28" ObjectPathId="27" /><ObjectIdentityQuery Id="29" ObjectPathId="27" /><ObjectPath Id="31" ObjectPathId="30" /><ObjectPath Id="33" ObjectPathId="32" /><ObjectIdentityQuery Id="34" ObjectPathId="32" /><Query Id="35" ObjectPathId="32"><Query SelectAllProperties="true"><Properties><Property Name="Name" ScalarProperty="true" /><Property Name="Id" ScalarProperty="true" /></Properties></Query></Query></Actions><ObjectPaths><StaticMethod Id="24" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" /><Method Id="27" ParentId="24" Name="GetDefaultSiteCollectionTermStore" /><Property Id="30" ParentId="27" Name="Groups" /><Method Id="32" ParentId="30" Name="GetByName"><Parameters><Parameter Type="String">People</Parameter></Parameters></Method></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify([
          {
            "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.8105.1217", "ErrorInfo": {
              "ErrorMessage": "Specified argument was out of the range of valid values.\r\nParameter name: index", "ErrorValue": null, "TraceCorrelationId": "3105909e-e037-0000-29c7-078ce31cbc78", "ErrorCode": -2146233086, "ErrorTypeName": "System.ArgumentOutOfRangeException"
            }, "TraceCorrelationId": "3105909e-e037-0000-29c7-078ce31cbc78"
          }
        ]));
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, { options: { debug: false, name: 'People' } } as any), new CommandError('Specified argument was out of the range of valid values.\r\nParameter name: index'));
  });

  it('correctly handles error when retrieving taxonomy term groups', async () => {
    sinon.stub(request, 'post').callsFake(() => {
      return Promise.resolve(JSON.stringify([
        {
          "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.7018.1204", "ErrorInfo": {
            "ErrorMessage": "File Not Found.", "ErrorValue": null, "TraceCorrelationId": "9e54299e-208a-4000-8546-cc4139091b26", "ErrorCode": -2147024894, "ErrorTypeName": "System.IO.FileNotFoundException"
          }, "TraceCorrelationId": "9e54299e-208a-4000-8546-cc4139091b26"
        }
      ]));
    });
    
    await assert.rejects(command.action(logger, { options: { debug: false } } as any), new CommandError('File Not Found.'));
  });

  it('fails validation if neither id nor name specified', async () => {
    const actual = await command.validate({ options: {} }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both id and name specified', async () => {
    const actual = await command.validate({ options: { id: '9e54299e-208a-4000-8546-cc4139091b26', name: 'People' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if id is not a valid GUID', async () => {
    const actual = await command.validate({ options: { id: 'invalid' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation when id specified', async () => {
    const actual = await command.validate({ options: { id: '9e54299e-208a-4000-8546-cc4139091b26' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation when name specified', async () => {
    const actual = await command.validate({ options: { name: 'People' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('supports debug mode', () => {
    const options = command.options;
    let containsOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsOption = true;
      }
    });
    assert(containsOption);
  });

  it('handles promise rejection', async () => {
    sinonUtil.restore(spo.getRequestDigest);
    sinon.stub(spo, 'getRequestDigest').callsFake(() => Promise.reject('getRequestDigest error'));

    await assert.rejects(command.action(logger, { options: { debug: false, id: '36a62501-17ea-455a-bed4-eff862242def' } } as any), new CommandError('getRequestDigest error'));
  });
});