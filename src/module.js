import { DataSourcePlugin } from '@grafana/data';
import { SLSDataSource } from './datasource';
import { SLSConfigEditor } from './ConfigEditor';
import { SLSQueryEditor } from './QueryEditor';
import { SLSVariableQueryEditor } from './VariableQueryEditor';
export var plugin = new DataSourcePlugin(SLSDataSource)
    .setConfigEditor(SLSConfigEditor)
    .setQueryEditor(SLSQueryEditor)
    .setVariableQueryEditor(SLSVariableQueryEditor);
export { SLSVariableQueryEditor as VariableQueryEditor };
//# sourceMappingURL=module.js.map