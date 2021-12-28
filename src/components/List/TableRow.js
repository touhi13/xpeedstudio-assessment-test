import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';




const TableRow = ({ row, index, headers }) => {


    return (
        <Draggable draggableId={index.toString()} key={index} index={index}>
            {(provider) => (

                <tr {...provider.draggableProps} ref={provider.innerRef} {...provider.dragHandleProps}>
                    {
                        Object.keys(headers).map((key) => {
                            if (row.hasOwnProperty(key) && headers[key].hidden === false) {
                                if (key === 'id') {
                                    return <td key={row[key]}><Link to={`/edit/${row[key]}`}>{row[key]} </Link>
                                    </td>
                                }
                                else {
                                    return <td key={row[key]}>{row[key]}</td>

                                }

                            } else if (headers[key].hidden === false) {
                                return <td key={row[key]}>Not Available</td>
                            } else {
                                return null
                            }
                        })
                        
                    }

                </tr>
            )
            }
        </Draggable >
    );
};

export default TableRow;