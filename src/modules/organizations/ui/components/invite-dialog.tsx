import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCRPC } from "@/lib/convex/crpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const InviteDialog = () => {
  const crpc = useCRPC();

  const { data: activeOrganization } = useQuery(crpc.organization.getActiveOrganization.queryOptions());

  const invite = useMutation(crpc.organization.invite.mutationOptions({
    meta: { errorMessage: "Failed to invite user" },
    onSuccess: () => {
      toast.success("User invited");
      setEmail("");
    },
    onError: () => {
      toast.error("Failed to invite user");
    },
  }));

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    invite.mutate({ email, role: "member" });
  }

  const generateLink = useMutation(crpc.organization.generateLink.mutationOptions({
    meta: { errorMessage: "Failed to generate link" },
    onSuccess: () => {
      toast.success("Link generated");
    },
    onError: () => {
      toast.error("Failed to generate link");
    },
  }));

  const handleGenerateLink = () => {
    generateLink.mutate({});
  }

  const handleCopyCode = () => {
    if (!activeOrganization?.code) return;

    navigator.clipboard.writeText(activeOrganization.code as string);
    toast.success("Code copied to clipboard");
  }

  const handleCopyLink = () => {
    if (!activeOrganization?.link) return;

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${activeOrganization.link}`;

    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite</Button>
      </DialogTrigger>
      <DialogContent className="p-4 max-w-md">
        <DialogHeader>
          <DialogTitle>Invite</DialogTitle>
        </DialogHeader>

        <div>
          <p>Code: {activeOrganization?.code}</p>
          <p>Link: {activeOrganization?.link}</p>
        </div>

        <div>
          <Button onClick={handleCopyCode}>Copy Code</Button>
          <Button onClick={handleCopyLink}>Copy Link</Button>
        </div>

        <div>
          <Button onClick={handleGenerateLink}>Generate Link</Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Button type="submit">Invite</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}