import * as assert from 'assert';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../../../Auth';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command, { CommandError } from '../../../../Command';
import request from '../../../../request';
import { pid } from '../../../../utils/pid';
import { sinonUtil } from '../../../../utils/sinonUtil';
import commands from '../../commands';
const command: Command = require('./list-list');

describe(commands.LIST_LIST, () => {
  let log: any[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => {});
    auth.service.connected = true;
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
      request.get
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      appInsights.trackEvent,
      pid.getProcessName
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.LIST_LIST), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('defines correct properties for the default output', () => {
    assert.deepStrictEqual(command.defaultProperties(), ['Title', 'Url', 'Id']);
  });

  it('retrieves all lists', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web/lists') > -1) {
        return Promise.resolve(
          {"value":[{
            "AllowContentTypes": true,
            "BaseTemplate": 109,
            "BaseType": 1,
            "ContentTypesEnabled": false,
            "CrawlNonDefaultViews": false,
            "Created": null,
            "CurrentChangeToken": null,
            "CustomActionElements": null,
            "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
            "DefaultItemOpenUseListSetting": false,
            "Description": "",
            "Direction": "none",
            "DocumentTemplateUrl": null,
            "DraftVersionVisibility": 0,
            "EnableAttachments": false,
            "EnableFolderCreation": true,
            "EnableMinorVersions": false,
            "EnableModeration": false,
            "EnableVersioning": false,
            "EntityTypeName": "Documents",
            "ExemptFromBlockDownloadOfNonViewableFiles": false,
            "FileSavePostProcessingEnabled": false,
            "ForceCheckout": false,
            "HasExternalDataSource": false,
            "Hidden": false,
            "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
            "ImagePath": null,
            "ImageUrl": null,
            "IrmEnabled": false,
            "IrmExpire": false,
            "IrmReject": false,
            "IsApplicationList": false,
            "IsCatalog": false,
            "IsPrivate": false,
            "ItemCount": 69,
            "LastItemDeletedDate": null,
            "LastItemModifiedDate": null,
            "LastItemUserModifiedDate": null,
            "ListExperienceOptions": 0,
            "ListItemEntityTypeFullName": null,
            "MajorVersionLimit": 0,
            "MajorWithMinorVersionsLimit": 0,
            "MultipleDataList": false,
            "NoCrawl": false,
            "ParentWebPath": null,
            "ParentWebUrl": null,
            "ParserDisabled": false,
            "ServerTemplateCanCreateFolders": true,
            "TemplateFeatureId": null,
            "Title": "Documents",
            "RootFolder": {"ServerRelativeUrl":"Documents"}
          }]}
        );
      }
      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: {
      output: 'json',
      debug: true,
      webUrl: 'https://contoso.sharepoint.com'
    }});
    assert(loggerLogSpy.calledWith([{
      "AllowContentTypes": true,
      "BaseTemplate": 109,
      "BaseType": 1,
      "ContentTypesEnabled": false,
      "CrawlNonDefaultViews": false,
      "Created": null,
      "CurrentChangeToken": null,
      "CustomActionElements": null,
      "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
      "DefaultItemOpenUseListSetting": false,
      "Description": "",
      "Direction": "none",
      "DocumentTemplateUrl": null,
      "DraftVersionVisibility": 0,
      "EnableAttachments": false,
      "EnableFolderCreation": true,
      "EnableMinorVersions": false,
      "EnableModeration": false,
      "EnableVersioning": false,
      "EntityTypeName": "Documents",
      "ExemptFromBlockDownloadOfNonViewableFiles": false,
      "FileSavePostProcessingEnabled": false,
      "ForceCheckout": false,
      "HasExternalDataSource": false,
      "Hidden": false,
      "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
      "ImagePath": null,
      "ImageUrl": null,
      "IrmEnabled": false,
      "IrmExpire": false,
      "IrmReject": false,
      "IsApplicationList": false,
      "IsCatalog": false,
      "IsPrivate": false,
      "ItemCount": 69,
      "LastItemDeletedDate": null,
      "LastItemModifiedDate": null,
      "LastItemUserModifiedDate": null,
      "ListExperienceOptions": 0,
      "ListItemEntityTypeFullName": null,
      "MajorVersionLimit": 0,
      "MajorWithMinorVersionsLimit": 0,
      "MultipleDataList": false,
      "NoCrawl": false,
      "ParentWebPath": null,
      "ParentWebUrl": null,
      "ParserDisabled": false,
      "ServerTemplateCanCreateFolders": true,
      "TemplateFeatureId": null,
      "Title": "Documents",
      "RootFolder": {"ServerRelativeUrl":"Documents"},
      Url: "Documents"
    }]));
  });

  it('retrieves all lists (with limited permissions)', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web/lists') > -1) {
        return Promise.resolve(
          {"value":[{
            "AllowContentTypes": true,
            "BaseTemplate": 109,
            "BaseType": 1,
            "ContentTypesEnabled": false,
            "CrawlNonDefaultViews": false,
            "Created": null,
            "CurrentChangeToken": null,
            "CustomActionElements": null,
            "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
            "DefaultItemOpenUseListSetting": false,
            "Description": "",
            "Direction": "none",
            "DocumentTemplateUrl": null,
            "DraftVersionVisibility": 0,
            "EnableAttachments": false,
            "EnableFolderCreation": true,
            "EnableMinorVersions": false,
            "EnableModeration": false,
            "EnableVersioning": false,
            "EntityTypeName": "Documents",
            "ExemptFromBlockDownloadOfNonViewableFiles": false,
            "FileSavePostProcessingEnabled": false,
            "ForceCheckout": false,
            "HasExternalDataSource": false,
            "Hidden": false,
            "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
            "ImagePath": null,
            "ImageUrl": null,
            "IrmEnabled": false,
            "IrmExpire": false,
            "IrmReject": false,
            "IsApplicationList": false,
            "IsCatalog": false,
            "IsPrivate": false,
            "ItemCount": 69,
            "LastItemDeletedDate": null,
            "LastItemModifiedDate": null,
            "LastItemUserModifiedDate": null,
            "ListExperienceOptions": 0,
            "ListItemEntityTypeFullName": null,
            "MajorVersionLimit": 0,
            "MajorWithMinorVersionsLimit": 0,
            "MultipleDataList": false,
            "NoCrawl": false,
            "ParentWebPath": null,
            "ParentWebUrl": null,
            "ParserDisabled": false,
            "ServerTemplateCanCreateFolders": true,
            "TemplateFeatureId": null,
            "Title": "Documents",
            "RootFolder": {"ServerRelativeUrl":"Documents"}
          }]}
        );
      }
      return Promise.reject('Invalid request');
    });

    await command.action(logger, { options: {
      output: 'json',
      debug: true,
      webUrl: 'https://contoso.sharepoint.com',
      executeWithLimitedPermissions: true
    } });
    assert(loggerLogSpy.calledWith([{
      "AllowContentTypes": true,
      "BaseTemplate": 109,
      "BaseType": 1,
      "ContentTypesEnabled": false,
      "CrawlNonDefaultViews": false,
      "Created": null,
      "CurrentChangeToken": null,
      "CustomActionElements": null,
      "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
      "DefaultItemOpenUseListSetting": false,
      "Description": "",
      "Direction": "none",
      "DocumentTemplateUrl": null,
      "DraftVersionVisibility": 0,
      "EnableAttachments": false,
      "EnableFolderCreation": true,
      "EnableMinorVersions": false,
      "EnableModeration": false,
      "EnableVersioning": false,
      "EntityTypeName": "Documents",
      "ExemptFromBlockDownloadOfNonViewableFiles": false,
      "FileSavePostProcessingEnabled": false,
      "ForceCheckout": false,
      "HasExternalDataSource": false,
      "Hidden": false,
      "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
      "ImagePath": null,
      "ImageUrl": null,
      "IrmEnabled": false,
      "IrmExpire": false,
      "IrmReject": false,
      "IsApplicationList": false,
      "IsCatalog": false,
      "IsPrivate": false,
      "ItemCount": 69,
      "LastItemDeletedDate": null,
      "LastItemModifiedDate": null,
      "LastItemUserModifiedDate": null,
      "ListExperienceOptions": 0,
      "ListItemEntityTypeFullName": null,
      "MajorVersionLimit": 0,
      "MajorWithMinorVersionsLimit": 0,
      "MultipleDataList": false,
      "NoCrawl": false,
      "ParentWebPath": null,
      "ParentWebUrl": null,
      "ParserDisabled": false,
      "ServerTemplateCanCreateFolders": true,
      "TemplateFeatureId": null,
      "Title": "Documents",
      "RootFolder": {"ServerRelativeUrl":"Documents"},
      Url: "Documents"
    }]));
  });

  it('command correctly handles list list reject request', async () => {
    const err = 'Invalid request';
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web/lists') > -1) {
        return Promise.reject(err);
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, {
      options: {
        debug: true,
        webUrl: 'https://contoso.sharepoint.com'
      }
    }), new CommandError(err));
  });

  it('uses correct API url when output json option is passed', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      logger.log('Test Url:');
      logger.log(opts.url);
      if ((opts.url as string).indexOf('select123=') > -1) {
        return Promise.resolve('Correct Url1');
      }
      
      if ((opts.url as string).indexOf('/_api/web/lists') > -1) {
        return Promise.resolve(
          {"value":[{
            "AllowContentTypes": true,
            "BaseTemplate": 109,
            "BaseType": 1,
            "ContentTypesEnabled": false,
            "CrawlNonDefaultViews": false,
            "Created": null,
            "CurrentChangeToken": null,
            "CustomActionElements": null,
            "DefaultContentApprovalWorkflowId": "00000000-0000-0000-0000-000000000000",
            "DefaultItemOpenUseListSetting": false,
            "Description": "",
            "Direction": "none",
            "DocumentTemplateUrl": null,
            "DraftVersionVisibility": 0,
            "EnableAttachments": false,
            "EnableFolderCreation": true,
            "EnableMinorVersions": false,
            "EnableModeration": false,
            "EnableVersioning": false,
            "EntityTypeName": "Documents",
            "ExemptFromBlockDownloadOfNonViewableFiles": false,
            "FileSavePostProcessingEnabled": false,
            "ForceCheckout": false,
            "HasExternalDataSource": false,
            "Hidden": false,
            "Id": "14b2b6ed-0885-4814-bfd6-594737cc3ae3",
            "ImagePath": null,
            "ImageUrl": null,
            "IrmEnabled": false,
            "IrmExpire": false,
            "IrmReject": false,
            "IsApplicationList": false,
            "IsCatalog": false,
            "IsPrivate": false,
            "ItemCount": 69,
            "LastItemDeletedDate": null,
            "LastItemModifiedDate": null,
            "LastItemUserModifiedDate": null,
            "ListExperienceOptions": 0,
            "ListItemEntityTypeFullName": null,
            "MajorVersionLimit": 0,
            "MajorWithMinorVersionsLimit": 0,
            "MultipleDataList": false,
            "NoCrawl": false,
            "ParentWebPath": null,
            "ParentWebUrl": null,
            "ParserDisabled": false,
            "ServerTemplateCanCreateFolders": true,
            "TemplateFeatureId": null,
            "Title": "Documents",
            "RootFolder": {"ServerRelativeUrl":"Documents"}
          }]}
        );
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        output: 'json',
        debug: false,
        webUrl: 'https://contoso.sharepoint.com'
      }
    });
  });

  it('supports debug mode', () => {
    const options = command.options;
    let containsDebugOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsDebugOption = true;
      }
    });
    assert(containsDebugOption);
  });

  it('supports specifying URL', () => {
    const options = command.options;
    let containsTypeOption = false;
    options.forEach(o => {
      if (o.option.indexOf('<webUrl>') > -1) {
        containsTypeOption = true;
      }
    });
    assert(containsTypeOption);
  });

  it('fails validation if the url option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the url option is a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com' } }, commandInfo);
    assert(actual);
  });
});