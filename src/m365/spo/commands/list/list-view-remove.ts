import { Cli } from '../../../../cli/Cli';
import { Logger } from '../../../../cli/Logger';
import GlobalOptions from '../../../../GlobalOptions';
import request from '../../../../request';
import { formatting } from '../../../../utils/formatting';
import { validation } from '../../../../utils/validation';
import SpoCommand from '../../../base/SpoCommand';
import commands from '../../commands';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  confirm?: boolean;
  listId?: string;
  listTitle?: string;
  viewId?: string;
  viewTitle?: string;
  webUrl: string;
}

class SpoListViewRemoveCommand extends SpoCommand {
  public get name(): string {
    return commands.LIST_VIEW_REMOVE;
  }

  public get description(): string {
    return 'Deletes the specified view from the list';
  }

  constructor() {
    super();

    this.#initTelemetry();
    this.#initOptions();
    this.#initValidators();
    this.#initOptionSets();
  }

  #initTelemetry(): void {
    this.telemetry.push((args: CommandArgs) => {
      Object.assign(this.telemetryProperties, {
        listId: typeof args.options.listId !== 'undefined',
        listTitle: typeof args.options.listTitle !== 'undefined',
        viewId: typeof args.options.viewId !== 'undefined',
        viewTitle: typeof args.options.viewTitle !== 'undefined',
        confirm: (!(!args.options.confirm)).toString()
      });
    });
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-u, --webUrl <webUrl>'
      },
      {
        option: '--listId [listId]'
      },
      {
        option: '--listTitle [listTitle]'
      },
      {
        option: '--viewId [viewId]'
      },
      {
        option: '--viewTitle [viewTitle]'
      },
      {
        option: '--confirm'
      }
    );
  }

  #initValidators(): void {
    this.validators.push(
      async (args: CommandArgs) => {
        const isValidSharePointUrl: boolean | string = validation.isValidSharePointUrl(args.options.webUrl);
        if (isValidSharePointUrl !== true) {
          return isValidSharePointUrl;
        }

        if (args.options.listId) {
          if (!validation.isValidGuid(args.options.listId)) {
            return `${args.options.listId} is not a valid GUID`;
          }
        }

        if (args.options.viewId) {
          if (!validation.isValidGuid(args.options.viewId)) {
            return `${args.options.viewId} is not a valid GUID`;
          }
        }

        return true;
      }
    );
  }

  #initOptionSets(): void {
    this.optionSets.push(
      ['listId', 'listTitle'],
      ['viewId', 'viewTitle']
    );
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    const removeViewFromList: () => Promise<void> = async (): Promise<void> => {
      if (this.verbose) {
        const list: string = (args.options.listId ? args.options.listId : args.options.listTitle) as string;
        logger.logToStderr(`Removing view ${args.options.viewId || args.options.viewTitle} from list ${list} in site at ${args.options.webUrl}...`);
      }

      let requestUrl: string = '';
      const listSelector: string = args.options.listId ? `(guid'${formatting.encodeQueryParameter(args.options.listId)}')` : `/GetByTitle('${formatting.encodeQueryParameter(args.options.listTitle as string)}')`;
      const viewSelector: string = args.options.viewId ? `(guid'${formatting.encodeQueryParameter(args.options.viewId)}')` : `/GetByTitle('${formatting.encodeQueryParameter(args.options.viewTitle as string)}')`;

      requestUrl = `${args.options.webUrl}/_api/web/lists${listSelector}/views${viewSelector}`;

      const requestOptions: any = {
        url: requestUrl,
        headers: {
          'X-HTTP-Method': 'DELETE',
          'If-Match': '*',
          'accept': 'application/json;odata=nometadata'
        },
        responseType: 'json'
      };

      try {
        await request.post(requestOptions);
        // REST post call doesn't return anything
      }
      catch(err: any) {
        this.handleRejectedODataJsonPromise(err);
      }
    };

    if (args.options.confirm) {
      await removeViewFromList();
    }
    else {
      const result = await Cli.prompt<{ continue: boolean }>({
        type: 'confirm',
        name: 'continue',
        default: false,
        message: `Are you sure you want to remove the view ${args.options.viewId || args.options.viewTitle} from the list ${args.options.listId || args.options.listTitle} in site ${args.options.webUrl}?`
      });

      if (result.continue) {
        await removeViewFromList();
      }
    }
  }
}

module.exports = new SpoListViewRemoveCommand();