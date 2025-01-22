import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Displaymap = () => {

  const [map, setmap] = useState([])

  const getmaps = async () => {
    const maps = await axios.get("http://localhost:8080/slots/getitems")
    console.log(maps.data.data[0].name);
    const data = await maps.data
    if (data.success) {
      setmap(data.data)
    }
  }

  useEffect(() => {
    getmaps()
    
  }, [])

  return (
    <div className='Displaymap m-5'>
      <div className='flex justify-around'>
        <div className="Sr.No">
          Sr.no
        </div>
        <div className="img">
          image
        </div>
        <div className="name">
          Name
        </div>
        <div className="address">
          Address
        </div>
        <div className="remove">
          X
        </div>
      </div>
      {map.length > 0 && map.map((data,index)=>{
        return(
        <div className='flex justify-around' key={index}>
        <div className="Sr.No">
          {index+1}
        </div>
        <div className="img w-[100px] rounded-md bg-black object-cover">
          <img src={"http://localhost:8080/"+data.image} alt="" />
        </div>
        <div className="name">
          {data.name}
        </div>
        <div className="address">
          {data.address}
        </div>
        <div className="remove">
          X
        </div>
      </div>
        )
      })

      }
    </div>
  )
}

export default Displaymap