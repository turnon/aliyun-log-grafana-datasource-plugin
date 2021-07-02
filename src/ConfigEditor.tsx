import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { SLSDataSourceOptions, SLSSecureJsonData } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<SLSDataSourceOptions> {}

interface State {}

export class SLSConfigEditor extends PureComponent<Props, State> {
  onEndpointChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    options.url = event.target.value;
    onOptionsChange({ ...options });
  };

  onProjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      project: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onLogStoreChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      logstore: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAKIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    var accessKeySecret = '';
    if (options.secureJsonData !== undefined) {
      if (options.secureJsonData.hasOwnProperty('accessKeySecret')) {
        // @ts-ignore
        accessKeySecret = options.secureJsonData['accessKeySecret'];
      }
    }
    onOptionsChange({
      ...options,
      secureJsonData: {
        accessKeyId: event.target.value,
        accessKeySecret: accessKeySecret,
      },
    });
  };

  onAKSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    var accessKeyId = '';
    if (options.secureJsonData !== undefined) {
      if (options.secureJsonData.hasOwnProperty('accessKeyId')) {
        // @ts-ignore
        accessKeyId = options.secureJsonData['accessKeyId'];
      }
    }
    onOptionsChange({
      ...options,
      secureJsonData: {
        accessKeyId: accessKeyId,
        accessKeySecret: event.target.value,
      },
    });
  };

  onResetAKID = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        accessKeyId: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        accessKeyId: '',
      },
    });
  };
  onResetAKSecret = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        accessKeySecret: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        accessKeySecret: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields, url } = options;
    const secureJsonData = (options.secureJsonData || {}) as SLSSecureJsonData;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Endpoint"
            labelWidth={8}
            inputWidth={25}
            onChange={this.onEndpointChange}
            value={url || ''}
            placeholder="json field returned to frontend"
          />
        </div>
        <div className="gf-form-inline">
          <FormField
            label="Project"
            labelWidth={8}
            inputWidth={25}
            onChange={this.onProjectChange}
            value={jsonData.project || ''}
            placeholder="json field returned to frontend"
          />
        </div>
        <div className="gf-form-inline">
          <FormField
            label="Logstore"
            labelWidth={8}
            inputWidth={25}
            onChange={this.onLogStoreChange}
            value={jsonData.logstore || ''}
            placeholder="json field returned to frontend"
          />
        </div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.accessKeyId) as boolean}
              value={secureJsonData.accessKeyId || ''}
              label="AccessKeyId"
              placeholder="secure json field (backend only)"
              labelWidth={8}
              inputWidth={25}
              onReset={this.onResetAKID}
              onChange={this.onAKIDChange}
            />
          </div>
        </div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.accessKeySecret) as boolean}
              value={secureJsonData.accessKeySecret || ''}
              label="AccessKeySecret"
              placeholder="secure json field (backend only)"
              labelWidth={8}
              inputWidth={25}
              onReset={this.onResetAKSecret}
              onChange={this.onAKSecretChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
