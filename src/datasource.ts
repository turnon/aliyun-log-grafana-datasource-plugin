import { DataQueryRequest, DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';
import { SLSDataSourceOptions, SLSQuery } from './types';
import { getBackendSrv } from '@grafana/runtime';
import { getTemplateSrv } from '@grafana/runtime';
import _ from 'lodash';

export class SLSDataSource extends DataSourceWithBackend<SLSQuery, SLSDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<SLSDataSourceOptions>) {
    super(instanceSettings);
  }

  query(options: DataQueryRequest<SLSQuery>) {
    options.targets.forEach(q => {
      q.query = replaceQueryParameters(q, options);
    });

    return super.query(options);
  }

  metricFindQuery(query: SLSQuery, options?: any) {
    const data = {
      from: options.range.from.valueOf().toString(),
      to: options.range.to.valueOf().toString(),
      queries: [
        {
          datasource: this.name,
          datasourceId: this.id,
          query: replaceQueryParameters(query, options),
        },
      ],
    };
    return getBackendSrv()
      .post('/api/ds/query', data)
      .then(response => {
        return response.results.A.frames[0].data.values[0];
      })
      .then(mapToTextValue);
  }
}

export function mapToTextValue(result: any) {
  return _.map(result, (d, i) => {
    if (d && d.text && d.value) {
      return { text: d.text, value: d.value };
    } else if (_.isObject(d)) {
      return { text: d, value: i };
    }
    return { text: d, value: d };
  });
}

export function replaceQueryParameters(q: SLSQuery, options: DataQueryRequest<SLSQuery>) {
  if (typeof q.query === 'undefined') {
    q.query = '';
  }
  let query = getTemplateSrv().replace(q.query, options.scopedVars, function(
    value: { forEach: (arg0: (v: string) => void) => void; join: (arg0: string) => void },
    variable: { multi: any; includeAll: any; name: string; label: any }
  ) {
    if (typeof value === 'object' && (variable.multi || variable.includeAll)) {
      const a: string[] = [];
      value.forEach(function(v: string) {
        if (variable.name === variable.label) {
          a.push('"' + variable.name + '":"' + v + '"');
        } else {
          a.push('"' + v + '"');
        }
      });
      return a.join(' OR ');
    }
    if (_.isArray(value)) {
      return value.join(' OR ');
    }
    return value;
  });
  const re = /\$([0-9]+)([dmhs])/g;
  const reArray = query.match(re);
  _(reArray).forEach(function(col) {
    const old = col;
    col = col.replace('$', '');
    let sec = 1;
    if (col.indexOf('s') !== -1) {
      sec = 1;
    } else if (col.indexOf('m') !== -1) {
      sec = 60;
    } else if (col.indexOf('h') !== -1) {
      sec = 3600;
    } else if (col.indexOf('d') !== -1) {
      sec = 3600 * 24;
    }
    col = col.replace(/[smhd]/g, '');
    let v = parseInt(col, 10);
    v = v * sec;
    console.log(old, v, col, sec, query);
    query = query.replace(old, String(v));
  });
  if (query.indexOf('#time_end') !== -1) {
    query = query.replace('#time_end', String(options.range.to.unix() / 1000));
  }
  if (query.indexOf('#time_begin') !== -1) {
    query = query.replace('#time_begin', String(options.range.from.unix() / 1000));
  }
  return query;
}
