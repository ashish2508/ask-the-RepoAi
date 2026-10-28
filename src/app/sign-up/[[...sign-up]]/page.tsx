import { AuthShell } from "@/app/_components/auth-shell";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#5c9b64", colorBackground: "transparent" },
          elements: {
            rootBox: "w-full",
            card: "w-full bg-transparent p-0 shadow-none",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formFieldLabel: "text-foreground",
            formFieldHintText: "text-muted-foreground",
            socialButtonsBlockButton: "h-11 rounded-none border-border bg-background text-foreground shadow-none",
            formFieldInput: "h-11 rounded-none border-border bg-background text-foreground shadow-none",
            formButtonPrimary: "h-11 rounded-none bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
            footer: "border-border bg-transparent px-0",
            footerActionLink: "text-primary",
          },
        }}
      />
    </AuthShell>
  );
}
