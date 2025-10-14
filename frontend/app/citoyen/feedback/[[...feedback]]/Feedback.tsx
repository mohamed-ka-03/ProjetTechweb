import React from 'react'

export default function Feedback() {
  return (
    <div className='home h-screen text-black'>
      
      <div className='home h-screen'>
        <div className='h-[80%] w-[80%] text-center shadow-black shadow-lg max-lg:w-[65%] bg-[#b4b7bef4] ml-32 relative top-[10%]  '>
                <h1 className='font-bold text-2xl center top-5 relative'>COMMENTAIRES</h1>

                <div className='h-[60%] w-[60%] text-center shadow-black shadow-lg max-lg:w-[35%] bg-[#b4b7bef4] ml-60 right-[5%] relative top-[20%]  '>
                    {/* <form action="" className='flex-wrap '>
                      <label htmlFor="email">Email :</label>
                      <input type="email" name="email" id="email" placeholder='email' />
                      <label htmlFor="typeCommentaire"></label>
                     <select name="typeCommentaire" id="typeCommentaire">
                        <option value="critique">Critiques</option>
                        <option value="proposition">Propositions</option>
                    
                     </select>
                    </form> */}
                </div>
        </div>
      </div>
    </div>
  )
}
