import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';


function PaginationBar({ totalPages, currentPage, onPageChange }) {

    const handleChange = (event, value) => {
        onPageChange(value);
    };


    return (
        <div>
            <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
        </div>
    );
}

export default PaginationBar;
