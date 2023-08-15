'use client'

import { useState } from 'react'
import {BsClipboard} from 'react-icons/bs'
import { FcOk } from 'react-icons/fc'

export default function ShareLinkButton({ link }) {

    const [ok, setOk] = useState(false)

    const handleClick = async () => {
        if (!ok){   
            await navigator.clipboard.writeText(link)
            setOk(true)
                setTimeout(() => {
                    setOk(false)
                }, 3000)
        }
    }

  return (
    <span onClick={handleClick}  className="bg-black cursor-pointer text-white rounded p-1">
        { !ok && 
        <abbr title='Copy'>

            <BsClipboard size={15} />
        </abbr>
        }
        { ok && <FcOk size={15} /> }
    </span>
  )
}
