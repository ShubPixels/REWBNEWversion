import wastemanageimg from "../images/bluemach.webp";
import industrialimg from "../images/Cold Shearing Machine.jpg";
import specialpurpimg from "../images/Pipe Sizing and Guaging Machine.jpg";

// This will be the single source of truth for category information
export const categories = [
  { id: 0, name: 'Waste Management', image: wastemanageimg, slug: 'waste-management' },
  { id: 1, name: 'Industrial Machines', image: industrialimg, slug: 'industrial-machines' },
  { id: 2, name: 'Special Purpose Machines', image: specialpurpimg, slug: 'special-purpose-machines' },
  // Add other categories here if needed
];