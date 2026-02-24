"use client";
import {useState} from 'react';
import { TextAlignJustify, X, Landmark, GraduationCap, FileText, Contact, BookOpenText, TriangleAlert, Users } from 'lucide-react';

import './Navbar.css'


export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const navItems = [
        {id: 1, name: "Landmarks", icon: <Landmark/>},
        {id: 2, name: "Campus Now", icon: <GraduationCap/>},
        {id: 3, name: "Documents", icon: <FileText/>},
        {id: 4, name: "Safety Contacts", icon: <Contact/>},
        {id: 5, name: "Campus Alerts", icon: <TriangleAlert/>},
        {id: 6, name: "Safety Guidelines", icon: <BookOpenText/>},
        {id: 7, name: "Users", icon: <Users/>}
    ]


    return(
        <>
        <div className="navbar-container">
            <button
            className="expand"
            onClick={()=>setIsOpen(!isOpen)}
            >
                {!isOpen && (
                    <TextAlignJustify/>
                )}
                {isOpen && (
                    <X/>
                )}
            </button>
            <div className="navbar-header">
                <img
                    src="./logo.jpg"
                    className="nav-logo"
                />
                <h1 className="title">Campus Safety</h1>
                <h2 className="subtitle">Admin</h2>
            </div>
        </div>
         <div className={`sidebar-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="nav-items-container">
                {navItems.map((item)=>(
                    <button 
                        className={`nav-item ${selected == item.id && 'selected'}`}
                        onClick={()=>setSelected(item.id)}
                    >
                        {item.icon}
                        <h2>{item.name}</h2>
                    </button>
                ))}
            </div>
        </div>
        </>
    );
}