import { listMyChartVOByPageUsingPOST } from '@/services/kaka/chartController';
import {Avatar, Card, Collapse, List, message, Result} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const {initialState} = useModel("@@initialState");
  const { currentUser } = initialState ?? {};
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [total, setTotal] = useState<number>(0);
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [loading,setLoading] = useState(true)
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartVOByPageUsingPOST(searchParams);
      if (res.data) {
        console.log(res.data);
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach(data=>{
            if (data.status === "succeed") {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('fail to get Charts');
      }
    } catch (e: any) {
      message.error('fail to get Charts' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="input chart name" enterButton loading={loading} onSearch={(value)=> {
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className={"margin-16"}/>
      <List
        grid = {{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current:page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{width: '100%'}}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser?.userAvatar} />}
                title={item.name}
                description={item.chartType ? ("Chart Type: " + item.chartType) : undefined}
              />
              <>
                {
                  item.status === "running" &&
                  <>
                    <Result
                      status="warning"
                      title="Chart is Generating..."
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === "wait" &&
                  <>
                    <Result
                      status="warning"
                      title="Chart Task is in Queue"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              {
                item.status === "succeed" &&
                <>
                  <div className={"margin-16"}/>
                  <p>{"Analyze Goal: " + item.goal}</p>
                  <div className={"margin-16"}/>
                  <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
                  <div className={"margin-16"}/>
                  <Collapse
                    items={[{ key: '1', label: 'Analyze result', children: <p>{item.genResult}</p> }]}
                  />
                </>
              }
              {
                item.status === "failed" &&
                <>
                  <Result
                    status="error"
                    title="Chart Gen Failed"
                    subTitle={item.execMessage}
                  />
                </>
              }
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyChartPage;
