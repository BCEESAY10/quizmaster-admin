import { useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const CreateCategoryModal = ({showModal, onClose, onSuccess}) => {
    const [form, setForm] = useState({
        name: "",
        icon: "",
        questions: 0,
        color: "",
    });

    const handleChange = (e) => {
        setForm({...form, [e.target.value]});

        const handleSubmit = async (e) => {
            e.preventDefault();

            console.log("Create category");

            onSuccess();
            onClose();

            setForm({
                name: "",
                icon: "",
                questions: 0,
                color: ""
            })
        }
    }

    return (
        <Drawer open={showModal} onClose={onClose} direction="top" className="p-6 rounded-lg m-auto w-full">
        </Drawer>
    );
};

export default CreateCategoryModal;
