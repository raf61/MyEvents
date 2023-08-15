'use client'

import React, { useState } from 'react'

export default function ReadMore({ text, end, classes }) {
  end = end || 150
    const [currentContent, setCurrentContent] = useState(text.slice(0, end))
    const [hiddenText, setHiddenText] = useState(true)

  return (
    <p>
        <span>
            {currentContent}<span hidden={!hiddenText || text.length <= (end)}
            onClick={() => {
                setHiddenText(state => !state)
                setCurrentContent(text)
            }}
            className='text-gray-500 select-none underline cursor-pointer'>Read more...</span>
        </span>
    </p>
  )
}
