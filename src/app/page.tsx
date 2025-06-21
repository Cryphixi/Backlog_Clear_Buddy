import { LoginForm } from '@/components/login-form';
import { Gamepad2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <Gamepad2 className="w-16 h-16 mb-4 text-accent" />
          <h1 className="text-4xl font-bold font-headline text-primary-foreground">
            SteamTime Navigator
          </h1>
          <p className="text-muted-foreground mt-2">
            Find the perfect game for your free time.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
