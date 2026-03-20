"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Mr. Raja";
  const userImage = session?.user?.image || "";

  return (
    <div className="w-full bg-white h-[100px] flex items-center justify-end px-8 bg-transparent">
    

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#131313]">{userName}</span>
        <Avatar className="h-10 w-10 border border-[#E7E7E7]">
          <AvatarImage src={userImage || "https://github.com/shadcn.png"} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
