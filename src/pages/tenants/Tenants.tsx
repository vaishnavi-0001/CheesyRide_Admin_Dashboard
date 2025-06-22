import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from 'antd';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import React from 'react';
import TenantFilter from './TenantFilter';
import { createTenant, getTenants } from '../../http/api';
import TenantForm from './forms/TenantForm';
import type { CreateTenantData } from '../../types';
import { PER_PAGE } from '../../../constants';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const Tenants = () => {
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const {
        data: tenants,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();

            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

    const { user } = useAuthStore();

    const queryClient = useQueryClient();
    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenantData) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    };


    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Tenants' }]}
                />
                {isLoading && <div>Loading...</div>}
                {isError && <div>{error.message}</div>}

                <TenantFilter
                    onFilterChange={(filterName: string, filterValue: string) => {
                        console.log(filterName, filterValue);
                    }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Add Restaurant
                    </Button>
                </TenantFilter>

                <Table
                    columns={columns}
                    dataSource={tenants?.data}
                    rowKey={'id'}
                    pagination={{
                        total: tenants?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            console.log(page);
                            setQueryParams((prev) => {
                                return {
                                    ...prev,
                                    currentPage: page,
                                };
                            });
                        },
                    }}
                />


                <Drawer
                    title="Create restaurant"
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    width={720}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                             <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                  <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Tenants;