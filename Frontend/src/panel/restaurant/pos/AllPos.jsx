import React, { useState } from 'react'
import { orders } from '../data/orderData';
import ProductSection from './ProductSection';
import BillingSection from './BillingSection';




function AllPos() {
  
  return (
   
      <div className=" lg:flex gap-3 px-3 md:px-8">
        {/* Product Section */}
        <div className="w-full lg:w-3/5">
          <ProductSection />
        </div>

        {/* Billing Section */}
        <div className="w-full lg:w-2/5">
          <BillingSection />
        </div>
      </div>
   
   
  );
  
}

export default AllPos