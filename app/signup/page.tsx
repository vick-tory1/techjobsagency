import { Suspense } from "react";
import AuthForm from "../../components/marketplace/AuthForm";

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
