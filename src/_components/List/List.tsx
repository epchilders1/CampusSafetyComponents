"use client";
import './List.css';
import { useState, useEffect } from 'react';
import {Search, SlidersHorizontal} from "lucide-react";
import { Landmark, Frown, ArrowDownAZ, ArrowDownZA } from 'lucide-react';

interface ListItem {
    id: string;
    title: string;
    subtitle?: string;
    img?: string;
}

interface ListProps{
    items?: ListItem[];
    onSelect?: (id: string) => void;
    multiSelect?: boolean
}

const FILTERS = [
    {
        id: 'sort-az',
        label: 'Ascending',
        icon: ArrowDownAZ,
        apply: (items: ListItem[]) => [...items].sort((a, b) => a.title.localeCompare(b.title))
    },
    {
        id: 'sort-za',
        label: 'Descending',
        icon: ArrowDownZA,
        apply: (items: ListItem[]) => [...items].sort((a, b) => b.title.localeCompare(a.title))
    },

] as const;

export default function List(props: ListProps) {
    const {
        items = [],
        onSelect = () => {},
        multiSelect = false
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [filterDropdown, setFilterDropDown] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [filteredItems, setFilteredItems] = useState<ListItem[]>(items);
    const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);

    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        let newFilteredItems = items.filter(item => 
            item.title.toLowerCase().includes(lowerSearchTerm) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(lowerSearchTerm))
        );

        if (activeFilter) {
            const filter = FILTERS.find(f => f.id === activeFilter);
            if (filter) {
                newFilteredItems = filter.apply(newFilteredItems);
            }
        }

        setFilteredItems(newFilteredItems);
    }, [searchTerm, items, activeFilter]);

    const handleFilterClick = (filterId: string) => {
        setActiveFilter(activeFilter === filterId ? null : filterId);
        setFilterDropDown(false);
    };

    const handleItemClick = (item:ListItem) =>{
        if(multiSelect){
           setSelectedItems(prevItems => {
            const isSelected = prevItems.some(i => i.id === item.id);
            return isSelected
                ? prevItems.filter(i => i.id !== item.id)
                : [item, ...prevItems];
            });
        }
        else{
            setSelectedItems([item]);
        }
    }
    useEffect(() => {
        if (selectedItems.length > 0) {
            onSelect(selectedItems[selectedItems.length - 1].id);
        }
    }, [selectedItems]);

    return (
        <div className="list-container">
            <div className="input-container">
                <Search className="search-icon"/>
                <input
                    value={searchTerm}
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setFilterDropDown(!filterDropdown)}
                    className="filter-icon"
                >
                    <SlidersHorizontal/>
                </button>
            </div>
            {filterDropdown && (
                <div className="filter-container">
                    {FILTERS.map(filter => {
                        const Icon = filter.icon;
                        return (
                            <button
                                key={filter.id}
                                className={`filter-option ${activeFilter === filter.id ? 'active' : ''}`}
                                onClick={() => handleFilterClick(filter.id)}
                            >
                                <Icon size={20} />
                                <span>{filter.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
            <div className="list-content">
                {filteredItems.map((item) => (
                    <a
                        key={item.id} 
                        className={`list-item ${selectedItems.some(i=>i.id === item.id) ? `selected` : ``}`}
                        onClick={()=>handleItemClick(item)}
                    >
                        <div className="item-icon">
                            <Landmark/>
                        </div>
                        <div className="item-text">
                            <p className="item-title">{item.title}</p>
                            {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
                        </div>
                    </a>
                ))}
                {filteredItems.length === 0 && (
                    <div className="no-results-container">
                        <Frown scale={5}/>
                        <p>No results found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}