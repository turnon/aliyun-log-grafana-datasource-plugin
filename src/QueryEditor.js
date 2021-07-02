import * as tslib_1 from "tslib";
import { defaults } from 'lodash';
import React, { PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { defaultQuery } from './types';
var FormField = LegacyForms.FormField;
var SLSQueryEditor = /** @class */ (function (_super) {
    tslib_1.__extends(SLSQueryEditor, _super);
    function SLSQueryEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onQueryTextChange = function (event) {
            var _a = _this.props, onChange = _a.onChange, query = _a.query;
            onChange(tslib_1.__assign({}, query, { query: event.target.value }));
        };
        _this.onXChange = function (event) {
            var _a = _this.props, onChange = _a.onChange, query = _a.query, onRunQuery = _a.onRunQuery;
            onChange(tslib_1.__assign({}, query, { xcol: event.target.value }));
            // executes the query
            onRunQuery();
        };
        _this.onYChange = function (event) {
            var _a = _this.props, onChange = _a.onChange, query = _a.query, onRunQuery = _a.onRunQuery;
            onChange(tslib_1.__assign({}, query, { ycol: event.target.value }));
            // executes the query
            onRunQuery();
        };
        return _this;
    }
    SLSQueryEditor.prototype.render = function () {
        var dq = defaults(this.props.query, defaultQuery);
        var query = dq.query, xcol = dq.xcol, ycol = dq.ycol;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement(FormField, { labelWidth: 6, inputWidth: 30, value: query, onChange: this.onQueryTextChange, label: "query" })),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement(FormField, { labelWidth: 6, inputWidth: 11, value: ycol, onChange: this.onYChange, label: "ycol" }),
                React.createElement(FormField, { labelWidth: 6, inputWidth: 12, value: xcol, onChange: this.onXChange, label: "xcol(time)" }))));
    };
    return SLSQueryEditor;
}(PureComponent));
export { SLSQueryEditor };
//# sourceMappingURL=QueryEditor.js.map