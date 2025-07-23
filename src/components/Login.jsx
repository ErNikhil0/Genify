import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {
    const [state, setState] = useState('Login')
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);

                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);

                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    }

    const formVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    }

    const toggleVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    }

    return (
        <AnimatePresence>
            <motion.div
                className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex items-center justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.form onSubmit={onsubmitHandler}
                    className='relative bg-white p-10 rounded-xl text-slate-500'
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt=""
                        className='absolute top-5 right-5 cursor-pointer'
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />

                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1
                            className='text-center text-2xl text-neutral-700 font-medium'
                            variants={itemVariants}
                        >
                            {state}
                        </motion.h1>

                        <motion.p
                            className='text-sm'
                            variants={itemVariants}
                        >
                            Welcome back! Please sign in to continue
                        </motion.p>

                        {state !== 'Login' && (
                            <motion.div
                                className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.img
                                    src={assets.user_icon}
                                    alt=""
                                    whileHover={{ scale: 1.1 }}
                                />
                                <input onChange={e => setName(e.target.value)} value={name} type="text" className='outline-none text-sm' placeholder='Full Name' required />
                            </motion.div>
                        )}

                        <motion.div
                            className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'
                            variants={itemVariants}
                        >
                            <motion.img
                                src={assets.email_icon}
                                alt=""
                                whileHover={{ scale: 1.1 }}
                            />
                            <input onChange={e => setEmail(e.target.value)} value={email} type="email" className='outline-none text-sm' placeholder='Email id' required />
                        </motion.div>

                        <motion.div
                            className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'
                            variants={itemVariants}
                        >
                            <motion.img
                                src={assets.lock_icon}
                                alt=""
                                whileHover={{ scale: 1.1 }}
                            />
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" className='outline-none text-sm' placeholder='Password' required />
                        </motion.div>

                        <motion.p
                            className='text-sm text-blue-600 my-4 cursor-pointer'
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                        >
                            Forgot Password?
                        </motion.p>

                        <motion.button
                            className='bg-blue-600 w-full text-white py-2 rounded-full'
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(37, 99, 235, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {state === 'Login' ? 'Login' : 'Create account'}
                        </motion.button>

                        {state === 'Login' ? (
                            <motion.p
                                className='mt-5 text-center'
                                variants={itemVariants}
                            >
                                Don't have an account?{' '}
                                <motion.span
                                    className='text-blue-600 cursor-pointer'
                                    onClick={() => setState('Sign Up')}
                                    variants={toggleVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Sign up
                                </motion.span>
                            </motion.p>
                        ) : (
                            <motion.p
                                className='mt-5 text-center'
                                variants={itemVariants}
                            >
                                Already have an account?{' '}
                                <motion.span
                                    className='text-blue-600 cursor-pointer'
                                    onClick={() => setState('Login')}
                                    variants={toggleVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Login
                                </motion.span>
                            </motion.p>
                        )}
                    </motion.div>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    )
}

export default Login