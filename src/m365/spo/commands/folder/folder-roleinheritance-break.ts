import { Cli } from '../../../../cli/Cli';
import { Logger } from '../../../../cli/Logger';
import { AxiosRequestConfig } from 'axios';
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
  webUrl: string;
  folderUrl: string;
  clearExistingPermissions?: boolean;
  confirm?: boolean;
}

class SpoFolderRoleInheritanceBreakCommand extends SpoCommand {
  public get name(): string {
    return commands.FOLDER_ROLEINHERITANCE_BREAK;
  }

  public get description(): string {
    return 'Breaks the role inheritance of a folder. Keeping existing permissions is the default behavior.';
  }

  constructor() {
    super();

    this.#initTelemetry();
    this.#initOptions();
    this.#initValidators();
  }

  #initTelemetry(): void {
    this.telemetry.push((args: CommandArgs) => {
      Object.assign(this.telemetryProperties, {
        clearExistingPermissions: !!args.options.clearExistingPermissions,
        confirm: !!args.options.confirm
      });
    });
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-u, --webUrl <webUrl>'
      },
      {
        option: '-f, --folderUrl <folderUrl>'
      },
      {
        option: '-c, --clearExistingPermissions'
      },
      {
        option: '--confirm'
      }
    );
  }

  #initValidators(): void {
    this.validators.push(
      async (args: CommandArgs) => validation.isValidSharePointUrl(args.options.webUrl)
    );
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    const keepExistingPermissions: boolean = !args.options.clearExistingPermissions;

    const breakFolderRoleInheritance: () => Promise<void> = async (): Promise<void> => {
      try {
        const requestOptions: AxiosRequestConfig = {
          url: `${args.options.webUrl}/_api/web/GetFolderByServerRelativeUrl('${formatting.encodeQueryParameter(args.options.folderUrl)}')/ListItemAllFields/breakroleinheritance(${keepExistingPermissions})`,
          headers: {
            accept: 'application/json'
          },
          responseType: 'json'
        };
        await request.post(requestOptions);
      }
      catch (err: any) {
        this.handleRejectedODataJsonPromise(err);
      }
    };

    if (args.options.confirm) {
      await breakFolderRoleInheritance();
    }
    else {
      const result = await Cli.prompt<{ continue: boolean }>({
        type: 'confirm',
        name: 'continue',
        default: false,
        message: `Are you sure you want to break the role inheritance of folder ${args.options.folderUrl} located in site ${args.options.webUrl}?`
      });

      if (result.continue) {
        await breakFolderRoleInheritance();
      }
    }
  }
}

module.exports = new SpoFolderRoleInheritanceBreakCommand();