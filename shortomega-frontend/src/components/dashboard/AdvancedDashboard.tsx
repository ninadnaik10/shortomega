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
  Button,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';
import { useDashboardData } from '@/hooks/useDashboardData';
import AnalyticsStats from './components/AnalyticsStats';
import UrlsDataGrid from './components/UrlsDataGrid';

// Type to handle potential API inconsistencies
interface FlexibleUrl {
  hash?: string;
  shortUrl?: string;
  originalUrl?: string;
  longUrl?: string;
  analytics?: {
    totalVisits?: number;
    uniqueVisits?: number;
  };
  [key: string]: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdvancedDashboard() {
  const { data, loading, error, refresh } = useDashboardData();
  const [tabValue, setTabValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={48} />
            <Typography>Loading dashboard...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Analytics Dashboard
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
            Refresh Data
          </Button>
        </Box>

        {/* Analytics Stats */}
        <AnalyticsStats
          totalUrls={data.totalUrls}
          totalClicks={data.totalClicks}
          totalUniqueVisits={data.totalUniqueVisits}
          loading={loading}
        />

        {/* Navigation Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="dashboard tabs"
              sx={{ px: 3, pt: 2 }}
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Overview" 
                iconPosition="start"
              />
              <Tab 
                icon={<TableChartIcon />} 
                label="Detailed View" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, pb: 3 }}>
              {data.urls.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No URLs created yet
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Start by creating your first short URL on the home page!
                  </Typography>
                  <Button 
                    variant="contained" 
                    href="/"
                    startIcon={<LinkIcon />}
                  >
                    Create Short URL
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Recent URLs */}
                  <Grid item xs={12} lg={8}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Recent URLs
                        </Typography>
                        <Stack spacing={2}>
                          {data.urls.slice(0, 5).map((url, index) => {
                            const flexUrl = url as FlexibleUrl;
                            return (
                            <Box 
                              key={flexUrl.hash || flexUrl.shortUrl || `url-${index}`}
                              sx={{ 
                                p: 2, 
                                border: 1, 
                                borderColor: 'divider', 
                                borderRadius: 1,
                                '&:hover': { backgroundColor: 'action.hover' }
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="start">
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle1" noWrap>
                                    {flexUrl.originalUrl || flexUrl.longUrl}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                    /{flexUrl.hash || flexUrl.shortUrl}
                                  </Typography>
                                </Box>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Stack alignItems="center">
                                    <Typography variant="h6">
                                      {flexUrl.analytics?.totalVisits || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      clicks
                                    </Typography>
                                  </Stack>
                                  <Stack alignItems="center">
                                    <Typography variant="h6">
                                      {flexUrl.analytics?.uniqueVisits || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      unique
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Box>
                          )})}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Top Performers */}
                  <Grid item xs={12} lg={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Top Performers
                        </Typography>
                        <Stack spacing={2}>
                          {data.urls
                            .filter(url => (url.analytics?.totalVisits || 0) > 0)
                            .sort((a, b) => (b.analytics?.totalVisits || 0) - (a.analytics?.totalVisits || 0))
                            .slice(0, 5)
                            .map((url) => {
                              const flexUrl = url as FlexibleUrl;
                              return (
                              <Box 
                                key={flexUrl.hash || flexUrl.shortUrl}
                                sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: 'action.hover',
                                  borderRadius: 1
                                }}
                              >
                                <Typography variant="body2" fontFamily="monospace">
                                  /{flexUrl.hash || flexUrl.shortUrl}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {flexUrl.analytics?.totalVisits || 0} clicks
                                </Typography>
                              </Box>
                            )})}
                          {data.urls.filter(url => (url.analytics?.totalVisits || 0) > 0).length === 0 && (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                              No clicks yet
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          </TabPanel>

          {/* Detailed View Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ height: 600 }}>
              <UrlsDataGrid urls={data.urls} loading={loading} />
            </Box>
          </TabPanel>
        </Card>
      </Stack>
    </Container>
  );
}
