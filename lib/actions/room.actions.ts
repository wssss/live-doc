"use server";

import { nanoid } from "nanoid";
import liveblocks from "@/lib/liveblocks";
import { RoomAccesses } from "@liveblocks/node";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();
    
    try{
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled",
        }

        const usersAccesses:RoomAccesses = {
            [email]: ["room:write"]
        };

        const room = await liveblocks.createRoom(roomId,{
            metadata,
            usersAccesses,
            defaultAccesses: []
        });
        console.log(room)

        revalidatePath("/");
        return parseStringify(room);
    }catch(error){
        console.log(error);
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string,     userId: string }) => { 
    try{
        const room = await liveblocks.getRoom(roomId);

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        
        // if(!hasAccess) {
        //     throw new Error("You do not have access to this room");
        // };
        
        return parseStringify(room);
    }catch(error){
        console.log(error);
    }
}

export const updateDocument = async ({ roomId, title }: { roomId: string, title: string }) => {
    try{
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });
        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);
    }catch(error){
        console.log(error);
    }
}

export const getDocuments = async (email: string) => { 
    try{
        const rooms = await liveblocks.getRooms({userId: email});

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        
        // if(!hasAccess) {
        //     throw new Error("You do not have access to this room");
        // };
        
        return parseStringify(rooms);
    }catch(error){
        console.log(error);
    }
}