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
const command: Command = require('./list-contenttype-remove');

describe(commands.LIST_CONTENTTYPE_REMOVE, () => {
  const webUrl: string = 'https://contoso.sharepoint.com';
  const listId: string = 'dfddade1-4729-428d-881e-7fedf3cae50d';
  const listTitle: string = 'Documents';
  const contentTypeId: string = '0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A';

  let log: any[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;
  let promptOptions: any;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
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
    sinon.stub(Cli, 'prompt').callsFake(async (options: any) => {
      promptOptions = options;
      return { continue: false };
    });
  });

  afterEach(() => {
    sinonUtil.restore([
      request.post,
      Cli.prompt
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
    assert.strictEqual(command.name.startsWith(commands.LIST_CONTENTTYPE_REMOVE), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('prompts before removing content type from list when confirmation argument not passed (listId)', async () => {
    await command.action(logger, {
      options: {
        debug: false,
        listId: listId,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    let promptIssued = false;

    if (promptOptions && promptOptions.type === 'confirm') {
      promptIssued = true;
    }

    assert(promptIssued);
  });

  it('prompts before removing content type from list when confirmation argument not passed (listTitle)', async () => {
    await command.action(logger, {
      options: {
        debug: false,
        listTitle: listTitle,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    let promptIssued = false;

    if (promptOptions && promptOptions.type === 'confirm') {
      promptIssued = true;
    }

    assert(promptIssued);
  });

  it('aborts removing content type from list when prompt not confirmed', async () => {
    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: false }
    ));
    await command.action(logger, {
      options: {
        debug: false,
        listId: listId,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
  });

  it('removes content type from list when listId option is passed and prompt confirmed (debug)', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists(guid\'dfddade1-4729-428d-881e-7fedf3cae50d\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: true,
        listId: listId,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('removes content type from list when listTitle option is passed and prompt confirmed (debug)', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists/getByTitle(\'Documents\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: true,
        listTitle: listTitle,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('removes content type from list when listUrl option is passed and prompt confirmed (debug)', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/GetList(\'%2Fsites%2Fdocuments\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: true,
        listUrl: 'sites/documents',
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('removes content type from list when listUrl option is passed and prompt confirmed', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/GetList(\'%2Fsites%2Fdocuments\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        listUrl: 'sites/documents',
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('removes content type from list when listId option is passed and prompt confirmed', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists(guid\'dfddade1-4729-428d-881e-7fedf3cae50d\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: false,
        listId: listId,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('removes content type from list when listTitle option is passed and prompt confirmed', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists/getByTitle(\'Documents\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0) {
          return;
        }
      }

      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: false,
        listTitle: listTitle,
        webUrl: webUrl,
        contentTypeId: contentTypeId
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('command correctly handles list get reject request', async () => {
    const err = 'Invalid request';
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists/getByTitle(\'Documents\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        throw err;
      }

      throw 'Invalid request';
    });

    await assert.rejects(command.action(logger, {
      options: {
        debug: true,
        listTitle: listTitle,
        webUrl: webUrl,
        contentTypeId: contentTypeId,
        confirm: true
      }
    }), new CommandError(err));
  });

  it('uses correct API url when listTitle option is passed', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists/getByTitle(\'Documents\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: false,
        listTitle: listTitle,
        webUrl: webUrl,
        contentTypeId: contentTypeId,
        confirm: true
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('uses correct API url when listId option is passed', async () => {
    const postStub = sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/lists(guid\'dfddade1-4729-428d-881e-7fedf3cae50d\')/ContentTypes(\'0x010109010053EE7AEB1FC54A41B4D9F66ADBDC312A\')') {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: false,
        listId: listId,
        webUrl: webUrl,
        contentTypeId: contentTypeId,
        confirm: true
      }
    });
    assert(postStub.called);
    assert(loggerLogSpy.notCalled);
  });

  it('fails validation if neither listId nor listTitle nor listUrl are passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if all of the list properties are passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listTitle: 'Documents', listUrl: 'sites/documents', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both listId and listTitle options are not passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the webUrl option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the webUrl option is a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', contentTypeId: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the listId option is not a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '12345', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the listId option is a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', contentTypeId: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('passes validation if the listTitle option is passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listTitle: 'Documents', contentTypeId: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if both listId and listTitle options are passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listTitle: 'Documents', contentTypeId: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the contentTypeId option is not passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listTitle: 'Documents' } }, commandInfo);
    assert.notStrictEqual(actual, true);
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

  it('configures command types', () => {
    assert.notStrictEqual(typeof command.types, 'undefined', 'command types undefined');
    assert.notStrictEqual(command.types.string, 'undefined', 'command string types undefined');
  });
});