import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
var FormField = LegacyForms.FormField;
var SLSVariableQueryEditor = /** @class */ (function (_super) {
    __extends(SLSVariableQueryEditor, _super);
    function SLSVariableQueryEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onQueryTextChange = function (event) {
            var _a = _this.props, onChange = _a.onChange, query = _a.query;
            onChange(__assign(__assign({}, query), { query: event.target.value }));
        };
        return _this;
    }
    SLSVariableQueryEditor.prototype.render = function () {
        var query = this.props.query.query;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement(FormField, { labelWidth: 6, inputWidth: 30, value: query, onChange: this.onQueryTextChange, label: "query" }))));
    };
    return SLSVariableQueryEditor;
}(PureComponent));
export { SLSVariableQueryEditor };
//# sourceMappingURL=VariableQueryEditor.js.map