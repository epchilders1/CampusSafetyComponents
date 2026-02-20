'use client'
import { useState } from 'react';
import HeroImageEditor from './_components/HeroImageEditor/HeroImageEditor';
import MarkdownEditor from './_components/MarkdownEditor/MarkdownEditor';
import Input from './_components/Input/Input';
import Button from './_components/Button/Button';
import List from './_components/List/List';
import Modal from './_components/Modal/Modal'
import InputDropDown from './_components/InputDropdown/InputDropdown';
import TextArea from './_components/TextArea/TextArea';
import Navbar from './_components/Navbar/Navbar';
import Map from './_components/Map/Map';
import {Toaster, toast} from "react-hot-toast"
import type { MapShape } from './_components/Map/Map';
import CampusNow from './pages/CampusNow/CampusNow';

import './App.css'

export default function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const sampleListItems = [
    {id: "1", title: "Example Hall 1", subtitle: "Landmark"},
    {id: "2", title: "Example Hall 2", subtitle: "Landmark"},
    {id: "3", title: "Example Hall 3", subtitle: "Landmark"},
    {id: "4", title: "Example Category 1", subtitle: "Landmark Category"},
    {id: "5", title: "Example Category 2", subtitle: "Landmark Category"},
    {id: "6", title: "Example Category 3", subtitle: "Landmark Category"},
  ]
  const sampleDropdownItems=[
    {id: "1", value: 1},
    {id: "2", value: 2}
  ]

  const INITIAL_SHAPES: MapShape[] = [
      {
          id: "1",
          title: "Red Zone",
          color: "#E53D3D",
          path: [
              { lat: 33.2108, lng: -87.5661 },
              { lat: 33.2112, lng: -87.5655 },
              { lat: 33.2105, lng: -87.5650 },
              { lat: 33.2102, lng: -87.5658 },
          ]
      },
      {
          id: "2",
          title: "Blue Zone",
          color: "#3D85E5",
          path: [
              { lat: 33.2120, lng: -87.5600 },
              { lat: 33.2125, lng: -87.5590 },
              { lat: 33.2115, lng: -87.5585 },
          ]
      }
  ];

  const handleSaveHeroImage = async (file: File | null) => {
    try{

        // Some sort of procedure to save file to cloud storage, archive previous file etc.
    }
    catch(error){
      if(error instanceof Error){
          throw new Error(`Failed to save ${file?.name}. ${error.message}`);
      }
    }
  };

  const selectListItem = (id: string) => {
    toast.success(`Selected list item with id: ${id}`)
  }

  const campusNowMarkdownInfo = {
    headline:"Example Headline",
    markdown: "- Campus Now Page!!!",
    onChange: (newMarkdown: string) => console.log("New markdown:", newMarkdown)
  }

  const forecastOptions = {
    showTodaysForecast: true,
    show7DayForecast: true
  }

  return (
    <div>
      <Navbar/>
      <Toaster/>
      <h1>Campus Safety Components</h1>
      <div className="app-container">
        <div className="hero-image-editor-container">
          <h2>Hero Image Editor</h2>
          <HeroImageEditor 
            currentImage="./image.png"
            saveImage={handleSaveHeroImage}
          />
        </div>
        <div className="markdown-editor-container">
          <h2>Markdown Editor</h2>
          <MarkdownEditor onChange = {(newMarkdown: string) => console.log("New markdown:", newMarkdown)} headline="Welcome to Campus Safety" markdown={"# Hello World\n\nThis is a markdown editor."} />
        </div>
        <div className="button-container">
          <h2>Button Component</h2>

          <Button variant="red" className="test-button">
            Red Button
          </Button>
          <Button variant="green" className="test-button">
            Green Button
          </Button>
          <Button variant="blue" className="test-button">
            Blue Button
          </Button>
          <Button variant="yellow" className="test-button">
            Yellow Button
          </Button>
          <Button variant="gray" className="test-button">
            Gray Button
          </Button>
        </div>
        <div className="input-container">
          <h2>Input Component</h2>
          <Input id="test-input" label="Phone Number" placeHolder="(123)-456-7890" />
        </div>
        <div className="list-container">
          <h2>List Component</h2>
          <List items={sampleListItems} onSelect={selectListItem} />
        </div>
        <div className="modal-container">
          <h2>Modal Component</h2>
          <Button 
          variant="blue"
          onClick={()=>setModalIsOpen(!modalIsOpen)}
          >
            Open Modal
          </Button>
          <Modal showModal={modalIsOpen} setShowModal={setModalIsOpen}> 
              <h1>Example Modal Content</h1>
          </Modal>
        </div>
        <div className="input-dropdown-container">
              <h2>Input Dropdown Component</h2>
              <InputDropDown includeNoneOption={true} options={sampleDropdownItems}/>
        </div>
        <div className="text-area-container">
              <h2>Text Area Component</h2> 
              <TextArea label="Description" placeHolder="Some text here..." lockXExpansion={true}/>
        </div>
      </div>
      <div className="map-container">
          <h2>Map Component</h2>
          <Map areas={INITIAL_SHAPES} type ="area"/>
      </div>
      <div>
        <CampusNow markdownInfo={campusNowMarkdownInfo} forecastOptions={forecastOptions}/>
      </div>
    </div>
  );
}