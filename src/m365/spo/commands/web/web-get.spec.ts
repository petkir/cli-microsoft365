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
const command: Command = require('./web-get');

describe(commands.WEB_GET, () => {
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
    assert.strictEqual(command.name.startsWith(commands.WEB_GET), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('retrieves site information', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web') > -1) {
        return Promise.resolve(
          {
            "value": [{
              "AllowRssFeeds": false,
              "AlternateCssUrl": null,
              "AppInstanceId": "00000000-0000-0000-0000-000000000000",
              "Configuration": 0,
              "Created": null,
              "CurrentChangeToken": null,
              "CustomMasterUrl": null,
              "Description": null,
              "DesignPackageId": null,
              "DocumentLibraryCalloutOfficeWebAppPreviewersDisabled": false,
              "EnableMinimalDownload": false,
              "HorizontalQuickLaunch": false,
              "Id": "d8d179c7-f459-4f90-b592-14b08e84accb",
              "IsMultilingual": false,
              "Language": 1033,
              "LastItemModifiedDate": null,
              "LastItemUserModifiedDate": null,
              "MasterUrl": null,
              "NoCrawl": false,
              "OverwriteTranslationsOnChange": false,
              "ResourcePath": null,
              "QuickLaunchEnabled": false,
              "RecycleBinEnabled": false,
              "ServerRelativeUrl": null,
              "SiteLogoUrl": null,
              "SyndicationEnabled": false,
              "Title": "Subsite",
              "TreeViewEnabled": false,
              "UIVersion": 15,
              "UIVersionConfigurationEnabled": false,
              "Url": "https://contoso.sharepoint.com/subsite",
              "WebTemplate": "STS"
            }]
          }
        );
      }
      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        output: 'json',
        debug: true,
        webUrl: 'https://contoso.sharepoint.com'
      }
    });

    assert(loggerLogSpy.calledWith({
      value: [{
        AllowRssFeeds: false,
        AlternateCssUrl: null,
        AppInstanceId: "00000000-0000-0000-0000-000000000000",
        Configuration: 0,
        Created: null,
        CurrentChangeToken: null,
        CustomMasterUrl: null,
        Description: null,
        DesignPackageId: null,
        DocumentLibraryCalloutOfficeWebAppPreviewersDisabled: false,
        EnableMinimalDownload: false,
        HorizontalQuickLaunch: false,
        Id: "d8d179c7-f459-4f90-b592-14b08e84accb",
        IsMultilingual: false,
        Language: 1033,
        LastItemModifiedDate: null,
        LastItemUserModifiedDate: null,
        MasterUrl: null,
        NoCrawl: false,
        OverwriteTranslationsOnChange: false,
        ResourcePath: null,
        QuickLaunchEnabled: false,
        RecycleBinEnabled: false,
        ServerRelativeUrl: null,
        SiteLogoUrl: null,
        SyndicationEnabled: false,
        Title: "Subsite",
        TreeViewEnabled: false,
        UIVersion: 15,
        UIVersionConfigurationEnabled: false,
        Url: "https://contoso.sharepoint.com/subsite",
        WebTemplate: "STS"
      }]
    }));
  });

  it('retrieves site information - With Associated Groups', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web') > -1) {
        return Promise.resolve(
          {
            "value": [{
              "AssociatedMemberGroup": {
                "Id": 5,
                "IsHiddenInUI": false,
                "LoginName": "Contoso Members",
                "Title": "Contoso Members",
                "PrincipalType": 8,
                "AllowMembersEditMembership": true,
                "AllowRequestToJoinLeave": false,
                "AutoAcceptRequestToJoinLeave": false,
                "Description": null,
                "OnlyAllowMembersViewMembership": false,
                "OwnerTitle": "Contoso Owners",
                "RequestToJoinLeaveEmailSetting": ""
              },
              "AssociatedOwnerGroup": {
                "Id": 3,
                "IsHiddenInUI": false,
                "LoginName": "Contoso Owners",
                "Title": "Contoso Owners",
                "PrincipalType": 8,
                "AllowMembersEditMembership": false,
                "AllowRequestToJoinLeave": false,
                "AutoAcceptRequestToJoinLeave": false,
                "Description": null,
                "OnlyAllowMembersViewMembership": false,
                "OwnerTitle": "Contoso Owners",
                "RequestToJoinLeaveEmailSetting": ""
              },
              "AssociatedVisitorGroup": {
                "Id": 4,
                "IsHiddenInUI": false,
                "LoginName": "Contoso Visitors",
                "Title": "Contoso Visitors",
                "PrincipalType": 8,
                "AllowMembersEditMembership": false,
                "AllowRequestToJoinLeave": false,
                "AutoAcceptRequestToJoinLeave": false,
                "Description": null,
                "OnlyAllowMembersViewMembership": false,
                "OwnerTitle": "Contoso Owners",
                "RequestToJoinLeaveEmailSetting": ""
              },
              "AllowRssFeeds": false,
              "AlternateCssUrl": null,
              "AppInstanceId": "00000000-0000-0000-0000-000000000000",
              "Configuration": 0,
              "Created": null,
              "CurrentChangeToken": null,
              "CustomMasterUrl": null,
              "Description": null,
              "DesignPackageId": null,
              "DocumentLibraryCalloutOfficeWebAppPreviewersDisabled": false,
              "EnableMinimalDownload": false,
              "HorizontalQuickLaunch": false,
              "Id": "d8d179c7-f459-4f90-b592-14b08e84accb",
              "IsMultilingual": false,
              "Language": 1033,
              "LastItemModifiedDate": null,
              "LastItemUserModifiedDate": null,
              "MasterUrl": null,
              "NoCrawl": false,
              "OverwriteTranslationsOnChange": false,
              "ResourcePath": null,
              "QuickLaunchEnabled": false,
              "RecycleBinEnabled": false,
              "ServerRelativeUrl": null,
              "SiteLogoUrl": null,
              "SyndicationEnabled": false,
              "Title": "Subsite",
              "TreeViewEnabled": false,
              "UIVersion": 15,
              "UIVersionConfigurationEnabled": false,
              "Url": "https://contoso.sharepoint.com/subsite",
              "WebTemplate": "STS"
            }]
          }
        );
      }
      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        output: 'json',
        debug: true,
        webUrl: 'https://contoso.sharepoint.com',
        withGroups: true
      }
    });
    assert(loggerLogSpy.calledWith({
      value: [{
        AssociatedMemberGroup: {
          Id: 5,
          IsHiddenInUI: false,
          LoginName: "Contoso Members",
          Title: "Contoso Members",
          PrincipalType: 8,
          AllowMembersEditMembership: true,
          AllowRequestToJoinLeave: false,
          AutoAcceptRequestToJoinLeave: false,
          Description: null,
          OnlyAllowMembersViewMembership: false,
          OwnerTitle: "Contoso Owners",
          RequestToJoinLeaveEmailSetting: ""
        },
        AssociatedOwnerGroup: {
          Id: 3,
          IsHiddenInUI: false,
          LoginName: "Contoso Owners",
          Title: "Contoso Owners",
          PrincipalType: 8,
          AllowMembersEditMembership: false,
          AllowRequestToJoinLeave: false,
          AutoAcceptRequestToJoinLeave: false,
          Description: null,
          OnlyAllowMembersViewMembership: false,
          OwnerTitle: "Contoso Owners",
          RequestToJoinLeaveEmailSetting: ""
        },
        AssociatedVisitorGroup: {
          Id: 4,
          IsHiddenInUI: false,
          LoginName: "Contoso Visitors",
          Title: "Contoso Visitors",
          PrincipalType: 8,
          AllowMembersEditMembership: false,
          AllowRequestToJoinLeave: false,
          AutoAcceptRequestToJoinLeave: false,
          Description: null,
          OnlyAllowMembersViewMembership: false,
          OwnerTitle: "Contoso Owners",
          RequestToJoinLeaveEmailSetting: ""
        },
        AllowRssFeeds: false,
        AlternateCssUrl: null,
        AppInstanceId: "00000000-0000-0000-0000-000000000000",
        Configuration: 0,
        Created: null,
        CurrentChangeToken: null,
        CustomMasterUrl: null,
        Description: null,
        DesignPackageId: null,
        DocumentLibraryCalloutOfficeWebAppPreviewersDisabled: false,
        EnableMinimalDownload: false,
        HorizontalQuickLaunch: false,
        Id: "d8d179c7-f459-4f90-b592-14b08e84accb",
        IsMultilingual: false,
        Language: 1033,
        LastItemModifiedDate: null,
        LastItemUserModifiedDate: null,
        MasterUrl: null,
        NoCrawl: false,
        OverwriteTranslationsOnChange: false,
        ResourcePath: null,
        QuickLaunchEnabled: false,
        RecycleBinEnabled: false,
        ServerRelativeUrl: null,
        SiteLogoUrl: null,
        SyndicationEnabled: false,
        Title: "Subsite",
        TreeViewEnabled: false,
        UIVersion: 15,
        UIVersionConfigurationEnabled: false,
        Url: "https://contoso.sharepoint.com/subsite",
        WebTemplate: "STS"
      }]
    }));
  });

  it('retrieves all site information with output option text', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web') > -1) {
        return Promise.resolve(
          {
            "value": [{
              "AllowRssFeeds": false,
              "AlternateCssUrl": null,
              "AppInstanceId": "00000000-0000-0000-0000-000000000000",
              "Configuration": 0,
              "Created": null,
              "CurrentChangeToken": null,
              "CustomMasterUrl": null,
              "Description": null,
              "DesignPackageId": null,
              "DocumentLibraryCalloutOfficeWebAppPreviewersDisabled": false,
              "EnableMinimalDownload": false,
              "HorizontalQuickLaunch": false,
              "Id": "d8d179c7-f459-4f90-b592-14b08e84accb",
              "IsMultilingual": false,
              "Language": 1033,
              "LastItemModifiedDate": null,
              "LastItemUserModifiedDate": null,
              "MasterUrl": null,
              "NoCrawl": false,
              "OverwriteTranslationsOnChange": false,
              "ResourcePath": null,
              "QuickLaunchEnabled": false,
              "RecycleBinEnabled": false,
              "ServerRelativeUrl": null,
              "SiteLogoUrl": null,
              "SyndicationEnabled": false,
              "Title": "Subsite",
              "TreeViewEnabled": false,
              "UIVersion": 15,
              "UIVersionConfigurationEnabled": false,
              "Url": "https://contoso.sharepoint.com/subsite",
              "WebTemplate": "STS"
            }]
          }
        );
      }
      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        output: 'text',
        debug: false,
        webUrl: 'https://contoso.sharepoint.com'
      }
    });
    assert(loggerLogSpy.calledWith({
      value: [{
        AllowRssFeeds: false,
        AlternateCssUrl: null,
        AppInstanceId: "00000000-0000-0000-0000-000000000000",
        Configuration: 0,
        Created: null,
        CurrentChangeToken: null,
        CustomMasterUrl: null,
        Description: null,
        DesignPackageId: null,
        DocumentLibraryCalloutOfficeWebAppPreviewersDisabled: false,
        EnableMinimalDownload: false,
        HorizontalQuickLaunch: false,
        Id: "d8d179c7-f459-4f90-b592-14b08e84accb",
        IsMultilingual: false,
        Language: 1033,
        LastItemModifiedDate: null,
        LastItemUserModifiedDate: null,
        MasterUrl: null,
        NoCrawl: false,
        OverwriteTranslationsOnChange: false,
        ResourcePath: null,
        QuickLaunchEnabled: false,
        RecycleBinEnabled: false,
        ServerRelativeUrl: null,
        SiteLogoUrl: null,
        SyndicationEnabled: false,
        Title: "Subsite",
        TreeViewEnabled: false,
        UIVersion: 15,
        UIVersionConfigurationEnabled: false,
        Url: "https://contoso.sharepoint.com/subsite",
        WebTemplate: "STS"
      }]
    }));
  });

  it('command correctly handles web get reject request', async () => {
    const err = 'Invalid request';
    sinon.stub(request, 'get').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web/webs') > -1) {
        return Promise.reject(err);
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, { options: {
      debug: true,
      webUrl: 'https://contoso.sharepoint.com' } } as any), new CommandError(err));
  });

  it('uses correct API url when output json option is passed', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      logger.log('Test Url:');
      logger.log(opts.url);
      if (opts.url === 'https://contoso.sharepoint.com/_api/web') {
        return Promise.resolve('Correct Url1');
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
    assert('Correct Url');
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
    assert.strictEqual(actual, true);
  });
}); 