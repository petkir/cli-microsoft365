import { FN001001_DEP_microsoft_sp_core_library } from "./rules/FN001001_DEP_microsoft_sp_core_library";
import { FN001002_DEP_microsoft_sp_lodash_subset } from "./rules/FN001002_DEP_microsoft_sp_lodash_subset";
import { FN001003_DEP_microsoft_sp_office_ui_fabric_core } from "./rules/FN001003_DEP_microsoft_sp_office_ui_fabric_core";
import { FN001004_DEP_microsoft_sp_webpart_base } from "./rules/FN001004_DEP_microsoft_sp_webpart_base";
import { FN001008_DEP_react } from "./rules/FN001008_DEP_react";
import { FN001009_DEP_react_dom } from "./rules/FN001009_DEP_react_dom";
import { FN001011_DEP_microsoft_sp_dialog } from "./rules/FN001011_DEP_microsoft_sp_dialog";
import { FN001012_DEP_microsoft_sp_application_base } from "./rules/FN001012_DEP_microsoft_sp_application_base";
import { FN001013_DEP_microsoft_decorators } from "./rules/FN001013_DEP_microsoft_decorators";
import { FN001014_DEP_microsoft_sp_listview_extensibility } from "./rules/FN001014_DEP_microsoft_sp_listview_extensibility";
import { FN001021_DEP_microsoft_sp_property_pane } from "./rules/FN001021_DEP_microsoft_sp_property_pane";
import { FN001022_DEP_office_ui_fabric_react } from "./rules/FN001022_DEP_office_ui_fabric_react";
import { FN001023_DEP_microsoft_sp_component_base } from "./rules/FN001023_DEP_microsoft_sp_component_base";
import { FN001024_DEP_microsoft_sp_diagnostics } from "./rules/FN001024_DEP_microsoft_sp_diagnostics";
import { FN001025_DEP_microsoft_sp_dynamic_data } from "./rules/FN001025_DEP_microsoft_sp_dynamic_data";
import { FN001026_DEP_microsoft_sp_extension_base } from "./rules/FN001026_DEP_microsoft_sp_extension_base";
import { FN001027_DEP_microsoft_sp_http } from "./rules/FN001027_DEP_microsoft_sp_http";
import { FN001028_DEP_microsoft_sp_list_subscription } from "./rules/FN001028_DEP_microsoft_sp_list_subscription";
import { FN001029_DEP_microsoft_sp_loader } from "./rules/FN001029_DEP_microsoft_sp_loader";
import { FN001030_DEP_microsoft_sp_module_interfaces } from "./rules/FN001030_DEP_microsoft_sp_module_interfaces";
import { FN001031_DEP_microsoft_sp_odata_types } from "./rules/FN001031_DEP_microsoft_sp_odata_types";
import { FN001032_DEP_microsoft_sp_page_context } from "./rules/FN001032_DEP_microsoft_sp_page_context";
import { FN001034_DEP_microsoft_sp_adaptive_card_extension_base } from "./rules/FN001034_DEP_microsoft_sp_adaptive_card_extension_base";
import { FN002001_DEVDEP_microsoft_sp_build_web } from "./rules/FN002001_DEVDEP_microsoft_sp_build_web";
import { FN002002_DEVDEP_microsoft_sp_module_interfaces } from "./rules/FN002002_DEVDEP_microsoft_sp_module_interfaces";
import { FN002015_DEVDEP_types_react } from "./rules/FN002015_DEVDEP_types_react";
import { FN002016_DEVDEP_types_react_dom } from "./rules/FN002016_DEVDEP_types_react_dom";
import { FN002022_DEVDEP_microsoft_eslint_plugin_spfx } from "./rules/FN002022_DEVDEP_microsoft_eslint_plugin_spfx";
import { FN002023_DEVDEP_microsoft_eslint_config_spfx } from "./rules/FN002023_DEVDEP_microsoft_eslint_config_spfx";
import { FN010001_YORC_version } from "./rules/FN010001_YORC_version";
import { FN010008_YORC_nodeVersion } from "./rules/FN010008_YORC_nodeVersion";
import { FN010009_YORC_sdkVersions_microsoft_graph_client } from "./rules/FN010009_YORC_sdkVersions_microsoft_graph_client";
import { FN010010_YORC_sdkVersions_teams_js } from "./rules/FN010010_YORC_sdkVersions_teams_js";
import { FN021003_PKG_engines_node } from "./rules/FN021003_PKG_engines_node";
import { FN022001_SCSS_remove_fabric_react } from "./rules/FN022001_SCSS_remove_fabric_react";
import { FN022002_SCSS_add_fabric_react } from "./rules/FN022002_SCSS_add_fabric_react";

