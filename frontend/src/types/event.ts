// types/event.ts
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    image: string;
    category: string;
    tags: string[];
    capacity: number;
    registered: number;
    organizer: {
      name: string;
      email: string;
      phone: string;
    };
    schedule: {
      time: string;
      activity: string;
    }[];
    isPastEvent?: boolean;
  }