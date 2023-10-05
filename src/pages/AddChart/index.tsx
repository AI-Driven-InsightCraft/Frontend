import { genChartByAiUsingPOST } from '@/services/kaka/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  message,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiRensponse>();
  const [option, setOption] = useState<API.BiRensponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    const params = {
      ...values,
      file: undefined,
    };
    setSubmitting(true);
    setOption(undefined);
    setChart(undefined);
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(res.data);
      if (!res?.data) {
        message.error('analyzed failed');
      } else {
        console.log(res);
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('echart code error');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
        message.success('analyzed the request');
        setChart(res.data);
      }
    } catch (e: any) {
      message.error('fail to analyze, ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="addChart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'AIGC BI'}>
            <Form
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              labelAlign={'left'}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                name="goal"
                label="Analyze Goal"
                rules={[{ required: true, message: 'Please input your request!' }]}
              >
                <TextArea
                  placeholder={'Input your request. For example: Analyze website user growth'}
                />
              </Form.Item>

              <Form.Item name="name" label="Chart Name">
                <Input placeholder={'Input your chart name'} />
              </Form.Item>

              <Form.Item name="chartType" label="Chart Type">
                <Select
                  options={[
                    { value: 'Line Chart', label: 'Line Chart' },
                    { value: 'Bar Chart', label: 'Bar Chart' },
                    { value: 'Stacked Chart', label: 'Stacked Chart' },
                    { value: 'Pie Chart', label: 'Pie Chart' },
                    { value: 'Radar Chart', label: 'Radar Chart' },
                  ]}
                />
              </Form.Item>

              <Form.Item name="file" label="Raw Data">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Excel file</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                  <Button htmlType="reset">reset</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={'Analytical Conclusion'}>
            {chart?.genResult ?? <div>Please submit your Request</div>}
            <Spin spinning={submitting} />
          </Card>
          <Divider />
          <Card title={'Visual Charts'}>
            {option ? <ReactECharts option={option} /> : <div>Please submit your Request</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddChart;
