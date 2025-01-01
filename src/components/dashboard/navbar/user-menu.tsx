"use client";

import { signOut } from "@/app/actions/actions";
import { LogOut } from "lucide-react";

import { User } from "@supabase/auth-js/dist/module/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export default function UserMenu({ user }: { user: User }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.user_metadata.avatar_url}
							alt={user.user_metadata.full_name}
						/>
						<AvatarFallback>
							{user.user_metadata.full_name.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			{/* User info section */}
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex flex-col p-4 pb-2">
					<div className="flex items-start gap-4">
						<Avatar className="h-12 w-12 border-2 border-primary/10">
							<AvatarImage
								src={user.user_metadata.avatar_url}
								alt={user.user_metadata.full_name}
							/>
							<AvatarFallback className="text-lg">
								{user.user_metadata.full_name.charAt(0)}
							</AvatarFallback>
						</Avatar>

						<div className="flex flex-col space-y-1 overflow-hidden">
							<p className="font-semibold truncate">
								{user.user_metadata.full_name}
							</p>
							<p className="text-sm text-muted-foreground truncate">
								{user.email}
							</p>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
					onClick={async () => {
						signOut();
					}}
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
