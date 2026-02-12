"use client";
import './List.css';
import { useState, useEffect } from 'react';
import {Search, SlidersHorizontal} from "lucide-react";
import { Landmark, Frown } from 'lucide-react';

interface ListItem {
    id: string;
    title: string;
    subtitle?: string;
    img?: string;
}

interface ListProps{
    items?: ListItem[];
    onSelect?: (id: string) => void;
}

export default function List(props: ListProps) {
    const {
        items = [],
        onSelect = () => {},
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState<ListItem[]>(items);

    useEffect(()=>{
        const lowerSearchTerm = searchTerm.toLowerCase();
        const newFilteredItems = items.filter(item => 
            item.title.toLowerCase().includes(lowerSearchTerm) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(lowerSearchTerm))
        );
        setFilteredItems(newFilteredItems);

    },[searchTerm, items]);

    return (
        <div className="list-container">
            <div className="input-container">
                <Search className="search-icon"/>
                <input
                    value={searchTerm}
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SlidersHorizontal className="filter-icon"/>
            </div>
            <div className ="list-content">
                {filteredItems.map((item) => (
                    <a
                        key={item.id} 
                        className="list-item"
                        onClick={() => onSelect(item.id)}
                        >
                        <div className="item-icon">
                            {/* Temporary example landmark image, normally this would be an img tag using the item's img property */}
                            {/* {item.img && <img src={item.img} alt={item.title}/>} */}
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