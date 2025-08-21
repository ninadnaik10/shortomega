"use client";
import React, { useState } from 'react';
import {
  Box,
  Grid2 as Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import { useDashboardData } from '@/hooks/useDashboardData';
import AnalyticsStats from '../AnalyticsStats';
import UrlsDataGrid from '../UrlsDataGrid';
import UrlAnalyticsChart from '../UrlAnalyticsChart';
import Copyright from "../internals/components/Copyright";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

export default function MainGrid() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  
  const {
    urls,
    analytics,
    isLoading,
    error,
    refetch,
  } = useDashboardData();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock analytics data for chart (you can replace this with real data from backend)
  const generateMockChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString(),
        visits: Math.floor(Math.random() * 100) + 20,
        uniqueVisits: Math.floor(Math.random() * 80) + 15,
      });
    }
    
    return data;
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="body2"
                onClick={refetch}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Retry
              </Typography>
            </Box>
          }
        >
          Failed to load dashboard data: {error}
        </Alert>
      </Box>
    );
  }

  const chartData = generateMockChartData();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Analytics Stats */}
      <Box sx={{ mb: 4 }}>
        <AnalyticsStats analytics={analytics} />
      </Box>

      {/* Charts Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <UrlAnalyticsChart 
              data={chartData} 
              title="Visits Overview (Last 7 Days)"
              height={350}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Tabs Section */}
      <Paper 
        sx={{ 
          width: '100%',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="URLs Management" {...a11yProps(0)} />
            <Tab label="Detailed Analytics" {...a11yProps(1)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <UrlsDataGrid urls={urls} onUpdate={refetch} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Detailed Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <UrlAnalyticsChart 
                  data={chartData.map(d => ({ ...d, visits: d.visits * 0.7 }))} 
                  title="Desktop Visits"
                  height={250}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <UrlAnalyticsChart 
                  data={chartData.map(d => ({ ...d, visits: d.visits * 0.3 }))} 
                  title="Mobile Visits"
                  height={250}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  More detailed analytics features coming soon...
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
      
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
