import './InputDropDown.css'
import {useState, useMemo} from 'react';
import {ChevronDown} from 'lucide-react';

interface Option{
    id: string;
    value: any;
}

interface InputDropDownProps{
    id?: string;
    label?: string;
    options: Option[];
    placeholder?: string;
    includeNoneOption?: boolean;
    noneOptionLabel?: string;
    onChange?: (value: Option) => void;
}

export default function InputDropDown(props:InputDropDownProps){
    const {id, 
        label, 
        options, 
        placeholder = "Select an option", 
        onChange, 
        includeNoneOption = false,
        noneOptionLabel = "None"
    } = props;

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const allOptions = useMemo(() => {
        if (includeNoneOption) {
            return [...options,{ id: '__none__', value: noneOptionLabel }];
        }
        return options;
    }, [options, includeNoneOption, noneOptionLabel]);

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return(
        <div className="input-dropdown-container">
            {label && (
                <label htmlFor={id} className="dropdown-label">
                    {label}
                </label>
            )}
            <div className="dropdown-wrapper">
                <button
                    id={id}
                    type="button"
                    className="dropdown-button"
                    onClick={toggleDropdown}
                >
                    <span className={selectedOption ? "dropdown-selected" : "dropdown-placeholder"}>
                        {selectedOption ? selectedOption.value : placeholder}
                    </span>
                    <ChevronDown 
                        className={`dropdown-icon ${isOpen ? 'dropdown-icon-open' : ''}`}
                    />
                </button>
                
                {isOpen && (
                    <div className="dropdown-menu">
                        {allOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`dropdown-option ${selectedOption?.id === option.id ? 'dropdown-option-selected' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}