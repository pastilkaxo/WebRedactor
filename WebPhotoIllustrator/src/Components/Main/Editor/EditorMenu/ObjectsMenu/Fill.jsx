import React from 'react'

export default function Fill() {
  return (
          <>
            <p className='mb-0 p-3'>Цвет заливки:</p>
            <input type='color' className='fill-color' />
            <p className='mb-0 p-2'>Прозрачность:</p>
            <input type='range' min='0' max='100' defaultValue='100' className='opacity-slider' />
          </>
  )
}
