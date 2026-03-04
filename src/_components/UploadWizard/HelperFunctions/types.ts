


export const BLUE_PHONE_FIELDS = [
    {key: 'code', label: 'Code', required: true},
    {key: 'latitude', label: 'Latitude', required: true,  validation: {
            type: 'number' as const,
            errorMessage: 'Must be a valid number',
            transform: (value: any) => {
                const num = parseFloat(value);
                return isNaN(num) ? value : num;
            }
    }},
    {key: 'longitude', label: 'Longitude', required: true, validation: {
            type: 'number' as const,
            errorMessage: 'Must be a valid number',
            transform: (value: any) => {
                const num = parseFloat(value);
                return isNaN(num) ? value : num;
            }
    }},
    {key: 'identifier', label: 'Identifier', required: true},
    {key: 'abbreviation', label: 'Abbreviation', required: true},
    {key: 'name', label: 'Name', required: true},
    {key: 'shortDescription', label: 'Short Description', required: false},
    {key: 'longDescription', label: 'Long Description', required: false},
    {key: 'addressLine1', label: 'Address Line 1', required: false},
    {key: 'addressLine2', label: 'Address Line 2', required: false},
    {key: 'city', label: 'City', required: false},
    {key: 'stateAbbreviation', label: 'State Abbreviation', required: false},
    {key: 'zipcode', label: 'Zipcode', required: false},
]