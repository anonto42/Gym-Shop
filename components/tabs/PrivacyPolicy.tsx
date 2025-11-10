"use client";

import {useEffect, useState} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {Button} from "@/components/ui/button";
import {createAndUpdatePrivacyAndPolicyServerSide, getPrivacyAndPolicyServerSide} from "@/server/functions/admin.fun";
import {toast} from "sonner";

export default function PrivacyPolicy() {
    const [content, setContent] = useState("");

    const handleChange = (value: string) => {
        setContent(value);
    };

    useEffect(() => {
        async function fatchPrivacy () {
            const conent = await getPrivacyAndPolicyServerSide().then( e=> e.data) as string;
            setContent(conent);
        }
        fatchPrivacy().then(r => console.log(r));
    },[])

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "align",
        "list",
        "indent",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
    ];

    const updateContent = async () => {
        const formData = new FormData() as FormData & { content: string };
        formData.append("content", content);

        await createAndUpdatePrivacyAndPolicyServerSide(formData);

        toast.success("Privacy policy updated");
    }

    return (
        <div className="w-[96%] mx-auto mt-4 border h-[85vh] overflow-hidden rounded-md p-4 flex flex-col gap-4 bg-white relative">
            <h1 className={"text-3xl text-[#123499] font-semibold"}>Privacy & Policy</h1>
            {/* Editor */}
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                className="w-full h-[88%] bg-white"
                placeholder="Write your terms and conditions here..."
            />
            <Button className={"w-[80px] h-[40px] absolute bottom-10 right-10 cursor-pointer"} onClick={()=> updateContent()}>Update</Button>
        </div>
    );
}
