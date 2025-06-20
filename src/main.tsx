import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import React from 'react';
import { ConfigProvider } from 'antd';


const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                      colorPrimary: '#4CAF50',
                      colorLink: '#2E7D32',
                    },
                }}>
                <RouterProvider router={router} />
            </ConfigProvider>
        </QueryClientProvider>
  </React.StrictMode>
);

