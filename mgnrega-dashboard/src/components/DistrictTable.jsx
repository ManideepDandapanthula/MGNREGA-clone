import React from "react";
import { Table } from "react-bootstrap";

export default function DistrictTable({ data }) {
  return (
    <div className="mt-4">
      <h5 className="text-primary mb-3">Detailed District Data</h5>
      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-success text-center">
          <tr>
            <th>District</th>
            <th>Persondays Generated</th>
            <th>Total Works</th>
            <th>Expenditure (₹ Lakhs)</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((d, index) => (
              <tr key={index}>
                <td>{d.district_name || "—"}</td>
                <td>{d.persondays_generated.toLocaleString()}</td>
                <td>{d.total_works}</td>
                <td>{d.expenditure_in_lakhs}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
