import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Row, Col, Card } from "react-bootstrap";

export default function Charts({ data }) {
  const COLORS = ["#28a745", "#ffc107", "#007bff", "#dc3545", "#17a2b8"];

  // format bar data
  const barData = data.map((d) => ({
    name: d.district_name || "Unknown",
    persondays: parseInt(d.persondays_generated) || 0,
  }));

  return (
    <div className="mt-4">
      <h5 className="text-success mb-3 text-center">📊 Performance Charts</h5>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-center mb-3">Persondays Generated (All Districts)</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="persondays" fill="#28a745" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h6 className="text-center mb-3">Top 5 Districts by Persondays</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={barData.slice(0, 5)}
                  dataKey="persondays"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {barData.slice(0, 5).map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
