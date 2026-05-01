import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-12">
      <SignIn />
    </div>
  );
}
