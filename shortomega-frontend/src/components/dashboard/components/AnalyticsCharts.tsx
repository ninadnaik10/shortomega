import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardUrl } from '@/hooks/useDashboardData';
import { useTheme } from '@mui/material/styles';

interface AnalyticsChartsProps {
  urls: DashboardUrl[];
  loading?: boolean;
}

export default function AnalyticsCharts({ urls, loading = false }: AnalyticsChartsProps) {
  const theme = useTheme();

  // Prepare data for top URLs chart
  const topUrlsData = urls
    .filter(url => url.analytics?.totalVisits && url.analytics.totalVisits > 0)
    .sort((a, b) => (b.analytics?.totalVisits || 0) - (a.analytics?.totalVisits || 0))
    .slice(0, 10)
    .map(url => ({
      name: url.hash,
      originalUrl: url.originalUrl,
      totalVisits: url.analytics?.totalVisits || 0,
      uniqueVisits: url.analytics?.uniqueVisits || 0,
    }));

  // Prepare data for status distribution
  const statusData = [
    {
      name: 'Active URLs',
      value: urls.filter(url => (url.analytics?.totalVisits || 0) > 0).length,
      color: theme.palette.success.main,
    },
    {
      name: 'Unused URLs',
      value: urls.filter(url => (url.analytics?.totalVisits || 0) === 0).length,
      color: theme.palette.grey[400],
    },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            /{label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {data.originalUrl.length > 50 
              ? `${data.originalUrl.substring(0, 50)}...` 
              : data.originalUrl
            }
          </Typography>
          <Typography variant="body2">
            Total Clicks: {data.totalVisits}
          </Typography>
          <Typography variant="body2">
            Unique Visitors: {data.uniqueVisits}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
        <Card>
          <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Loading charts...</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Loading charts...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (topUrlsData.length === 0) {
    return (
      <Card>
        <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            No analytics data available. Create some short URLs and get clicks to see charts!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
      {/* Top URLs Bar Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Performing URLs
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topUrlsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickFormatter={(value) => `/${value}`}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalVisits" 
                  fill={theme.palette.primary.main}
                  name="Total Clicks"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* URL Status Distribution Pie Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            URL Status Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
