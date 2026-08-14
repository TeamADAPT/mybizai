"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@saasfly/auth";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { toast } from "@saasfly/ui/use-toast";

import { userNameSchema } from "~/lib/validations/user";
import { trpc } from "~/trpc/client";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">;
}

type FormData = z.infer<typeof userNameSchema>;

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    try {
      const response = await trpc.customer.updateUserName.mutate({
        name: data.name,
        userId: user.id,
      });

      if (!response?.success) {
        return toast({
          title: "Something went wrong.",
          description: "Your name was not updated. Please try again.",
          variant: "destructive",
        });
      }

      toast({
        description: "Your name has been updated.",
      });
      router.refresh();
    } catch {
      toast({
        title: "Could not save",
        description: "Workspace API unavailable in this environment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card className="border-brand-gold/25 bg-brand-ink/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-light tracking-tight">
            Display name
          </CardTitle>
          <CardDescription>
            Shown in the assist dock and workspace chrome.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid max-w-md gap-2">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="rounded-full border-border bg-background/70"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-brand-orange">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(
              buttonVariants(),
              "rounded-full bg-brand-orange text-brand-midnight hover:bg-brand-orange-soft",
            )}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
