import {genChartByAiAsyncMqUsingPOST} from '@/services/kaka/chartController';
import { UploadOutlined } from "@ant-design/icons";
import { Button,Card,Form,Input,message,Select,Space,Upload } from 'antd';
import TextArea from "antd/es/input/TextArea";
import React,{ useState } from 'react';
import {useForm} from "antd/es/form/Form";



const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const onFinish = async  (values: any) => {
    const params = {
      ...values,
      file: undefined
    }
    setSubmitting(true);
    try {
      const res = await genChartByAiAsyncMqUsingPOST(params,{},values.file.file.originFileObj);
      console.log(res.data);
      if (!res?.data) {
        message.error("analyzed failed")
      } else {
        message.success("analyzed the request, see result in My Charts Page");
        form.resetFields();
      }

    } catch (e:any){
      message.error("fail to analyze, "+e.message);
    }
    setSubmitting(false)
  };

  return (
    <div className="addChartAsync">
      <Card title={'AIGC BI'}>
        <Form
          form={form}
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
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddChartAsync;
