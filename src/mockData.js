// src/mockData.js

export const initialEventsData = [
  {
    id: 1,
    type: 'Hackathon',
    name: 'MEDHA 2025 - Medical Device Hackathon',
    location: 'GHRCE, Nagpur',
    date: 'Sept 19-20, 2025',
    image: 'https://placehold.co/600x400/5227FF/FFFFFF?text=Med-Tech',
    description: 'A premier hackathon focused on creating innovative solutions for the healthcare industry.',
    registerLink: '#'
  },
  // ... other initial events
];

export const initialTeamsData = [
  {
    id: 1,
    name: 'Code Wizards',
    eventName: 'for CodeStorm Hackathon',
    description: 'Aiming to build a revolutionary project management tool with AI.',
    lookingFor: ['React Dev', 'UI/UX Designer', 'Python Dev'],
    members: [ /* member URLs */ ],
  },
  // ... other initial teams
];
// You can expand these arrays with more mock data as needed