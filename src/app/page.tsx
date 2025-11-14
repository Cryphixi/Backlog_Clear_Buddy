import { LoginForm } from '@/components/login-form';
import { Gamepad2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
            <Gamepad2 className="relative w-16 h-16 mb-4 text-accent animate-scale-in" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-headline text-primary-foreground bg-clip-text animate-slide-up">
              Backlog Buddy
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <p className="text-sm">
                Meet Clear, your AI-powered gaming schedule assistant
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base max-w-sm">
            Connect your Steam account and let Clear create the perfect gaming schedule based on your free time.
          </p>
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
