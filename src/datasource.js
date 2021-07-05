import * as tslib_1 from "tslib";
import { DataSourceWithBackend } from '@grafana/runtime';
import { getBackendSrv } from '@grafana/runtime';
import { getTemplateSrv } from '@grafana/runtime';
import _ from 'lodash';
var SLSDataSource = /** @class */ (function (_super) {
    tslib_1.__extends(SLSDataSource, _super);
    function SLSDataSource(instanceSettings) {
        return _super.call(this, instanceSettings) || this;
    }
    SLSDataSource.prototype.query = function (options) {
        options.targets.forEach(function (q) {
            q.query = replaceQueryParameters(q, options);
        });
        return _super.prototype.query.call(this, options);
    };
    SLSDataSource.prototype.metricFindQuery = function (query, options) {
        var data = {
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
            .then(function (response) {
            return response.results.A.frames[0].data.values[0];
        })
            .then(mapToTextValue);
    };
    return SLSDataSource;
}(DataSourceWithBackend));
export { SLSDataSource };
export function mapToTextValue(result) {
    return _.map(result, function (d, i) {
        if (d && d.text && d.value) {
            return { text: d.text, value: d.value };
        }
        else if (_.isObject(d)) {
            return { text: d, value: i };
        }
        return { text: d, value: d };
    });
}
export function replaceQueryParameters(q, options) {
    if (typeof q.query === 'undefined') {
        q.query = '';
    }
    var query = getTemplateSrv().replace(q.query, options.scopedVars, function (value, variable) {
        if (typeof value === 'object' && (variable.multi || variable.includeAll)) {
            var a_1 = [];
            value.forEach(function (v) {
                if (variable.name === variable.label) {
                    a_1.push('"' + variable.name + '":"' + v + '"');
                }
                else {
                    a_1.push('"' + v + '"');
                }
            });
            return a_1.join(' OR ');
        }
        if (_.isArray(value)) {
            return value.join(' OR ');
        }
        return value;
    });
    var re = /\$([0-9]+)([dmhs])/g;
    var reArray = query.match(re);
    _(reArray).forEach(function (col) {
        var old = col;
        col = col.replace('$', '');
        var sec = 1;
        if (col.indexOf('s') !== -1) {
            sec = 1;
        }
        else if (col.indexOf('m') !== -1) {
            sec = 60;
        }
        else if (col.indexOf('h') !== -1) {
            sec = 3600;
        }
        else if (col.indexOf('d') !== -1) {
            sec = 3600 * 24;
        }
        col = col.replace(/[smhd]/g, '');
        var v = parseInt(col, 10);
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
//# sourceMappingURL=datasource.js.map