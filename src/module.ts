import { DataSourcePlugin } from '@grafana/data';
import { SLSDataSource } from './datasource';
import { SLSConfigEditor } from './ConfigEditor';
import { SLSQueryEditor } from './QueryEditor';
import { SLSQuery, SLSDataSourceOptions } from './types';
import { SLSVariableQueryEditor } from './VariableQueryEditor';

export const plugin = new DataSourcePlugin<SLSDataSource, SLSQuery, SLSDataSourceOptions>(SLSDataSource)
  .setConfigEditor(SLSConfigEditor)
  .setQueryEditor(SLSQueryEditor)
  .setVariableQueryEditor(SLSVariableQueryEditor);
