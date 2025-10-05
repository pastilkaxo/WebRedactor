import React from 'react'

export default function Zoom() {
  return (
          <>
            <p className='mb-0 p-3'>Масштаб:</p>
            <div className='zoom-controls'>
              <button className='zoom-btn'>25%</button>
              <button className='zoom-btn'>50%</button>
              <button className='zoom-btn'>100%</button>
              <button className='zoom-btn'>200%</button>
            </div>
          </>
  )
}
