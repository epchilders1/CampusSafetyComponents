import React from "react";
import { FileText, Upload, AlertCircle } from "lucide-react";
import Input from "../../../Input/Input";
import { useState } from "react";

import './UploadPage.css';

export default function UploadPage(props:any){
    const {file, isLoading, parseError, handleFileUpload, title, accept} = props;

    return(
        <div>
        <div className="upload-page-header">
            <h1 className="upload-page-title">{title}</h1>
        </div>
        <div className="upload-page-card">
            <div className="upload-page-card-header">
                <FileText className="upload-page-card-icon" />
                <h2 className="upload-page-card-title">Primary Data Source</h2>
            </div>
            <div className="upload-page-dropzone">
                <Input
                    type="file"
                    accept={accept}
                    // accept=".csv,.xlsx,.xls"
                    onChange={(e) => handleFileUpload(e)}
                    className="upload-page-file-input"
                    id="csv-upload"
                    disabled={isLoading}
                />
                <label htmlFor="csv-upload" className={isLoading ? 'upload-page-upload-label-loading' : 'upload-page-upload-label'}>
                    <Upload className={isLoading ? 'upload-page-upload-icon-loading' : 'upload-page-upload-icon'} />
                    <span className="upload-page-upload-text">
                        {isLoading ? 'Processing file...' : 'Upload CSV or Excel File'}
                    </span>
                    {file === null && !isLoading && (
                        <span className="upload-page-file-hint">Supports .csv, .xlsx, .xls</span>
                    )}
                    {file !== null && !isLoading && (
                        <span className="upload-page-file-name">{file.name}</span>
                    )}
                    {isLoading && (
                        <span className="upload-page-parsing-text">Parsing data...</span>
                    )}
                </label>
            </div>

            {parseError && (
                <div className="upload-page-error-container">
                    <div className="upload-page-error-header">
                        <AlertCircle className="upload-page-error-icon" />
                        <span className="upload-page-error-title">Parse Error</span>
                    </div>
                    <p className="upload-page-error-message">{parseError}</p>
                </div>
            )}
        </div>
    </div>
    );
}