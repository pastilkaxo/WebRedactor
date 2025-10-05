import React from 'react'

export default function Text() {
  return (
          <>
            <p className='mb-0 p-3'>Шрифт:</p>
            <select className='font-select'>
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Helvetica</option>
            </select>
            <p className='mb-0 p-2'>Размер:</p>
            <input type='number' min='8' max='72' defaultValue='16' className='font-size' />
          </>
  )
}
