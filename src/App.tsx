// src/App.tsx
import React from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));



const App: React.FC = () => {
    const { bonds } = useWebSocket("ws://localhost:8080/ws");

    const getPriceColor = (change: 'up' | 'down' | 'same') => {
        if (change === 'up') return 'green';
        if (change === 'down') return 'red';
        return 'inherit';
    };

    return (
      <>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item>xs=6 md=8</Item>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item>xs=6 md=8</Item>
          </Grid>
        </Grid>
        <Box sx={{ padding: 6 }}>
            <ButtonGroup variant="outlined" aria-label="Loading button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
        </Box>
          
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Live Bond Prices
            </Typography>

            <TableContainer component={Paper} elevation={3} sx={{ maxWidth: 700, width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Price ($)</strong></TableCell>
                            <TableCell><strong>Yield (%)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bonds.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Waiting for bond data...
                                </TableCell>
                            </TableRow>
                        ) : (
                            bonds.map((bond) => (
                                <TableRow key={bond.name}>
                                    <TableCell>{bond.name}</TableCell>
                                    <TableCell sx={{ color: getPriceColor(bond.priceChange), fontWeight: 600 }}>
                                        {bond.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{bond.yield.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
       </>
    );
};

export default App;
