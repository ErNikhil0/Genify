import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  const onSumbitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setIsImageLoaded(true)

    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      // setImage(new image here if you implement real logic)
    }, 10000)
  }

  return (
    <motion.form 
      onSubmit={onSumbitHandler} 
      className='flex flex-col min-h-[90vh] justify-center items-center'
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
        <motion.div className='relative'>
          <motion.img 
            src={image} 
            alt="" 
            className='max-w-sm rounded' 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }} 
          />
          <motion.span 
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}
            initial={{ width: 0 }} 
            animate={{ width: loading ? '100%' : '0%' }} 
            transition={{ duration: 10 }}
          />
        </motion.div>

        {loading && (
          <motion.p 
            className='text-center mt-2'
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            Loading.....
          </motion.p>
        )}
      </motion.div>

      {!isImageLoaded && 
        <motion.div 
          className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <input 
            onChange={e => setInput(e.target.value)} 
            value={input}
            type="text" 
            placeholder='Describe what you want to generate' 
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder:color' 
          />
          <motion.button 
            type='submit' 
            className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full cursor-pointer'
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Generate
          </motion.button>
        </motion.div>
      }

      {isImageLoaded &&
        <motion.div 
          className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            onClick={() => setIsImageLoaded(false)}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Generate Another
          </motion.p>
          <motion.a 
            href={image} 
            download 
            className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Download
          </motion.a>
        </motion.div>
      }
    </motion.form>
  )
}

export default Result
