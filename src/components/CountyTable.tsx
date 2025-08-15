"use client";
import { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import { CountyAuction } from "@prisma/client";

export default function CountyTable() {
  const [counties, setCounties] = useState<CountyAuction[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/counties?page=${pagination.page}&limit=${pagination.limit}`);
      const json = await res.json();
      setCounties(json.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: json.pagination.totalPages,
      }));
    };
    fetchData();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  return (
    <div>
      <h2>All Counties</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>County Name</th>
            <th>State</th>
            <th>Main URL</th>
            <th>Tax Office URL</th>
            <th>Other Tax URL</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Next Auction Date</th>
            <th>Auction Format</th>
            <th>Notes</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {counties.map((county) => (
            <tr key={county.id}>
              <td>{county.countyName}</td>
              <td>{county.state}</td>
              <td>{county.urlMain}</td>
              <td>{county.urlTaxOffice}</td>
              <td>{county.urlTaxOther}</td>
              <td>{county.phone}</td>
              <td>{county.email}</td>
              <td>{county.nextAuctionDate?.toString() || ""}</td>
              <td>{county.auctionFormat}</td>
              <td>{county.notes}</td>
              <td>{new Date(county.createdAt).toLocaleDateString()}</td>
              <td>{new Date(county.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        />
        {[...Array(pagination.totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === pagination.page}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        />
      </Pagination>
    </div>
  );
}