module.exports = [
  new FN001001_DEP_microsoft_sp_core_library('1.16.0-beta.2'),
  new FN001002_DEP_microsoft_sp_lodash_subset('1.16.0-beta.2'),
  new FN001003_DEP_microsoft_sp_office_ui_fabric_core('1.16.0-beta.2'),
  new FN001004_DEP_microsoft_sp_webpart_base('1.16.0-beta.2'),
  new FN001008_DEP_react('17.0.1'),
  new FN001009_DEP_react_dom('17.0.1'),
  new FN001011_DEP_microsoft_sp_dialog('1.16.0-beta.2'),
  new FN001012_DEP_microsoft_sp_application_base('1.16.0-beta.2'),
  new FN001014_DEP_microsoft_sp_listview_extensibility('1.16.0-beta.2'),
  new FN001021_DEP_microsoft_sp_property_pane('1.16.0-beta.2'),
  new FN001022_DEP_office_ui_fabric_react('7.199.1'),
  new FN001023_DEP_microsoft_sp_component_base('1.16.0-beta.2'),
  new FN001024_DEP_microsoft_sp_diagnostics('1.16.0-beta.2'),
  new FN001025_DEP_microsoft_sp_dynamic_data('1.16.0-beta.2'),
  new FN001026_DEP_microsoft_sp_extension_base('1.16.0-beta.2'),
  new FN001027_DEP_microsoft_sp_http('1.16.0-beta.2'),
  new FN001028_DEP_microsoft_sp_list_subscription('1.16.0-beta.2'),
  new FN001029_DEP_microsoft_sp_loader('1.16.0-beta.2'),
  new FN001030_DEP_microsoft_sp_module_interfaces('1.16.0-beta.2'),
  new FN001031_DEP_microsoft_sp_odata_types('1.16.0-beta.2'),
  new FN001032_DEP_microsoft_sp_page_context('1.16.0-beta.2'),
  new FN001013_DEP_microsoft_decorators('1.16.0-beta.2'),
  new FN001034_DEP_microsoft_sp_adaptive_card_extension_base('1.16.0-beta.2'),
  new FN002022_DEVDEP_microsoft_eslint_plugin_spfx('1.16.0-beta.2'),
  new FN002023_DEVDEP_microsoft_eslint_config_spfx('1.16.0-beta.2'),
  new FN002001_DEVDEP_microsoft_sp_build_web('1.16.0-beta.2'),
  new FN002002_DEVDEP_microsoft_sp_module_interfaces('1.16.0-beta.2'),
  new FN002015_DEVDEP_types_react('17.0.45'),
  new FN002016_DEVDEP_types_react_dom('17.0.17'),
  new FN010001_YORC_version('1.16.0-beta.2'),
  new FN010008_YORC_nodeVersion(),
  new FN010009_YORC_sdkVersions_microsoft_graph_client('3.0.2'),
  new FN010010_YORC_sdkVersions_teams_js('2.4.1'),
  new FN021003_PKG_engines_node('>=16.13.0 <17.0.0'),
  new FN022001_SCSS_remove_fabric_react('~office-ui-fabric-react/dist/sass/References.scss'),
  new FN022002_SCSS_add_fabric_react('~@fluentui/react/dist/sass/References.scss')
];
