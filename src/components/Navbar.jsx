import { Menu } from 'lucide-react';
export default function Navbar(){
  return <div className='md:hidden flex items-center justify-between p-4 bg-[#2f346d] text-white'><h1 className='font-bold'>FleetManager</h1><Menu/></div>
}