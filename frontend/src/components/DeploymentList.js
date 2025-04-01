import React from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const DeploymentList = ({deployments, onLogClick, onStatusChange}) => {
    return (
        <Paper sx={{mt: 2}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Container</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Port</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deployments.map((d) => (
                        <TableRow key={d.id}>
                            <TableCell>{d.containerName}</TableCell>
                            <TableCell>{d.image}</TableCell>
                            <TableCell>{d.port}</TableCell>
                            <TableCell>{d.status}</TableCell>
                            <TableCell>{new Date(d.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => onLogClick(d.id)}>
                                    Log
                                </IconButton>
                                <IconButton color="primary" onClick={() => onStatusChange(d.id, 'restart')}>
                                    <RestartAltIcon/>
                                </IconButton>
                                <IconButton color="error" onClick={() => onStatusChange(d.id, 'remove')}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default DeploymentList;
