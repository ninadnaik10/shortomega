'use client';

import React from 'react';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    Button,
    IconButton,
} from '@mui/material';
import { ArrowBack, Refresh as RefreshIcon } from '@mui/icons-material';
import { useDashboardData } from '@/hooks/useDashboardData';
import AnalyticsStats from './AnalyticsStats';
import UrlsDataGrid from './UrlsDataGrid';
import { useRouter } from 'next/navigation';
import ProfileMenu from '../ProfileMenu';
import ColorModeSelect from '@/shared-theme/ColorModeSelect';

interface TabPanelProps {
    children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
    const { children, ...other } = props;

    return (
        <div role="tabpanel" {...other}>
            <Box sx={{ py: 3 }}>{children}</Box>
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
                            onClick={() => router.push('/')}
                            sx={{ marginRight: '10px' }}
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
                                margin: '10px',
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                    <ColorModeSelect sx={{ marginRight: '10px' }} />
                    <ProfileMenu />
                </Box>

                <AnalyticsStats
                    totalUrls={data.totalUrls}
                    totalClicks={data.totalClicks}
                    totalUniqueVisits={data.totalUniqueVisits}
                    loading={loading}
                />
                <TabPanel>
                    <Box sx={{ height: 600 }}>
                        <UrlsDataGrid urls={data.urls} loading={loading} />
                    </Box>
                </TabPanel>
                {/* </Card> */}
            </Stack>
        </Container>
    );
}
