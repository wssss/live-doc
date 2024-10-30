"use client";
import React from "react";
import { Button } from "./button";
import Image from "next/image";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";


const AddDocumentBtn = ({userId, email}: AddDocumentBtnProps) => {
    const router = useRouter();

    const addDocumentHandler = async () => {
        try{
            const room = await createDocument({userId, email});
            
            if(room) router.push(`/documents/${room.id}`);
        }catch(error){
            console.log(error);
        }
    }
    return (
        <Button type="submit" onClick={addDocumentHandler}>
            <Image src="/assets/icons/add.svg" 
            alt="Add Document" width={20} height={20} />
            <p className="hidden sm:block">New Document</p>
        </Button>
    )
}

export default AddDocumentBtn;
