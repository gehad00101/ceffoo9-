"use client";

import React from 'react';
import { useAppStore } from '@/hooks/use-app-store';
import { Skeleton } from '@/components/ui/skeleton';

const PersonalizedWelcomeMessage: React.FC = () => {
  const { loggedInUser, personalizedWelcome } = useAppStore();

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="text-sm text-center md:text-right text-amber-100 mb-2 md:mb-0">
      {personalizedWelcome ? (
        <p>{personalizedWelcome}</p>
      ) : (
        <Skeleton className="h-5 w-48 inline-block" />
      )}
    </div>
  );
};

export default PersonalizedWelcomeMessage;