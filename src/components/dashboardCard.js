import Image from 'next/image';
import React from 'react';

const DashboardCard = ({ item }) => {
  return (
    <div className='card-container'>
      {/* Badge container */}
      <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src={item?.image} alt='Badge' /> {/* Image for badge */}
      </div>
      {/* Title container */}
      <div className='title-cont'>
        <p className='item-title'>{item?.title}</p> {/* Title of the card */}
        <h5 className='title-value'>{item.titleValue}</h5> {/* Value of the title */}
      </div>
      {/* Value container */}
      <div className='value-container'>
        <div>
          <h2 className='item-value'>{item.value}</h2> {/* Value */}
          {/* <p className='item-percentage'>{item.percentage}</p>  */}
        </div>
        <div>
          <Image width={200} height={50} className='graph-line' src='/icons/Line-chart.svg' alt='Line chart icon' /> {/* Image for line chart */}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
