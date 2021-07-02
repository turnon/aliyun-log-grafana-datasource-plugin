import React, { ChangeEvent, PureComponent } from 'react';
import { SLSDataSourceOptions, SLSQuery } from './types';

import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { SLSDataSource } from './datasource';
const { FormField } = LegacyForms;

type Props = QueryEditorProps<SLSDataSource, SLSQuery, SLSDataSourceOptions>;

export class SLSVariableQueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, query: event.target.value });
  };

  render() {
    const { query } = this.props.query;

    return (
      <>
        <div className="gf-form-inline">
          <FormField labelWidth={6} inputWidth={30} value={query} onChange={this.onQueryTextChange} label="query" />
        </div>
      </>
    );
  }
}
