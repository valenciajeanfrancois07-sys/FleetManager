export default function Modal({open,onClose,title,children}){
 if(!open) return null;
 return <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4'>
  <div className='bg-white rounded-xl p-6 w-full max-w-lg'>
   <div className='flex justify-between mb-4'><h2 className='font-bold text-xl'>{title}</h2><button onClick={onClose}>✕</button></div>{children}
  </div></div>
}