"use client";
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ContentCopy as ContentCopyIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useDashboardData } from '@/hooks/useDashboardData';
import AppTheme from '@/shared-theme/AppTheme';

// Statistics Card Component
function StatCard({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: color,
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// URL Card Component
function UrlCard({ url, onCopy, onOpen }: {
  url: any;
  onCopy: (hash: string) => void;
  onOpen: (originalUrl: string) => void;
}) {
  const totalVisits = url.analytics?.totalVisits || 0;
  const uniqueVisits = url.analytics?.uniqueVisits || 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" noWrap title={url.originalUrl}>
              {url.originalUrl.length > 50 
                ? `${url.originalUrl.substring(0, 50)}...` 
                : url.originalUrl
              }
            </Typography>
            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
              /{url.hash}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<VisibilityIcon />}
              label={`${totalVisits} clicks`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<PeopleIcon />}
              label={`${uniqueVisits} unique`}
              size="small"
              variant="outlined"
            />
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Copy short URL">
              <IconButton size="small" onClick={() => onCopy(url.hash)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open original URL">
              <IconButton size="small" onClick={() => onOpen(url.originalUrl)}>
                <LaunchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(url.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SimpleDashboard() {
  const { data, loading, error, refresh } = useDashboardData();

  const handleCopyUrl = async (hash: string) => {
    const shortUrl = `${window.location.origin}/${hash}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      // You might want to add a toast notification here
      console.log('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleOpenUrl = (originalUrl: string) => {
    window.open(originalUrl, '_blank');
  };

  if (loading) {
    return (
      <AppTheme>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={48} />
              <Typography>Loading dashboard...</Typography>
            </Stack>
          </Box>
        </Container>
      </AppTheme>
    );
  }

  if (error) {
    return (
      <AppTheme>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={refresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      </AppTheme>
    );
  }

  const stats = [
    {
      title: 'Total URLs',
      value: data.totalUrls,
      icon: <LinkIcon />,
      color: '#1976d2',
    },
    {
      title: 'Total Clicks',
      value: data.totalClicks,
      icon: <VisibilityIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Unique Visitors',
      value: data.totalUniqueVisits,
      icon: <PeopleIcon />,
      color: '#ed6c02',
    },
    {
      title: 'Avg. Clicks/URL',
      value: data.totalUrls > 0 ? Math.round(data.totalClicks / data.totalUrls) : 0,
      icon: <TrendingUpIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <AppTheme>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {data.user?.email}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>

          {/* URLs Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Your Short URLs ({data.urls.length})
            </Typography>
            
            {data.urls.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No URLs created yet
                  </Typography>
                  <Typography color="text.secondary">
                    Start by creating your first short URL on the home page!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {data.urls.map((url) => (
                  <Grid item xs={12} md={6} lg={4} key={url.hash}>
                    <UrlCard
                      url={url}
                      onCopy={handleCopyUrl}
                      onOpen={handleOpenUrl}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      </Container>
    </AppTheme>
  );
}
