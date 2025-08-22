'use client';

import { useState, useEffect } from 'react';
import {
    getAllUrls,
    getAnalytics,
    getUserInfo,
    ShortUrl,
    AnalyticsData,
    UserInfo,
} from '@/lib/api';
import useGetUser from './useGetUser';

export interface DashboardUrl extends ShortUrl {
    analytics?: AnalyticsData;
}

export interface DashboardData {
    urls: DashboardUrl[];
    totalUrls: number;
    totalClicks: number;
    totalUniqueVisits: number;
    user: UserInfo | null;
}

export function useDashboardData() {
    const [data, setData] = useState<DashboardData>({
        urls: [],
        totalUrls: 0,
        totalClicks: 0,
        totalUniqueVisits: 0,
        user: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getUser } = useGetUser();
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            await getUser();
            const [userInfo, urls] = await Promise.all([
                getUserInfo(),
                getAllUrls(),
            ]);

            if (!userInfo) {
                setError('User not authenticated');
                return;
            }

            // Extract hashes for analytics
            const hashes = urls.map((url) => url.shortUrl);

            // Fetch analytics if we have URLs
            let analyticsData: Array<AnalyticsData> = [];
            if (hashes.length > 0) {
                analyticsData = await getAnalytics(hashes);
            }

            // Combine URLs with analytics
            const urlsWithAnalytics: DashboardUrl[] = urls.map((url) => ({
                ...url,
                analytics: analyticsData.find(
                    (data) => data.shortUrl === url.shortUrl,
                ),
            }));

            // Calculate totals
            const totalUrls = urls.length;
            const totalClicks = Object.values(analyticsData).reduce(
                (sum, analytics) => sum + (analytics?.totalVisits || 0),
                0,
            );
            const totalUniqueVisits = Object.values(analyticsData).reduce(
                (sum, analytics) => sum + (analytics?.uniqueVisits || 0),
                0,
            );

            setData({
                urls: urlsWithAnalytics,
                totalUrls,
                totalClicks,
                totalUniqueVisits,
                user: userInfo,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refresh: fetchData,
    };
}
