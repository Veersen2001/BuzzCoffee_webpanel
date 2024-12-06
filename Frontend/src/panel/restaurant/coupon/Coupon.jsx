import React, { useState } from 'react';
import CouponList from './CouponList';
import CouponForm from './CouponForm';

function Coupon() {
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const handleAddNew = () => {
        setEditingCoupon(null);
        setShowForm(true);
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setShowForm(true);
    };

    return (
        <div className=" ">
            <CouponList
                onEdit={handleEdit}
                onAddNew={handleAddNew}
            />
            {showForm && (
                <CouponForm
                    onClose={() => setShowForm(false)}
                    editingCoupon={editingCoupon}
                />
            )}
        </div>
    );
}

export default Coupon;