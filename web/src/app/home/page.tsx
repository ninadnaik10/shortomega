'use client';
import AppTheme from '@/shared-theme/AppTheme';
import axios from 'axios';

import React from 'react';

export default function Home() {
    const onPress = async () => {
        const res = await axios.post(
            '/api/shorten',
            JSON.stringify({ url: 'https://docker.com' }),
        );
        console.log(res);
    };
    return (
        <AppTheme>
            <div>Home</div>
            <button onClick={onPress}>press me!</button>
        </AppTheme>
    );
}
