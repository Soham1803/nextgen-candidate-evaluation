'use client';

import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        
        <Button 
          className="w-full"
          onClick={() => window.location.href = '/api/auth/google'}
        >
          Sign in with Google
        </Button>

        <Button 
          className="w-full"
          onClick={() => window.location.href = '/api/auth/github'}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  )
}