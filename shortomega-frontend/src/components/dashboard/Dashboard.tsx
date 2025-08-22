"use client";

import React from "react";
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
  IconButton,
} from "@mui/material";
import {
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  TableChart as TableChartIcon,
  BorderAllOutlined,
  ArrowBack,
} from "@mui/icons-material";
import { useDashboardData } from "@/hooks/useDashboardData";
import AnalyticsStats from "./AnalyticsStats";
import UrlsDataGrid from "./UrlsDataGrid";
import { useRouter } from "next/navigation";
import ProfileMenu from "../ProfileMenu";
import ColorModeSelect from "@/shared-theme/ColorModeSelect";

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

export default function Dashboard() {
  const { data, loading, error, refresh } = useDashboardData();
  const [tabValue, setTabValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  const router = useRouter();

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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
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
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flex={1}
          >
            <IconButton
              onClick={() => router.push("/")}
              sx={{ marginRight: "10px" }}
            >
              <ArrowBack />
            </IconButton>
            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold">
                Analytics Dashboard
              </Typography>
            </Box>
            <IconButton
              onClick={refresh}
              disabled={loading}
              sx={{
                margin: "10px",
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          <ColorModeSelect sx={{ marginRight: "10px" }} />
          <ProfileMenu />
        </Box>

        {/* Analytics Stats */}
        <AnalyticsStats
          totalUrls={data.totalUrls}
          totalClicks={data.totalClicks}
          totalUniqueVisits={data.totalUniqueVisits}
          loading={loading}
        />

        {/* Navigation Tabs */}
        {/* <Card> */}
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
              
            </Tabs>
          </Box> */}

        {/* Detailed View Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ height: 600 }}>
            <UrlsDataGrid urls={data.urls} loading={loading} />
          </Box>
        </TabPanel>
        {/* </Card> */}
      </Stack>
    </Container>
  );
}
