import { useState } from 'react'
import { Alert, AutoComplete, Button, Card, Col, Form, InputNumber, Row, Select, Space, Typography, message } from 'antd'

const districtOptions = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Kurunegala', 'Galle', 'Ratnapura', 'Matara']
const itemOptions = [
  'Mobile',
  'Computer',
  'TV/Display',
  'Small Appliances',
  'Large Appliances',
  'Batteries',
  'IT Equipment',
  'Cables/Wires',
  'Other',
]
const locations = [
  { value: 'Ward Place, Colombo 07' },
  { value: 'Ward Place, Kandy' },
  { value: 'Ward Street, Negombo' },
]

function ReportWaste() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setLoading(true)

      const res = await fetch('http://127.0.0.1:8001/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: values.district,
          item_type: values.item,
          quantity: values.quantity,
          locality: values.locality,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Submission failed')
      }

      message.success('Log Recorded Successfully')
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      message.error('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleNewReport = () => {
    form.resetFields()
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Alert
          message="Log Recorded"
          description="Submission successful. Your contribution has been tokenized and added to the Colombo local node weights."
          type="success"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Card style={{ marginBottom: 20 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            📍 CEA Colombo Hub
          </Typography.Title>
          <Space direction="vertical" size={2} style={{ marginTop: 12 }}>
            <Typography.Text>123 Baseline Rd, Colombo 08</Typography.Text>
            <Typography.Text>011-2345678</Typography.Text>
          </Space>
        </Card>

        <Button type="default" onClick={handleNewReport}>
          Submit New Report
        </Button>
      </Space>
    )
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ margin: 0, color: '#2E7D32' }}>
          Submit Waste Inventory
        </Typography.Title>
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 6 }}>
          E-Waste Submission Portal
        </Typography.Text>
        <Typography.Paragraph style={{ marginTop: 8, color: '#64748b' }}>
          Citizen reporting for the National E-Waste Inventory
        </Typography.Paragraph>
      </div>

      <Card
        title="District Selection"
        style={{
          borderRadius: 16,
          boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ district: 'Colombo', item: 'Mobile', quantity: 1 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={10}>
              <Form.Item
                label={
                  <Typography.Text strong style={{ color: '#0f172a', letterSpacing: '0.04em' }}>
                    DISTRICTS
                  </Typography.Text>
                }
                name="district"
                rules={[{ required: true, message: 'Please select a district' }]}
              >
                <Select size="large" style={{ width: '100%' }} options={districtOptions.map((district) => ({ value: district, label: district }))} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={10}>
              <Form.Item
                label={
                  <Typography.Text strong style={{ color: '#0f172a', letterSpacing: '0.04em' }}>
                    ITEM CLASSIFICATION
                  </Typography.Text>
                }
                name="item"
                rules={[{ required: true, message: 'Please select an item classification' }]}
              >
                <Select size="large" style={{ width: '100%' }} options={itemOptions.map((item) => ({ value: item, label: item }))} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={
                  <Typography.Text strong style={{ color: '#0f172a', letterSpacing: '0.04em' }}>
                    QUANTITY (UNITS)
                  </Typography.Text>
                }
                name="quantity"
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  {
                    validator: (_, value) =>
                      value == null || value >= 1 ? Promise.resolve() : Promise.reject(new Error('Quantity must be at least 1')),
                  },
                ]}
              >
                <InputNumber min={1} max={9999} size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={
                  <Typography.Text strong style={{ color: '#0f172a', letterSpacing: '0.04em' }}>
                    SPECIFIC LOCALITY
                  </Typography.Text>
                }
                name="locality"
                rules={[
                  { required: true, message: 'Please enter a specific locality' },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim().length < 3) {
                        return Promise.reject(new Error('Locality must be at least 3 characters'))
                      }

                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <AutoComplete
                  placeholder="e.g. Ward Place"
                  size="large"
                  style={{ width: '100%' }}
                  options={locations}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: 20, backgroundColor: '#2E7D32' }}
                htmlType="submit"
                loading={loading}
              >
                Submit Official Report
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default ReportWaste
