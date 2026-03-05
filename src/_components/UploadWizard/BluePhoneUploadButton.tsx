import Button from "../Button/Button";
import BluePhoneUploadWizard from "./BluePhoneUploadWizard";
import Modal from "../Modal/Modal";
import { useState } from "react";

export default function BluePhoneUploadButton(){
    const [openModal, setOpenModal] = useState(false);
    const [modalSize, setModalSize] = useState("medium")

    const handleSubmit = (bluePhones: any) => {
        try{
            console.log(bluePhones);
        }
        catch(e){
            console.error(e);
        }
    }
    return(
        <div>
            <Button variant="blue" size="large" onClick={()=>setOpenModal(!openModal)}>
                Blue Phone Upload Wizard
            </Button>
            <Modal size={modalSize} showModal={openModal} setShowModal={setOpenModal}>
                <BluePhoneUploadWizard handleSubmit={handleSubmit} setShowModal={setOpenModal} setModalSize={setModalSize}/>
            </Modal>
        </div>
    );
}