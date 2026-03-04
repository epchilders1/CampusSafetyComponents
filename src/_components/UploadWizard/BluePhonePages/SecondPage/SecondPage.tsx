import React, { useMemo } from "react";
import { MapPin, AlertCircle, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";

import './SecondPage.css';

interface ValidationError {
    row: number;
    column: string;
    value: any;
    field: string;
    message: string;
}

export default function SecondPage(props:any){
    const {fileData, columns, columnMappings, handleMappingChange, getMissingRequiredMappings, BLUE_PHONE_FIELDS, validationErrors = []} = props;

    const errorsByField = useMemo(() => {
        const grouped: Record<string, ValidationError[]> = {};
        validationErrors.forEach((error: ValidationError) => {
            const fieldKey = Object.entries(columnMappings).find(([_, column]) => column === error.column)?.[0];
            if (fieldKey) {
                if (!grouped[fieldKey]) grouped[fieldKey] = [];
                grouped[fieldKey].push(error);
            }
        });
        return grouped;
    }, [validationErrors, columnMappings]);

    const getFieldValidationInfo = (fieldKey: string) => {
        const field = BLUE_PHONE_FIELDS.find((f: any) => f.key === fieldKey);
        return field?.validation;
    };

    const getValidationStatus = (fieldKey: string) => {
        const hasErrors = errorsByField[fieldKey] && errorsByField[fieldKey].length > 0;
        const isMapped = columnMappings[fieldKey];

        if (!isMapped) return 'unmapped';
        if (hasErrors) return 'error';
        return 'valid';
    };

    const getValidationStatusColor = (status: string) => {
        switch(status) {
            case 'error': return 'blue-phone-second-page-field-card-error';
            case 'valid': return 'blue-phone-second-page-field-card-valid';
            case 'unmapped': return 'blue-phone-second-page-field-card-unmapped';
            default: return 'blue-phone-second-page-field-card-unmapped';
        }
    };

    const getValidationIcon = (status: string) => {
        switch(status) {
            case 'error': return <AlertTriangle className="blue-phone-second-page-validation-icon-error" />;
            case 'valid': return <CheckCircle className="blue-phone-second-page-validation-icon-valid" />;
            default: return null;
        }
    };

    const getSelectClassName = (field: any, validationStatus: string) => {
        let variant = 'blue-phone-second-page-select-default';
        if (field.required && !columnMappings[field.key]) {
            variant = 'blue-phone-second-page-select-required-empty';
        } else if (validationStatus === 'error') {
            variant = 'blue-phone-second-page-select-error';
        } else if (validationStatus === 'valid') {
            variant = 'blue-phone-second-page-select-valid';
        }
        return `blue-phone-second-page-select ${variant}`;
    };

    return(
        <div className="blue-phone-second-page-wrapper">
            <div className="blue-phone-second-page-header">
                <h1 className="blue-phone-second-page-title">Column Mapping</h1>
                <p className="blue-phone-second-page-subtitle">Map your spreadsheet columns to Blue Phone profile fields</p>
            </div>

            <div className="blue-phone-second-page-preview-card">
                <div className="blue-phone-second-page-card-header">
                    <MapPin className="blue-phone-second-page-card-icon" />
                    <h3 className="blue-phone-second-page-card-title">Data Preview</h3>
                </div>
                <p className="blue-phone-second-page-card-description">
                    A preview of the first 5 rows from your uploaded file. Use this to verify your data and assist with mapping.
                </p>

                <div className="blue-phone-second-page-table-container">
                    <div className="overflow-x-auto" style={{maxHeight: '400px'}}>
                        <table className="blue-phone-second-page-table">
                            <thead className="blue-phone-second-page-table-head">
                                <tr>
                                    <th className="blue-phone-second-page-table-th-index">
                                        #
                                    </th>
                                    {columns.map((column:any) => (
                                        <th key={column} className="blue-phone-second-page-table-th">
                                            <div className="blue-phone-second-page-th-content">
                                                <span className="blue-phone-second-page-th-label">{column}</span>
                                                {Object.entries(columnMappings).find(([_, csvCol]) => csvCol === column) && (
                                                    <div className="blue-phone-second-page-th-mapping">
                                                        <ArrowRight className="blue-phone-second-page-th-mapping-arrow" />
                                                        <span className="blue-phone-second-page-th-mapping-label">
                                                            {BLUE_PHONE_FIELDS.find((f:any) => f.key === Object.entries(columnMappings).find(([_, csvCol]) => csvCol === column)?.[0])?.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fileData?.slice(0, 5).map((row:any, index:number) => (
                                    <tr key={index} className={index % 2 === 0 ? 'blue-phone-second-page-table-row-even' : 'blue-phone-second-page-table-row-odd'}>
                                        <td className="blue-phone-second-page-table-td-index">
                                            {index + 1}
                                        </td>
                                        {columns.map((column:any) => (
                                            <td key={`${index}-${column}`} className="blue-phone-second-page-table-td">
                                                <div className="blue-phone-second-page-cell-content" title={String(row[column] || '-')}>
                                                    {row[column] !== null && row[column] !== undefined && row[column] !== ''
                                                        ? String(row[column])
                                                        : '-'
                                                    }
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {fileData?.length > 5 && (
                    <div className="blue-phone-second-page-row-count">
                        <span className="blue-phone-second-page-row-count-text">
                            Showing first 5 of {fileData?.length} rows • {columns.length} columns total
                        </span>
                    </div>
                )}
            </div>

            <div className="blue-phone-second-page-mapping-section">
                <div className="blue-phone-second-page-mapping-card">
                    <div className="blue-phone-second-page-card-header">
                        <MapPin className="blue-phone-second-page-card-icon" />
                        <h3 className="blue-phone-second-page-card-title">Field Mapping</h3>
                    </div>
                    <p className="blue-phone-second-page-card-description">
                        Match your spreadsheet columns with the corresponding Blue Phone profile fields.
                        <span className="blue-phone-second-page-required-note"> Required fields must be mapped.</span>
                    </p>

                    <div className="blue-phone-second-page-field-grid">
                        {BLUE_PHONE_FIELDS.map((field:any) => {
                            const validationStatus = getValidationStatus(field.key);
                            const fieldValidation = getFieldValidationInfo(field.key);
                            const fieldErrors = errorsByField[field.key] || [];

                            return (
                                <div key={field.key} className={`blue-phone-second-page-field-card ${getValidationStatusColor(validationStatus)}`}>
                                    <div className="blue-phone-second-page-field-header">
                                        <label className="blue-phone-second-page-field-label">
                                            {field.label}
                                            {field.required && <span className="blue-phone-second-page-field-required">*</span>}
                                            {getValidationIcon(validationStatus)}
                                        </label>
                                    </div>

                                    {fieldValidation && (
                                        <div className="blue-phone-second-page-validation-info">
                                            <strong>Requirements:</strong> {fieldValidation.errorMessage}
                                        </div>
                                    )}

                                    <select
                                        value={columnMappings[field.key] || ''}
                                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                        className={getSelectClassName(field, validationStatus)}
                                    >
                                        <option value="">Select a column...</option>
                                        {columns.map((column:any) => (
                                            <option key={column} value={column}>
                                                {column}
                                            </option>
                                        ))}
                                    </select>

                                    {fieldErrors.length > 0 && (
                                        <div className="blue-phone-second-page-field-errors">
                                            <div className="blue-phone-second-page-field-errors-header">
                                                <AlertTriangle className="blue-phone-second-page-field-errors-icon" />
                                                <span className="blue-phone-second-page-field-errors-count">
                                                    {fieldErrors.length} validation error{fieldErrors.length > 1 ? 's' : ''}:
                                                </span>
                                            </div>
                                            <div className="blue-phone-second-page-field-errors-list">
                                                {fieldErrors.slice(0, 3).map((error, idx) => (
                                                    <div key={idx} className="blue-phone-second-page-field-error-row">
                                                        Row {error.row}: &quot;{error.value}&quot; - {error.message}
                                                    </div>
                                                ))}
                                                {fieldErrors.length > 3 && (
                                                    <div className="blue-phone-second-page-field-errors-more">
                                                        ...and {fieldErrors.length - 3} more errors
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {(getMissingRequiredMappings().length > 0 || validationErrors.length > 0) && (
                        <div className="blue-phone-second-page-alerts-container">
                            {getMissingRequiredMappings().length > 0 && (
                                <div className="blue-phone-second-page-missing-alert">
                                    <div className="blue-phone-second-page-missing-alert-header">
                                        <AlertCircle className="blue-phone-second-page-missing-alert-icon" />
                                        <span className="blue-phone-second-page-missing-alert-title">Missing Required Fields</span>
                                    </div>
                                    <p className="blue-phone-second-page-missing-alert-message">
                                        Please map the following required fields: {getMissingRequiredMappings().map((f:any) => f.label).join(', ')}
                                    </p>
                                </div>
                            )}

                            {validationErrors.length > 0 && (
                                <div className="blue-phone-second-page-validation-alert">
                                    <div className="blue-phone-second-page-validation-alert-header">
                                        <AlertTriangle className="blue-phone-second-page-validation-alert-icon" />
                                        <span className="blue-phone-second-page-validation-alert-title">
                                            Data Validation Issues ({validationErrors.length} errors)
                                        </span>
                                    </div>
                                    <p className="blue-phone-second-page-validation-alert-message">
                                        {`Some values in your data don't match the required format. Please review the errors above and correct your data file, or choose different column mappings.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )};