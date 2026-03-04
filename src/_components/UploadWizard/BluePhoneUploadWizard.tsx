import "./BluePhoneUploadWizard.css"
import { useState, useEffect } from "react";
import StepIndicator from "../StepIndicator/StepIndicator";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Button from "../Button/Button";
import UploadPage from "./BluePhonePages/UploadPage/UploadPage";
import SecondPage from "./BluePhonePages/SecondPage/SecondPage";
import ThirdPage from "./BluePhonePages/ThirdPage/ThirdPage";
import FourthPage from "./BluePhonePages/FourthPage/FourthPage";

import { parseExcel, parseCSV } from "./HelperFunctions/parse";
import { BLUE_PHONE_FIELDS } from "./HelperFunctions/types";

interface ValidationError {
    row: number;
    column: string;
    value: any;
    field: string;
    message: string;
}

interface BluePhoneUploadWizardProps{
    setModalSize: any
}

export default function BluePhoneUploadWizard(props: BluePhoneUploadWizardProps){
    const {setModalSize} = props;
    const [activeStep, setActiveStep] = useState(1);
    const [fileData, setFileData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
   const suggestColumnMappings = (detectedColumns: string[]) => {
        const suggestions: Record<string, string> = {};

        detectedColumns.forEach(col => {
            const normalizedCol = col.toLowerCase().replace(/[\s_-]/g, '');

            BLUE_PHONE_FIELDS.forEach(field => {
                const normalizedKey = field.key.toLowerCase().replace(/[\s_-]/g, '');
                const normalizedLabel = field.label.toLowerCase().replace(/[\s_-]/g, '');

                if (normalizedCol === normalizedKey || normalizedCol === normalizedLabel) {
                    suggestions[field.key] = col;
                }
            });
        });

        return suggestions;
    };

    const handleFileUpload = (event: any) => {
        const selectedFile = event.target.files?.[0];
        setFile(selectedFile);
        setParseError(null);

        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

        const parseFileProps = {
                file: selectedFile,
                setIsProcessing,
                setParseError,
                setActiveStep,
                setFileData,
                setColumns,
                suggestColumnMappings,
                setColumnMappings
            }

        if (fileExtension === 'csv') {
            parseCSV(parseFileProps);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          
            parseExcel(parseFileProps);
        } else {
            setParseError('Unsupported file format. Please upload a CSV or Excel file.');
        }
        console.log(fileData)
    };

    const validateColumnData = (fieldKey: string, csvColumn: string): ValidationError[] => {
        const field = BLUE_PHONE_FIELDS.find(f => f.key === fieldKey);
        const validation = field?.validation;

        if (!validation) return [];

        const errors: ValidationError[] = [];

        (fileData as Record<string, any>[])?.forEach((row, index) => {
            const value = row[csvColumn];

            if (!value || value === '') return;

            const stringValue = String(value).trim();

            if (validation.type === 'number') {
                const num = parseFloat(stringValue);
                if (isNaN(num)) {
                    errors.push({
                        row: index + 1,
                        column: csvColumn,
                        value: stringValue,
                        field: field?.label || fieldKey,
                        message: validation.errorMessage || `Invalid value for ${field?.label}`
                    });
                }
            }
        });

        return errors;
    };
    const validateAllMappings = (): ValidationError[] => {
        const allErrors: ValidationError[] = [];

        Object.entries(columnMappings).forEach(([fieldKey, csvColumn]) => {
            const fieldErrors = validateColumnData(fieldKey, csvColumn);
            allErrors.push(...fieldErrors);
        });

        return allErrors;
    };

    useEffect(() => {
        if (Object.keys(columnMappings).length > 0) {
            const errors = validateAllMappings();
            setValidationErrors(errors);
        }
    }, [columnMappings, fileData]);
    const getRequiredMappings = () => {
        return BLUE_PHONE_FIELDS.filter(field => field.required);
    };
    const getMissingRequiredMappings = () => {
        const required = getRequiredMappings();
        return required.filter(field => !columnMappings[field.key]);
    };

    const canProceed = () => {
        return getMissingRequiredMappings().length === 0 && validationErrors.length === 0;
    };

    const handleMappingChange = (profileField: string, csvColumn: string) => {
        setColumnMappings(prev => {
            const newMappings = { ...prev };

            Object.keys(newMappings).forEach(key => {
                if (newMappings[key] === csvColumn && key !== profileField) {
                    delete newMappings[key];
                }
            });

            if (csvColumn === '') {
                delete newMappings[profileField];
            } else {
                newMappings[profileField] = csvColumn;
            }

            return newMappings;
        });
    };

    useEffect(()=>{
        if(activeStep == 1){
            setModalSize("small")
            console.log("setting to small")
        }
        if(activeStep == 2){
            setModalSize("extraLarge")
            console.log("setting to large")
        }
    },[activeStep])
    return(
        <div className="bluephone-upload-container">
            <div className="bluephone-upload-content">
            <StepIndicator activeStep={activeStep} totalSteps={4} />

            {activeStep == 1 && (
                <UploadPage 
                file={file}
                parseError={parseError}
                handleFileUpload={handleFileUpload}
                title="Upload Blue Phones" 
                accept=".csv,.xlsx,.xls"
                />
            )}

            {activeStep == 2 && (
                <SecondPage
                        fileData={fileData}
                        columns={columns}
                        columnMappings={columnMappings}
                        handleMappingChange={handleMappingChange}
                        getMissingRequiredMappings={getMissingRequiredMappings}
                        BLUE_PHONE_FIELDS={BLUE_PHONE_FIELDS}
                        validationErrors={validationErrors}
                    />
            )}

            {activeStep == 3 && (
                <ThirdPage/>
            )}

            {activeStep == 4 && (
                <FourthPage/>
            )}
            
            </div>
             <div className="upload-blue-phone-nav-container">
                    <Button
                        variant="large"
                        onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                        className="upload-blue-phone-nav-button"
                    >
                        <ChevronLeft className="upload-blue-phone-nav-icon" />
                    </Button>

                    <div className="upload-blue-phone-step-info">
                        <span>Step {activeStep} of 4</span>
                    </div>

                    <Button
                        variant="large"
                        onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
                        disabled={!file && activeStep == 1}
                        className="upload-blue-phone-nav-button"
                    >
                        <ChevronRight className="upload-blue-phone-nav-icon" />
                    </Button>
                </div>
        </div>
    );
}