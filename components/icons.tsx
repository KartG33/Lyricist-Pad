
import React from 'react';

// A utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PlusIcon: React.FC<IconProps> = (props) => (
  <svg {...props} className={cn("h-6 w-6", props.className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg {...props} className={cn("h-5 w-5", props.className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <svg {...props} className={cn("h-5 w-5", props.className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
    <svg {...props} className={cn("h-5 w-5", props.className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104l-1.12 2.24a1 1 0 00.894 1.464h2.24a1 1 0 00.894-1.464l-1.12-2.24a1 1 0 00-1.788 0zM12 18.75l-1.12 2.24a1 1 0 00.894 1.464h2.24a1 1 0 00.894-1.464l-1.12-2.24a1 1 0 00-1.788 0zM3.104 9.75l2.24-1.12a1 1 0 011.464.894v2.24a1 1 0 01-1.464.894l-2.24-1.12a1 1 0 010-1.788zM18.75 12l2.24-1.12a1 1 0 011.464.894v2.24a1 1 0 01-1.464.894l-2.24-1.12a1 1 0 010-1.788zM12 2.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 21a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V21.75a.75.75 0 01.75-.75zM3.75 12a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM21 12a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H21.75a.75.75 0 01-.75-.75z" />
    </svg>
);
