import { Suspense } from "react";
import AuthForm from "../../components/marketplace/AuthForm";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
