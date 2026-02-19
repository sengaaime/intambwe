import React from 'react';
import { InstallPrompt } from './InstallPrompt';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-forest-50 relative overflow-hidden">
      {/* Top Imigongo Border */}
      <div className="w-full h-6 imigongo-border-top z-50 fixed top-0 left-0 shadow-sm" />
      
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-12 pb-24 md:max-w-2xl lg:max-w-4xl">
        <header className="mb-8 text-center mt-8">
          <h1 className="text-4xl font-display font-bold text-forest-900 tracking-tight mb-2">
            Intambwe
          </h1>
          <p className="text-forest-700 font-medium opacity-80">
            Every step counts.
          </p>
        </header>
        {children}
      </main>

      {/* Install Prompt Overlay */}
      <InstallPrompt />

      {/* Bottom Navigation / Footer Area */}
      <footer className="w-full bg-forest-900 text-forest-100 py-6 mt-auto">
        <div className="imigongo-border-top h-4 mb-6 opacity-50 invert"></div>
        <div className="text-center text-sm opacity-60">
          <p>Made with ❤️ for Rwanda</p>
        </div>
      </footer>
    </div>
  );
}
