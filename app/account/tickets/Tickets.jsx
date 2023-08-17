'use client'
import Modal from "react-modal"
import { BiExpand } from "react-icons/bi"
import { useState } from "react"
import QRious from 'qrious'

export default function Tickets({tickets: ticketPurchases}) {
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
    const [currentTicketPurchase, setCurrentTicketPurchase] = useState({})
    const [ticketQRCode, setTicketQRCode] = useState("")
    const handleCancel = () => {
        setIsTicketModalOpen(false)
        setCurrentTicketPurchase({})
    }
    const handleExpandTicketPurchase = (ticketPurchase) => {
        setCurrentTicketPurchase(ticketPurchase)
        setIsTicketModalOpen(true)
        setTicketQRCode(new QRious({
            value: ticketPurchase.code
        }).toDataURL())
    }

    
  return (
    <>
    
    <div className="flex justify-center items-center mt-5 lg:min-h-[60vh]">
                <div className="p-5 shadow-xl border rounded w-[100%] max-w-[30rem]">
                    <h1 className="text-2xl font-bold text-left mb-3">My tickets</h1>
                    <div>
                    {
                        ticketPurchases && ticketPurchases.map(ticketPurchase => 
                        <div key={ticketPurchase._id} className="px-3 mb-3 border flex rounded-[2px] shadow-md  justify-between items-center">
                            <div className="min-w-0">
                                <div>
                                    <abbr title={ticketPurchase.event.name} className="no-underline">
                                        <span onClick={() => alert(ticketPurchase?.event?.name)}  className="block truncate font-bold text-[12pt]">{ticketPurchase.event.name}</span>
                                    </abbr>
                                </div>
                                <div >
                                    <div>
                                        <abbr title={ticketPurchase.ticket.name} className="no-underline">
                                            <span className="block truncate text-[11pt] text-blue-500 font-bold">{ticketPurchase.ticket.name}</span>
                                        </abbr>
                                    </div>
                                    {
                                        parseInt(ticketPurchase.ticket.price) && 
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11pt] font-bold">Price: </span>
                                            <span className="block truncate text-[11pt] text-green-500 font-bold">{ticketPurchase.ticket.price.toLocaleString('en-US', {style:'currency', currency: 'USD'})}</span>
                                        </div>
                                    }
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Purchased on {new Date(ticketPurchase.createdAt).toLocaleDateString('en-US', {
                                                dateStyle: 'long'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="cursor-pointer" onClick={() => handleExpandTicketPurchase(ticketPurchase)}>
                                    <BiExpand size={30} />
                                </span>
                            </div>
                        </div>
                    )
                }

                {
                    !ticketPurchases?.length && 
                        <p className="text-gray-500">You do not have tickets.</p>
                }
                    </div>
                </div>
            </div>


    <Modal
        ariaHideApp={false} 
        isOpen={isTicketModalOpen}
        onRequestClose={() => {
            handleCancel()            
        }}
        contentLabel='My ticket'
        style={{
            overlay:{},
            content:{
                height: "60vh",
                margin: 'auto',
                padding: '0px',
                border:'none',
                maxWidth: "25rem",
                boxShadow:"1px 1px 10px -1px black",
                borderRadius:"10px"
            }
        }}
        >

            <div className={`flex z-40 relative justify-center h-[100%] items-center`}>
                <div>
                    <div>
                        <span onClick={() => alert(currentTicketPurchase?.event?.name)} title={currentTicketPurchase?.event?.name} className="block max-w-[16rem] w-[100%] truncate font-bold text-[12pt]">{currentTicketPurchase?.event?.name}</span>
                        <span className="block truncate text-[11pt] max-w-[16rem] text-blue-500 font-bold">{currentTicketPurchase?.ticket?.name}</span>
                    </div>
                    <div>
                        <div className="w-[100%]">
                            <img src={ticketQRCode} className="w-[100%]" />
                        </div>
                        <div className="text-sm text-center">{currentTicketPurchase?.code}</div>
                    </div>
                </div>
            </div>  
        </Modal>
        </>
  )
}
