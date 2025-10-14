import Link from 'next/link';
import { TiSocialLinkedin,TiSocialInstagram  } from "react-icons/ti";
import { IoMdMail } from "react-icons/io";
function Header() {

  return (
    <div>
          <div className='bg-gray-900 h-5 mt-0 sm:h-8 flex items-center z-30 w-full fixed'>
             <ul className='flex flex-row ml-[10%]  items-center'>
             <a href="#"> <li  className='ml-8 hover:scale-50 hover:bg-black   '><TiSocialLinkedin /></li></a>
              <li className='ml-8 hover:scale-50 hover:bg-black  ' ><a href="#"><TiSocialInstagram /></a></li>
              <li className='ml-8 hover:scale-50 hover:bg-black  '><a href="#"><IoMdMail /></a></li>

             </ul>
          </div>
      <header className={` h-24 sm:h-32 flex mt-1 items-center z-30 w-full fixed`}>
    

        <div className=" bg-white  container mx-auto px-6 w-full flex items-center justify-between">
          <div className="uppercase text-gray-800 font-black text-3xl">
            SENKEUYYIT
          </div>
          <div className="flex items-center">
            <nav className="font-sen  text-gray-800 uppercase text-lg lg:flex items-center hidden">
            
                <a href="/#home" className="py-2 px-6 flex hover:font-bold scroll-smooth transition 40">Home</a>
             
  
                <a href="/#about" className="scroll-smooth duration-75 py-2 px-6 flex hover:font-bold transition 40">About</a>
            
              
                <a  href="/#contact" className="py-2 px-6 flex hover:font-bold scroll-smooth transition 40">Contact</a>
            
               
                <a href="sign-up" className="py-2 px-6 flex hover:font-bold transition 40">Sign up</a>
          
              <div className="py-2 px-6 flex">
                <div className="relative inline-flex group">
                  <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#031438] to-[#080325] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                  
                    <a href="sign-in"
                      title="Get quote now"
                      className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      role="button"
                    >
                      Sign in
                    </a>
                
                </div>
              </div>
            </nav>
            <button className="lg:hidden flex flex-col ml-4">
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;