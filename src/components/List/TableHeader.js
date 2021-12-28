import React from 'react';

const TableHeader = ({ headers,handleSorting, ascOrder, handleSearch}) => {
    const headerColumn = (header,key) => {
        if(header.hidden===false){
            return <th key= {header.title} onClick={()=>{handleSorting(header.sortable,key,ascOrder)}}>{header.title}</th>
        }
    }

    const searchColumn = (header,key) => {
        if(header.searchable===true){
            return <th key= {header.title}><input type="search" onChange={(e)=>{handleSearch(e,key)}}/></th>
        }else{
            return <th key= {header.title}></th>
        }
    }

    return (
        <>
            <tr>
                {
                    Object.keys(headers).map((key) => headerColumn(headers[key],key))
                }
            </tr>
            <tr>
                {
                    Object.keys(headers).map((key) => searchColumn(headers[key],key))

                }
            </tr>

        </>
    );
};

export default TableHeader;