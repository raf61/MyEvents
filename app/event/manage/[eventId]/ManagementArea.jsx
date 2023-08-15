'use client'

import './ManagementArea.css'
import Link from 'next/link'
import { useParams } from "next/navigation"
import { useContext, useState } from "react"
import { ImTicket } from 'react-icons/im'
import { AiFillPicture } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { EventContext } from './EventProvider'
import DefaultInput from '@/layout/DefaultInput'
import Modal from 'react-modal'
import { BsCodeSlash } from 'react-icons/bs'
import { toast } from 'react-toastify'


export default function ManagementArea() {
    const {eventId} = useParams()
    const {originalEvent, setOriginalEvent} = useContext(EventContext)
    const [processingAreSalesPaused, setProcessingAreSalesPaused] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [newEventImageURL, setNewEventImageURL] = useState('')
    const [newImageUploadType, setNewImageUploadType] = useState(null)
    const [canUploadImage, setCanUploadImage] = useState(false)
    const [fileToBeUploaded, setFileToBeUploaded] = useState(null)
    const [processingImage, setProcessingImage] = useState(false)

    const handleRemoveImage = async () => {
        const API_BASEURL = process.env.API_BASEURL
        setOriginalEvent(state => ({...state, image:null}))
        setNewEventImageURL(null)
        let response = await fetch(`${API_BASEURL}/events/${eventId}`, {
            method:'PUT',
            body:JSON.stringify({
                image: null
            })
        })
        response = await response.json()
        if (!response.ok){
            return toast.error(response.msg)
        }
        
    }

    const handleChangeSalesPaused = async (e) => {
        if (processingAreSalesPaused || !confirm('Are you sure ?')){
            return
        }
        try {
            setProcessingAreSalesPaused(true)
            const API_BASEURL = process.env.API_BASEURL
            let response = await fetch(`${API_BASEURL}/events/${eventId}`, {
                method:'PUT',
                body:JSON.stringify({
                    areSalesPaused: !originalEvent.areSalesPaused
                })
            })
            response = await response.json()
            if (!response.ok){
                return toast.error(response.msg)
            }
            
        } catch (error) {
            setProcessingAreSalesPaused(false)
            toast.error('An unexpected error ocurred.')
        }
        setOriginalEvent(state => ({...state, areSalesPaused: !state.areSalesPaused}))
        setProcessingAreSalesPaused(false)
    }

    const handleChangeImageUploadInput = async (e) => {
        const [file] = e.target.files
        setFileToBeUploaded(file)
        setNewEventImageURL(URL.createObjectURL(file))
        setCanUploadImage(true)
    }

    const handleSave = async () => {
        const API_BASEURL = process.env.API_BASEURL
        let imageURLToSave = null
        try {
            if (newImageUploadType == 'browse'){
                setProcessingImage(true)
                const formData = new FormData()
                formData.append('image', fileToBeUploaded)
                let response = await fetch(`${API_BASEURL}/image`, {
                    method: 'POST',
                    body: formData
                })
                response = await response.json()
                if (!response.ok){
                    setProcessingImage(false)
                    return toast.error(response.msg)
                }
                imageURLToSave = response.url
            }
            if (newImageUploadType == 'paste') {
                imageURLToSave = newEventImageURL
            }
            let response = await fetch(`${API_BASEURL}/events/${eventId}`, {
                method:'PUT',
                body:JSON.stringify({
                    image: imageURLToSave
                })
            })
            response = await response.json()
            if (!response.ok){
                setProcessingImage(false)
                return toast.error(response.msg)
            }            

            setProcessingImage(false)
            setOriginalEvent(state => ({...state, image: imageURLToSave}))
            setNewEventImageURL(imageURLToSave)
            setNewImageUploadType(null)
        } catch (error) {
            console.log(error)
            setProcessingImage(false)
            toast.error('Could not upload image')
        }
    }

    const handleCancel = () => {
        if (processingImage){
            return
        }
        setNewEventImageURL('')
        setIsImageModalOpen(false)
        setNewImageUploadType(null)
        setCanUploadImage(false)
        setFileToBeUploaded(null)
    }   



  return (
    <>
    <div>

        {   originalEvent.areSalesPaused != undefined &&
        
            <div className="flex gap-2 items-center border p-2 rounded-[3px]">
                {!processingAreSalesPaused && 
                <label className="flex items-center relative w-max cursor-pointer select-none">
                    <input id='sales_controller' checked={!originalEvent.areSalesPaused} onChange={handleChangeSalesPaused} type="checkbox" className="checked:bg-[#22c55e] appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full  bg-red-500" />
                    <span className="absolute font-medium text-xs uppercase right-1 text-white"> OFF </span>
                    <span className="absolute font-medium text-xs uppercase right-8 text-white"> ON </span>
                    <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
                </label>}
                {
                    processingAreSalesPaused && 
                    <span className='text-gray-500'>Loading...</span>
                }

                <label
                className="select-none inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="pause_sales"
                >Allow purchases</label>
            </div>
        }
        <div className="mt-5 gap-2 flex">
            <Link href={`/event/manage/${eventId}/tickets`} className='w-[100%]'>
                <button className='flex items-center gap-3 justify-center p-2 bg-blue-400 text-white w-[100%] rounded-[3px] border-slate-500 border'>
                    <span>Manage tickets</span>
                    <span><ImTicket size={20} /></span>
                </button>
            </Link>
        </div>
        <div className="mt-5 w-[100%] block">
            <button onClick={() => setIsImageModalOpen(true)} className='flex items-center gap-3 justify-center p-2 bg-blue-400 text-white w-[100%] rounded-[3px] border-slate-500 border'>
                <span>Choose a picture</span>
                <span><AiFillPicture size={20} /></span>
            </button>
        </div>
        <div className="mt-5 w-[100%] block">
            <Link href={`/event/manage/${eventId}/financial`} className='w-[100%]'>
                <button className='flex items-center gap-3 justify-center p-2 bg-blue-400 text-white w-[100%] rounded-[3px] border-slate-500 border'>
                    <span>Financial</span>
                    <span><FaRegMoneyBillAlt size={20} /></span>
                </button>
            </Link>
        </div>
        <div className="mt-5 w-[100%] block">
            <Link href={`/event/manage/${eventId}/developer`} className='w-[100%]'>
                <button className='flex items-center gap-3 justify-center p-2 bg-blue-400 text-white w-[100%] rounded-[3px] border-slate-500 border'>
                    <span>Developer</span>
                    <span><BsCodeSlash size={20} /></span>
                </button>
            </Link>
        </div>

    </div>
        <Modal
        ariaHideApp={false} 
        isOpen={isImageModalOpen}
        onRequestClose={() => {
            handleCancel()            
        }}
        contentLabel='Choose an image'
        style={{
            overlay:{},
            content:{
                width:"30rem",
                height: "60vh",
                margin: 'auto',
                padding: '0px',
                border:'none',
                boxShadow:"1px 1px 10px -1px black",
                borderRadius:"10px"
            }
        }}
        >
            <div className={`flex z-40 relative justify-center h-[100%] items-center`}>
                <div>
                    {
                        !newImageUploadType && <p className='text-2xl text-center'>Choose an image</p>
                    }   

                    
                    <div>


                        {
                            !newImageUploadType && 
                        (<p className='text-center select-none'>

                            <span onClick={() => setNewImageUploadType('browse')} className='cursor-pointer text-blue-600'>Browse</span> or <span onClick={() => setNewImageUploadType('paste')} className='cursor-pointer text-blue-600'>paste</span> an image link.
                        </p>)
                        }

                    </div>

                    {
                        newImageUploadType == 'browse' && !newEventImageURL && 
                        <div>
                            <input accept=".png, .jpg, .jpeg" type="file" id="image_input" hidden onChange={handleChangeImageUploadInput}/>
                            <label htmlFor="image_input" className='flex justify-center'>
                                <div className='cursor-pointer text-sm bg-black px-3 py-2 text-center w-[12rem] text-white rounded'>Upload an image</div>
                            </label>
                        </div>
                    }
                    {
                        newImageUploadType == 'paste' && 
                        <div className="flex items-center gap-3 justify-center">
                            <div className='w-[15rem]'>
                                <label htmlFor="image_url_input" className='text-[9pt]'>Enter an image URL</label>
                                <DefaultInput value={newEventImageURL} onChange={(e) => {
                                    setNewEventImageURL(e.target.value)
                                    if (!e.target.value){
                                        setCanUploadImage(false)
                                    }
                                }} id="image_url_input" type="text" placeholder={"https://myimage/abc/xyx.jpg"} />
                            </div>
                            <div>
                                <span  onClick={() => {
                                setNewEventImageURL('')
                                setNewImageUploadType(null)
                                setCanUploadImage(false)
                            }} className='text-blue-500 cursor-pointer relative top-3'>Cancel</span>
                            </div>
                        </div>
                    }
                    <div className='mt-5 w-[100%] flex justify-center'>
                        <img onError={e => {
                            if (originalEvent.image){
                                e.target.src = originalEvent.image || ''
                            }
                            else{
                                e.target.setAttribute('hidden','')
                            }
                            setCanUploadImage(false)
                        }
                        }
                        onLoad={e=> {
                            e.target.removeAttribute('hidden')
                            if (!originalEvent.image || e.target.src != originalEvent.image){
                                setCanUploadImage(true)
                            }
                        }} className='max-w-[100%] max-h-[19rem]' src={newEventImageURL || originalEvent.image} />
                    </div>
                    {
                        newImageUploadType == 'browse' && !newEventImageURL && 
                        <div className='mt-2 text-center text-blue-500 select-none cursor-pointer' onClick={() => {
                            setNewEventImageURL('')
                            setNewImageUploadType(null)
                            setCanUploadImage(false)
                        }}>
                            <span>Cancel</span>
                        </div>
                    }
                    {
                        !newImageUploadType && originalEvent.image && 
                        (
                            <div className='text-center mt-2 select-none cursor-pointer'>
                                <span onClick={handleRemoveImage}>Remove image</span>
                            </div>
                        )
                    }
                    {
                        newImageUploadType && newEventImageURL && 
                        (
                            <div className='flex justify-center mt-10'>
                            
                            <div className='w-[16rem] flex justify-center'> 
                                <button
                                disabled={ !canUploadImage || processingImage }
                                onClick={handleSave} className='px-4 text-sm disabled:bg-blue-300 py-2 text-white bg-blue-500 rounded-[2px]'>
                                    {processingImage ? 'Processing...' : 'Add picture'}
                                </button>
                                <button onClick={handleCancel} className='px-3 py-2'>Cancel</button>
                            </div>
                        </div>)
                    }

                </div>
            </div>  
        </Modal>
    </>
  )
}
