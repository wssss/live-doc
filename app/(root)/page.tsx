import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedIn,  UserButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import AddDocumentBtn from "@/components/ui/AddDocumentBtn";
import { redirect } from "next/navigation";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";

export default async function Home() {
  const clerkUser = await currentUser();
  if(!clerkUser) return redirect("/sign-in");

  const documents = await getDocuments(clerkUser.emailAddresses[0].emailAddress);
  return (
  <div>
    <main className="home-container">
      <Header className="sticky top-0 left-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notifications
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      { documents.data.length > 0 ? (
        <div className="document-list-container">
            <div className="document-list-title">
                <h3 className="text-28-semibold">All Documents</h3>
                <AddDocumentBtn
                    userId={clerkUser.id}
                    email={clerkUser.emailAddresses[0].emailAddress} />
            </div>

            <ul className="document-ul">
                {documents.data.map(({id, metadata, createdAt}: any) => (
                    <li key={id} className="document-list-item">
                        <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-2">
                            <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                                <Image src="/assets/icons/doc.svg" 
                                alt="flie" width={40} height={40} />
                            </div>
                            <p className="space-y-1">
                                <p className="line-clamp-1 text-lg ">
                                    {metadata.title}
                                </p>
                                <p className="text-sm font-light text-blue-100"> 
                                    Created {dateConverter(createdAt)}
                                </p>
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
      ):(
        <div className="document-list-empty">
          <Image src="/assets/icons/doc.svg" 
          alt="Empty Document" width={40} height={40} className="mx-auto"/>
          
        <AddDocumentBtn
          userId={clerkUser.id}
          email={clerkUser.emailAddresses[0].emailAddress} />
        </div>
      )}
    </main>
  </div>
  );
}
