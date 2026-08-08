export interface ServiceOption {
  label: string;
  description: string;
  icon: string;
  image: string;
  price: number;
  duration: string;
}

export const homeServices: ServiceOption[] = [
  { icon: "🧹", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80", label: "Bathroom Cleaning", description: "Deep clean and sanitize your bathroom with professional care.", price: 599, duration: "~45 min" },
  { icon: "🧺", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80", label: "Kitchen Cleaning", description: "Scrub, sanitize, and reset your kitchen space end to end.", price: 699, duration: "~60 min" },
  { icon: "🧼", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80", label: "Laundry & Ironing", description: "Fresh folding, pressing, and household laundry support.", price: 499, duration: "~45 min" },
  { icon: "🧽", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", label: "Household Help", description: "Trusted help for daily chores, tidying, and home upkeep.", price: 399, duration: "~60 min" },
  { icon: "🪟", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", label: "Window Cleaning", description: "Interior and exterior glass care with streak-free finish.", price: 549, duration: "~45 min" },
  { icon: "🧳", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80", label: "Packing & Unpacking", description: "Fast, careful support for home moves and seasonal resets.", price: 799, duration: "~90 min" },
];
