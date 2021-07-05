import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
var SecretFormField = LegacyForms.SecretFormField, FormField = LegacyForms.FormField;
var SLSConfigEditor = /** @class */ (function (_super) {
    tslib_1.__extends(SLSConfigEditor, _super);
    function SLSConfigEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onEndpointChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            options.url = event.target.value;
            onOptionsChange(tslib_1.__assign({}, options));
        };
        _this.onProjectChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var jsonData = tslib_1.__assign({}, options.jsonData, { project: event.target.value });
            onOptionsChange(tslib_1.__assign({}, options, { jsonData: jsonData }));
        };
        _this.onLogStoreChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var jsonData = tslib_1.__assign({}, options.jsonData, { logstore: event.target.value });
            onOptionsChange(tslib_1.__assign({}, options, { jsonData: jsonData }));
        };
        // Secure field (only sent to the backend)
        _this.onAKIDChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var accessKeySecret = '';
            if (options.secureJsonData !== undefined) {
                if (options.secureJsonData.hasOwnProperty('accessKeySecret')) {
                    // @ts-ignore
                    accessKeySecret = options.secureJsonData['accessKeySecret'];
                }
            }
            onOptionsChange(tslib_1.__assign({}, options, { secureJsonData: {
                    accessKeyId: event.target.value,
                    accessKeySecret: accessKeySecret,
                } }));
        };
        _this.onAKSecretChange = function (event) {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            var accessKeyId = '';
            if (options.secureJsonData !== undefined) {
                if (options.secureJsonData.hasOwnProperty('accessKeyId')) {
                    // @ts-ignore
                    accessKeyId = options.secureJsonData['accessKeyId'];
                }
            }
            onOptionsChange(tslib_1.__assign({}, options, { secureJsonData: {
                    accessKeyId: accessKeyId,
                    accessKeySecret: event.target.value,
                } }));
        };
        _this.onResetAKID = function () {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            onOptionsChange(tslib_1.__assign({}, options, { secureJsonFields: tslib_1.__assign({}, options.secureJsonFields, { accessKeyId: false }), secureJsonData: tslib_1.__assign({}, options.secureJsonData, { accessKeyId: '' }) }));
        };
        _this.onResetAKSecret = function () {
            var _a = _this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
            onOptionsChange(tslib_1.__assign({}, options, { secureJsonFields: tslib_1.__assign({}, options.secureJsonFields, { accessKeySecret: false }), secureJsonData: tslib_1.__assign({}, options.secureJsonData, { accessKeySecret: '' }) }));
        };
        return _this;
    }
    SLSConfigEditor.prototype.render = function () {
        var options = this.props.options;
        var jsonData = options.jsonData, secureJsonFields = options.secureJsonFields, url = options.url;
        var secureJsonData = (options.secureJsonData || {});
        return (React.createElement("div", { className: "gf-form-group" },
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormField, { label: "Endpoint", labelWidth: 8, inputWidth: 25, onChange: this.onEndpointChange, value: url || '', placeholder: "json field returned to frontend" })),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement(FormField, { label: "Project", labelWidth: 8, inputWidth: 25, onChange: this.onProjectChange, value: jsonData.project || '', placeholder: "json field returned to frontend" })),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement(FormField, { label: "Logstore", labelWidth: 8, inputWidth: 25, onChange: this.onLogStoreChange, value: jsonData.logstore || '', placeholder: "json field returned to frontend" })),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement(SecretFormField, { isConfigured: (secureJsonFields && secureJsonFields.accessKeyId), value: secureJsonData.accessKeyId || '', label: "AccessKeyId", placeholder: "secure json field (backend only)", labelWidth: 8, inputWidth: 25, onReset: this.onResetAKID, onChange: this.onAKIDChange }))),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement(SecretFormField, { isConfigured: (secureJsonFields && secureJsonFields.accessKeySecret), value: secureJsonData.accessKeySecret || '', label: "AccessKeySecret", placeholder: "secure json field (backend only)", labelWidth: 8, inputWidth: 25, onReset: this.onResetAKSecret, onChange: this.onAKSecretChange })))));
    };
    return SLSConfigEditor;
}(PureComponent));
export { SLSConfigEditor };
//# sourceMappingURL=ConfigEditor.js.map