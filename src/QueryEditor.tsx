import { defaults } from 'lodash';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, InlineFormLabel } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { SLSDataSource } from './datasource';
import { defaultQuery, SLSDataSourceOptions, SLSQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<SLSDataSource, SLSQuery, SLSDataSourceOptions>;

export class SLSQueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, query: event.target.value });
  };

  onXChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, xcol: event.target.value });
    // executes the query
    onRunQuery();
  };

  onYChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, ycol: event.target.value });
    // executes the query
    onRunQuery();
  };

  render() {
    const dq = defaults(this.props.query, defaultQuery);
    const { query, xcol, ycol } = dq;

    return (
      <>
        <div className="gf-form-inline">
          <InlineFormLabel width={6} className="query-keyword">
            Query
          </InlineFormLabel>
          <input
            className="gf-form-input"
            value={query}
            onChange={this.onQueryTextChange}
            onBlur={this.onQueryTextChange}
          ></input>
        </div>
        <div className="gf-form-inline">
          <FormField labelWidth={6} inputWidth={30} value={ycol} onChange={this.onYChange} label="ycol" />
          <FormField labelWidth={6} inputWidth={20} value={xcol} onChange={this.onXChange} label="xcol(time)" />
        </div>
      </>
    );
  }
}
