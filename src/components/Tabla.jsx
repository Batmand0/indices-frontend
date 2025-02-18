
import { Badge, Checkbox, ScrollArea, Table } from '@mantine/core';
import { PropTypes } from 'prop-types';
import './Tabla.css';
import { useState } from 'react';

function Tabla ({headers, content, colors, doubleHeader, tripleHeader, select, row, smallSize}) {
    const [selectedRow, setSelectedRow] = useState([]);
    const getBlankSpaces = (index) => {
        for (let i = index+1; i < headers[0].length; i++) {
            if(headers[0][i] !== ''){
                return (i-index) > 5 ? 5 : i === (index+1) ? 1 : (i-index);
            }
        }
        return index > 0 ? headers[1].length-1 : headers[1].length;
    };

    const getBlankSpaces2 = (index, list) => {
        let blankSpaces = 1;
        for (let i = index+1; i < list.length; i++) {
            if(list[i] !== ''){
                break;
            } else {
                blankSpaces++;
            }
        }
        return blankSpaces;
    };
    return(

        <ScrollArea w={smallSize ? '45vw': '80vw'} h="50vh" mah={500} maw={smallSize? 800: 1500} type='always' >
            <Table highlightOnHover withBorder withColumnBorders horizontalSpacing='xs' verticalSpacing='xs' className={colors+" tabla"} id='tabla'>
                {/* Si la propiedad "doubleHeader" es true, entonces la primer celda del primer renglon
                tendra una longitud de toda la tabla, si no, entonces solo habra un renglon en donde cada
                columna es un encabezado */}
                {tripleHeader ?
                    <thead>
                        <tr>
                            { headers[0].filter((cell, i) => cell !== '').map((cells, index) => headers[2][headers[0].indexOf(cells)] === ' ' ? <th key={index} rowSpan="3" colSpan={getBlankSpaces2(headers[0].indexOf(cells), headers[0])}>{ cells }</th> : <th key={index} colSpan={getBlankSpaces2(headers[0].indexOf(cells), headers[0])}>{ cells }</th>)}
                        </tr>
                        <tr>
                            { headers[1].filter((cell, index) => cell !== '' && cell !== ' ').map((cells, index) => headers[2][headers[1].indexOf(cells)] === ' ' ? <th style={{top: '42.7px'}} key={index} rowSpan="2" colSpan={getBlankSpaces2(headers[1].indexOf(cells), headers[1])}>{ cells }</th> : <th style={{top: '42.7px'}} colSpan={getBlankSpaces2(headers[1].indexOf(cells), headers[1])} key={index}>{ cells }</th>)}
                        </tr>
                        <tr>
                            { headers[2].filter((cell, index) => cell !== '' && cell !== ' ').map((cell, index) => <th style={{top: '85.4px'}} colSpan={getBlankSpaces2(headers[2].indexOf(cell), headers[2])} key={index}>{ cell }</th>)}
                        </tr>
                    </thead>
                :
                doubleHeader ?
                    <thead>
                        <tr>
                            { select ? <th></th> : null}
                            { headers[0].filter((cell, i) => cell !== '').map((cell, index) => headers[1][headers[0].indexOf(cell)] === '' ? <th key={index} rowSpan="2">{cell}</th> : <th key={index} colSpan={getBlankSpaces(headers[0].indexOf(cell))}>{ cell }</th>) }
                        </tr>
                        <tr>
                            { select ? <th></th> : null}
                            { headers[1].filter((cell, i) => cell !== '').map((cells, index) => cells === 'Nombre' ? <th style={{top: '42px'}} key={index} className='celda-nombre'>{cells}</th> : <th style={{top: '42px'}} colSpan={getBlankSpaces2(headers[1].indexOf(cells), headers[1])} key={index}>{cells}</th>) }
                        </tr>
                    </thead>
                :
                    <thead>
                        <tr>

                        { select ? <th></th> : null}
                            { headers.map( (head, index) => head === "Nombre" ? <th key={index} className='celda-nombre'>{head}</th> : <th key={index}>{head}</th>) }
                        </tr>
                    </thead>
                }
                {
                <tbody>
                    { content.map( (fila, index) => <tr key={index} style={{backgroundColor: selectedRow === fila ? '#F1F3F5' : '#FFFFFF'}}>
                        {
                            select ? <td><Checkbox checked={selectedRow === fila} radius='sm' onChange={(event) => {
                                if (event.target.checked) {
                                    row(fila);
                                    setSelectedRow(fila);
                                } else {
                                    row([]);
                                    setSelectedRow([]);
                                }
                            }}/></td> : null
                        }
                        {
                            fila.map( (celda, i) => celda === 'BAJA' ? <td key={i} className='especial' ><Badge variant='filled' color='rojo'>{celda}</Badge></td> : celda === 'EGR' ? <td key={i} className='especial'> <Badge variant='filled' color='verde'>{celda}</Badge></td>: <td key={i}>{celda}</td>)
                        }
                        </tr>
                    )}
                </tbody>
            }
            </Table>
        </ScrollArea>
    );
};

Tabla.propTypes = {
    headers : PropTypes.array,
    content : PropTypes.array,
    colors: PropTypes.string,
    doubleHeader: PropTypes.bool,
    tripleHeader: PropTypes.bool,
    select: PropTypes.bool,
    row: PropTypes.func,
    smallSize: PropTypes.bool,
};
export default Tabla;
