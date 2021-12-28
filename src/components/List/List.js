import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const List = () => {
    const [headers, setHeaders] = useState({});
    const [rows, setRows] = useState([]);
    const [ascOrder, setAscOrder] = useState(false);
    useEffect(() => {
        axios.get('http://localhost/api/list.php')
            .then(res => {
                setHeaders(res.data.data.headers[0]);
                setRows(res.data.data.rows);
                // console.log(res.data);
                // console.log(data)
            })
    }, []);
    const handleDragEnd = (e) => {
        console.log(e)
        if (!e.destination) return;
        let tempData = Array.from(rows);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        console.log(tempData);
        setRows(tempData);
        axios.get('http://localhost/api/reorder.php')
            .then(res => {
                console.log(res.data);
                // console.log(data)
            })
    };
    const handleSorting = (sortable, key, asc) => {
        if (sortable) {
            if (asc) {
                setRows(rows.sort((a, b) => {
                    return a[key] > b[key] ? 1 : -1
                }))
            } else {
                setRows(rows.sort((a, b) => {
                    return a[key] < b[key] ? 1 : -1
                }))
            }
            setAscOrder(!asc);
        }
    }
    const handleSearch = (e, key) => {
        setRows(rows.filter(row => {
            const cellData = row[key];
            return cellData.toString().toLowerCase().includes(e.target.value.toString().toLowerCase());
        }))
    }
    return (
        <>
            <Link to='/get_form'>
                <button className="btn btn-primary">Get Form</button>
            </Link>
            <table className="table table-striped">
                <thead>
                    {
                        <TableHeader headers={headers} handleSorting={handleSorting} ascOrder={ascOrder} handleSearch={handleSearch}></TableHeader>

                    }
                </thead>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tbody">
                        {(provider) => (

                            <tbody ref={provider.innerRef}
                                {...provider.droppableProps}>
                                {
                                    rows.map((row, index) => <TableRow key={row.id} row={row} headers={headers} index={index}></TableRow>)
                                }
                                {provider.placeholder}

                            </tbody>
                        )}
                    </Droppable>
                </DragDropContext>

            </table>
        </>
    );
};

export default List;