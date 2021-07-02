package main

import (
	"encoding/json"
	"fmt"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

type LogSource struct {
	Endpoint        string
	Project         string `json:"project"`
	LogStore        string `json:"logstore"`
	AccessKeyId     string
	AccessKeySecret string
}

type QueryInfo struct {
	QueryType   string `json:"type"`
	QueryMode   string `json:"mode"`
	Query       string `json:"query"`
	Xcol        string `json:"xcol"`
	Ycol        string `json:"ycol"`
	LogsPerPage int64  `json:"logsPerPage"`
	CurrentPage int64  `json:"currentPage"`
}

type Result struct {
	refId        string
	dataResponse backend.DataResponse
}

func LoadSettings(ctx backend.PluginContext) (*LogSource, error) {
	model := &LogSource{}

	settings := ctx.DataSourceInstanceSettings
	err := json.Unmarshal(settings.JSONData, &model)
	if err != nil {
		return nil, fmt.Errorf("error reading settings: %s", err.Error())
	}
	model.Endpoint = settings.URL
	model.AccessKeyId = settings.DecryptedSecureJSONData["accessKeyId"]
	model.AccessKeySecret = settings.DecryptedSecureJSONData["accessKeySecret"]

	return model, nil
}
