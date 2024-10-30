
"use client"
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@/components/editor/Editor";
import { Header } from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from "../ActiveCollaborators";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { Input } from "./input";
import { updateDocument } from "@/lib/actions/room.actions";
import Loader from "../Loader";


const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title || "Untitled");

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            setLoading(true);
        }
        try {
            if(documentTitle !== roomMetadata?.title) {
                const updatedRoom = await updateDocument({ roomId, title: documentTitle });
                console.log(updatedRoom);
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                updateDocument({ roomId, title: documentTitle });
            }

            
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [roomId, documentTitle]);

    useEffect(() => {
        if(editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<div>
                <Loader />
            </div>}>
                <div className="collaborative-room">
                    <Header>
                        <div ref={containerRef} className="flex items-center justify-center gap-2">
                            { editing && !loading ? (
                                <Input ref={inputRef} type="text" 
                                value={documentTitle} 
                                onChange={(e) => setDocumentTitle(e.target.value)} 
                                onKeyDown={updateTitleHandler}
                                disabled={!editing}
                                className="document-title-input"
                                />
                            ) : (
                                <p className="document-title">{documentTitle}</p>
                            )}

                            {currentUserType === 'editor' && !editing && (
                                <Image 
                                src="/assets/icons/edit.svg" 
                                alt="edit" 
                                width={24} height={24}
                                onClick={() => setEditing(true)} 
                                className="pointer"/>
                            )}

                            {currentUserType !== 'editor' && !editing && (
                                <p className="view-only">View Only</p>
                            )}    
                            {loading && <p className="loading">Saving...</p>}  
                        </div>
                        <div className="flex w-full flex-1 justify-end gap-2">
                            <ActiveCollaborators />
                        </div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>  
                    </Header>
                    <Editor roomId={roomId}  currentUserType={currentUserType}/>
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};

export default CollaborativeRoom;


