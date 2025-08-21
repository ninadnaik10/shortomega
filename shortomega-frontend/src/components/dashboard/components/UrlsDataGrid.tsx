"use client";

import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import { DashboardUrl } from '@/hooks/useDashboardData';

interface UrlsDataGridProps {
  urls: any[]; // Use any[] to handle flexible data structures
  loading?: boolean;
}

export default function UrlsDataGrid({ urls, loading = false }: UrlsDataGridProps) {
  const handleCopyUrl = async (hash: string) => {
    const shortUrl = `${window.location.origin}/${hash}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      // You might want to show a toast notification here
      console.log('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleOpenUrl = (originalUrl: string) => {
    window.open(originalUrl, '_blank');
  };

  const columns: GridColDef[] = [
    {
      field: 'originalUrl',
      headerName: 'Original URL',
      flex: 2,
      minWidth: 300,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value as string}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => handleOpenUrl(params.value as string)}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'hash',
      headerName: 'Short URL',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            /{params.value}
          </Typography>
          <Tooltip title="Copy short URL">
            <IconButton
              size="small"
              onClick={() => handleCopyUrl(params.value as string)}
              sx={{ ml: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open original URL">
            <IconButton
              size="small"
              onClick={() => handleOpenUrl(params.row.originalUrl)}
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'totalVisits',
      headerName: 'Total Clicks',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <VisibilityIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.analytics?.totalVisits || 0}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'uniqueVisits',
      headerName: 'Unique Visitors',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <PeopleIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.analytics?.uniqueVisits || 0}
          </Typography>
        </Stack>
      ),
    },
    // {
    //   field: 'createdAt',
    //   headerName: 'Created',
    //   width: 130,
    //   renderCell: (params: GridRenderCellParams) => {
    //     const date = new Date(params.value as string);
    //     return (
    //       <Typography variant="body2">
    //         {date.toLocaleDateString()}
    //       </Typography>
    //     );
    //   },
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 100,
    //   align: 'center',
    //   headerAlign: 'center',
    //   renderCell: (params: GridRenderCellParams) => {
    //     const totalVisits = params.row.analytics?.totalVisits || 0;
    //     const isActive = totalVisits > 0;
        
    //     return (
    //       <Chip
    //         label={isActive ? 'Active' : 'Unused'}
    //         color={isActive ? 'success' : 'default'}
    //         size="small"
    //         variant="outlined"
    //       />
    //     );
    //   },
    // },
  ];

  // Add id field for DataGrid and normalize data structure
  const rowsWithId = urls.map((url, index) => {
    const hash = url.hash || url.shortUrl || `url-${index}`;
    const originalUrl = url.originalUrl || url.longUrl || '';
    
    return {
      ...url,
      id: hash,
      hash,
      originalUrl,
    };
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Your Short URLs ({urls.length})
        </Typography>
        <Box sx={{ flex: 1, minHeight: 400 }}>
          <DataGrid
            rows={rowsWithId}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }],
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
