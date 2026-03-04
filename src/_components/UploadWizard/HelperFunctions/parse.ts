import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ParseFileProps{
    file: File,
    setIsProcessing: any,
    setParseError: any,
    setActiveStep: any,
    setFileData: any,
    setColumns: any,
    suggestColumnMappings: any,
    setColumnMappings: any
}

export const parseExcel = (props: ParseFileProps) => {
        const{file, setIsProcessing, setParseError, setActiveStep, setFileData, setColumns, suggestColumnMappings, setColumnMappings} = props;

        setIsProcessing(true);
        setParseError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const worksheetName = workbook.SheetNames[0];
                if (!worksheetName) {
                    throw new Error('No worksheets found in the Excel file');
                }
                const worksheet = workbook.Sheets[worksheetName];

                if (!worksheet) {
                    throw new Error('Worksheet is empty or invalid');
                }

                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    blankrows: false
                }) as any[][];

                if (jsonData.length < 2) {
                    throw new Error('Excel file must have at least a header row and one data row');
                }

                const headers = jsonData[0]?.map((header: any) =>
                    String(header || '').trim()
                ).filter(header => header !== '') || [];

                const dataRows = jsonData.slice(1).filter(row =>
                    row.some(cell => cell !== null && cell !== undefined && cell !== '')
                ).map(row => {
                    const rowObj: any = {};
                    headers.forEach((header, index) => {
                        rowObj[header] = row[index] !== undefined ? row[index] : '';
                    });
                    return rowObj;
                });

                if (dataRows.length === 0) {
                    throw new Error('No valid data rows found in the Excel file');
                }

                setFileData(dataRows);
                setColumns(headers);

                const suggestions = suggestColumnMappings(headers);
                setColumnMappings(suggestions);

                setActiveStep(2);
            } catch (error) {
                setParseError(error instanceof Error ? error.message : 'Failed to parse Excel file');
            } finally {
                setIsProcessing(false);
            }
        };

        reader.onerror = () => {
            setParseError('Failed to read Excel file');
            setIsProcessing(false);
        };

        reader.readAsArrayBuffer(file);
};

 export const parseCSV = (props: ParseFileProps) => {
        const{file, setIsProcessing, setParseError, setActiveStep, setFileData, setColumns, suggestColumnMappings, setColumnMappings} = props;
        setIsProcessing(true);
        setParseError(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            delimitersToGuess: [',', '\t', '|', ';'],
            complete: (results) => {
                try {
                    if (results.errors && results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors);
                    }

                    const cleanedData = results.data.filter((row: any) =>
                        row && typeof row === 'object' && Object.keys(row).some(key =>
                            row[key] !== null && row[key] !== undefined && row[key] !== ''
                        )
                    );

                    if (cleanedData.length === 0) {
                        throw new Error('No valid data found in the file');
                    }

                    const headers = Object.keys(cleanedData[0] || {}).map(header =>
                        header.trim()
                    );

                    setFileData(cleanedData);
                    setColumns(headers);

                    const suggestions = suggestColumnMappings(headers);
                    setColumnMappings(suggestions);

                    setActiveStep(2);
                } catch (error) {
                    setParseError(error instanceof Error ? error.message : 'Failed to parse CSV file');
                } finally {
                    setIsProcessing(false);
                }
            },
            error: (error) => {
                setParseError(`CSV parsing error: ${error.message}`);
                setIsProcessing(false);
            }
        });
    };