"use client";

import Link from "next/link";
import type { User } from "@saasfly/auth";
import { useClerk } from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";

import { UserAvatar } from "~/components/user-avatar";
import { hasClerkConfigured } from "~/lib/clerk-config";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
  params: {
    lang: string;
  };
  dict: Record<string, string>;
}

function UserAccountMenu({
  user,
  lang,
  dict,
  onSwitchAccount,
  onSignOut,
}: {
  user: Pick<User, "name" | "image" | "email">;
  lang: string;
  dict: Record<string, string>;
  onSwitchAccount?: () => void;
  onSignOut?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name ?? null, image: user.image ?? null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard`}>{dict.dashboard}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/shell`}>Shell</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/brand-kit`}>Brand kit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/billing`}>{dict.billing}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/settings`}>{dict.settings}</Link>
        </DropdownMenuItem>
        {onSwitchAccount || onSignOut ? (
          <>
            <DropdownMenuSeparator />
            {onSwitchAccount ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                  onSwitchAccount();
                }}
              >
                Use a different account
              </DropdownMenuItem>
            ) : null}
            {onSignOut ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                  onSignOut();
                }}
              >
                {dict.sign_out}
              </DropdownMenuItem>
            ) : null}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAccountNavWithClerk({
  user,
  params: { lang },
  dict,
}: UserAccountNavProps) {
  const { signOut } = useClerk();

  return (
    <UserAccountMenu
      user={user}
      lang={lang}
      dict={dict}
      onSwitchAccount={() => {
        signOut({ redirectUrl: `/${lang}/login-clerk` }).catch((error) => {
          console.error("Error during sign out:", error);
        });
      }}
      onSignOut={() => {
        signOut({ redirectUrl: `/${lang}` }).catch((error) => {
          console.error("Error during sign out:", error);
        });
      }}
    />
  );
}

export function UserAccountNav(props: UserAccountNavProps) {
  if (!hasClerkConfigured()) {
    return (
      <UserAccountMenu
        user={props.user}
        lang={props.params.lang}
        dict={props.dict}
      />
    );
  }

  return <UserAccountNavWithClerk {...props} />;
}
