import liveblocks from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function POST(request: Request) {

  const clerkUser = await currentUser();
  if(!clerkUser) redirect("/sign-in");
  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
  // Get the current user from your database
  const user = {
    id,
    info: {
      id: clerkUser.id,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: clerkUser.emailAddresses[0].emailAddress,
      avatar: clerkUser.imageUrl,
      color: getUserColor(id)
    }
  };

  
  
  // Authorize the user and return the result
  const { status, body } = await liveblocks.identifyUser({
    userId:user.info.email,
    groupIds:[]
  },
  {
    userInfo: user.info
  }
);
  return new Response(body, { status });
}