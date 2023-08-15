
'use client'

export default function DefaultInput({maxlength, extraClass, id, placeholder, readOnly, required, onChange, value, type, _ref:ref}) {
  return (
    <input required={required} id={id} placeholder={placeholder} maxLength={maxlength} ref={ref} readOnly={readOnly} onChange={(e) => onChange && onChange(e)} type={type || 'text'} value={value} className={`${extraClass} form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-[9pt]
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded-lg
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`}
                    />
  )
}
