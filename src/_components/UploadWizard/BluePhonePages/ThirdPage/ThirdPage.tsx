import React, { useMemo } from 'react';
import { Users, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

import './ThirdPage.css';

export default function ThirdPage(props: any) {
    const { fileData, columnMappings, BLUE_PHONE_FIELDS, handleSubmit } = props;

    const profileSummary = useMemo(() => {
        const mappedFields = Object.keys(columnMappings);
        const requiredFields = BLUE_PHONE_FIELDS.filter((f: any) => f.required).map((f: any) => f.key);
        const missingRequired = requiredFields.filter((field: any) => !mappedFields.includes(field));

        const fieldCompleteness = mappedFields.map(fieldKey => {
            const csvColumn = columnMappings[fieldKey];
            const nonEmptyCount = fileData?.filter((row: any) =>
                row[csvColumn] !== null &&
                row[csvColumn] !== undefined &&
                row[csvColumn] !== ''
            ).length;

            return {
                fieldKey,
                csvColumn,
                completeness: (nonEmptyCount / fileData?.length) * 100,
                nonEmptyCount,
                totalCount: fileData?.length
            };
        });

        return {
            totalBluePhones: fileData?.length,
            mappedFields: mappedFields.length,
            totalFields: BLUE_PHONE_FIELDS.length,
            missingRequired,
            fieldCompleteness
        };
    }, [fileData, columnMappings, BLUE_PHONE_FIELDS]);
    return (
        <div className="bp-third-page-wrapper">
            <div className="bp-third-page-header">
                <h1 className="bp-third-page-title">Blue Phone Creation Summary</h1>
                <p className="bp-third-page-subtitle">Review the blue phones that will be created from your data</p>
            </div>

            <div className="bp-third-page-stats-grid">
                <div className="bp-third-page-stat-blue">
                    <div className="bp-third-page-stat-content">
                        <Users className="bp-third-page-stat-icon-blue" />
                        <div>
                            <h3 className="bp-third-page-stat-value-blue">{profileSummary.totalBluePhones}</h3>
                            <p className="bp-third-page-stat-label-blue">Blue Phones to Create</p>
                        </div>
                    </div>
                </div>

                <div className="bp-third-page-stat-green">
                    <div className="bp-third-page-stat-content">
                        <CheckCircle className="bp-third-page-stat-icon-green" />
                        <div>
                            <h3 className="bp-third-page-stat-value-green">{profileSummary.mappedFields}</h3>
                            <p className="bp-third-page-stat-label-green">Fields Mapped</p>
                        </div>
                    </div>
                </div>

                <div className="bp-third-page-stat-purple">
                    <div className="bp-third-page-stat-content">
                        <Eye className="bp-third-page-stat-icon-purple" />
                        <div>
                            <h3 className="bp-third-page-stat-value-purple">{Math.round((profileSummary.mappedFields / profileSummary.totalFields) * 100)}%</h3>
                            <p className="bp-third-page-stat-label-purple">Completion</p>
                        </div>
                    </div>
                </div>
            </div>

            {profileSummary.missingRequired.length > 0 && (
                <div className="bp-third-page-missing-alert">
                    <div className="bp-third-page-missing-alert-header">
                        <AlertTriangle className="bp-third-page-missing-alert-icon" />
                        <span className="bp-third-page-missing-alert-title">Action Required</span>
                    </div>
                    <p className="bp-third-page-missing-alert-message">
                        You must map the following required fields before proceeding: {
                            profileSummary.missingRequired
                                .map((field: any) => BLUE_PHONE_FIELDS.find((f: any) => f.key === field)?.label)
                                .join(', ')
                        }
                    </p>
                </div>
            )}

            <div className="bp-third-page-submit-container">
                <button
                    type="button"
                    className="bp-third-page-submit-btn"
                    onClick={handleSubmit}
                    disabled={profileSummary.missingRequired.length > 0}
                >
                    {profileSummary.missingRequired.length > 0 ? (
                        <div className="bp-third-page-submit-btn-content">
                            <AlertTriangle className="bp-third-page-submit-btn-icon" />
                            <span>Complete Required Fields</span>
                        </div>
                    ) : (
                        <div className="bp-third-page-submit-btn-content">
                            <CheckCircle className="bp-third-page-submit-btn-icon" />
                            <span>Confirm</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}