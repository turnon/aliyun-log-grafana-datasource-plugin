import { __extends, __read, __values } from "tslib";
import { FieldType, MutableDataFrame, } from '@grafana/data';
import { DataSourceWithBackend, getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import _ from 'lodash';
import { map } from 'rxjs/operators';
var SLSDataSource = /** @class */ (function (_super) {
    __extends(SLSDataSource, _super);
    function SLSDataSource(instanceSettings) {
        return _super.call(this, instanceSettings) || this;
    }
    SLSDataSource.prototype.query = function (options) {
        options.targets.forEach(function (q) {
            q.query = replaceQueryParameters(q, options);
        });
        if (options.targets[0].xcol === 'trace') {
            return _super.prototype.query.call(this, options).pipe(map(responseToDataQueryResponse));
        }
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
function valueToTag(key, value) {
    return {
        key: key,
        value: value,
    };
}
function transServiceTags(result, i) {
    var _a, _b;
    var resource = JSON.parse((_a = result.get('resource')) === null || _a === void 0 ? void 0 : _a.get(i));
    var resourceArray = Array.from(Object.entries(resource), function (_a) {
        var _b = __read(_a, 2), name = _b[0], value = _b[1];
        return valueToTag(name, value);
    });
    resourceArray.push(valueToTag('host', (_b = result.get('host')) === null || _b === void 0 ? void 0 : _b.get(i)));
    return resourceArray;
}
function transTags(result, i) {
    var _a, _b, _c;
    var attribute = JSON.parse((_a = result.get('attribute')) === null || _a === void 0 ? void 0 : _a.get(i));
    var resourceArray = Array.from(Object.entries(attribute), function (_a) {
        var _b = __read(_a, 2), name = _b[0], value = _b[1];
        return valueToTag(name, value);
    });
    resourceArray.push(valueToTag('statusCode', (_b = result.get('statusCode')) === null || _b === void 0 ? void 0 : _b.get(i)));
    resourceArray.push(valueToTag('statusMessage', (_c = result.get('statusMessage')) === null || _c === void 0 ? void 0 : _c.get(i)));
    return resourceArray;
}
function transLogs(result, i) {
    var e_1, _a;
    var _b;
    var traceLogs = [];
    var slsLogs = JSON.parse((_b = result.get('logs')) === null || _b === void 0 ? void 0 : _b.get(i));
    try {
        for (var slsLogs_1 = __values(slsLogs), slsLogs_1_1 = slsLogs_1.next(); !slsLogs_1_1.done; slsLogs_1_1 = slsLogs_1.next()) {
            var slsLog = slsLogs_1_1.value;
            var attributeArray = Array.from(Object.entries(slsLog.attribute), function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                return valueToTag(name, value);
            });
            traceLogs.push({
                timestamp: slsLog.time / 1000000,
                fields: attributeArray,
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (slsLogs_1_1 && !slsLogs_1_1.done && (_a = slsLogs_1.return)) _a.call(slsLogs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return traceLogs;
}
function transformSpan(df) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var traceSpanRows = [];
    var fields = df.fields;
    var result = new Map(fields.map(function (key) { return [key.name, key.values]; }));
    for (var i = 0; i < df.length; i++) {
        var tsd = {
            traceID: (_a = result.get('traceID')) === null || _a === void 0 ? void 0 : _a.get(i),
            spanID: (_b = result.get('spanID')) === null || _b === void 0 ? void 0 : _b.get(i),
            parentSpanID: (_c = result.get('parentSpanID')) === null || _c === void 0 ? void 0 : _c.get(i),
            operationName: (_d = result.get('operationName')) === null || _d === void 0 ? void 0 : _d.get(i),
            serviceName: (_e = result.get('serviceName')) === null || _e === void 0 ? void 0 : _e.get(i),
            serviceTags: transServiceTags(result, i),
            startTime: (_f = result.get('startTime')) === null || _f === void 0 ? void 0 : _f.get(i),
            duration: (_g = result.get('duration')) === null || _g === void 0 ? void 0 : _g.get(i),
            tags: transTags(result, i),
            errorIconColor: ((_h = result.get('statusCode')) === null || _h === void 0 ? void 0 : _h.get(i)) === 'ERROR' ? '#f00' : '',
            logs: transLogs(result, i),
        };
        traceSpanRows.push(tsd);
    }
    return traceSpanRows;
}
export function transformResponse(df) {
    var e_2, _a;
    var spanRows = transformSpan(df);
    var frame = new MutableDataFrame({
        fields: [
            { name: 'traceID', type: FieldType.string },
            { name: 'spanID', type: FieldType.string },
            { name: 'parentSpanID', type: FieldType.string },
            { name: 'serviceName', type: FieldType.string },
            { name: 'serviceTags', type: FieldType.other },
            { name: 'startTime', type: FieldType.number },
            { name: 'duration', type: FieldType.number },
            { name: 'logs', type: FieldType.other },
            { name: 'tags', type: FieldType.other },
            { name: 'errorIconColor', type: FieldType.string },
        ],
        meta: {
            preferredVisualisationType: 'trace',
        },
    });
    try {
        for (var spanRows_1 = __values(spanRows), spanRows_1_1 = spanRows_1.next(); !spanRows_1_1.done; spanRows_1_1 = spanRows_1.next()) {
            var span = spanRows_1_1.value;
            frame.add(span);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (spanRows_1_1 && !spanRows_1_1.done && (_a = spanRows_1.return)) _a.call(spanRows_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return frame;
}
function responseToDataQueryResponse(response) {
    console.log(response);
    return {
        data: [transformResponse(response.data[0])],
    };
}
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