"use client";
import { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import { CountyAuction } from "@prisma/client";

export default function Counties() {
  const [counties, setCounties] = useState<CountyAuction[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({ field: "countyName", order: "asc" });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/counties?page=${pagination.page}&limit=${pagination.limit}&sort=${sortConfig.field}&order=${sortConfig.order}`
      );
      const json = await res.json();
      setCounties(json.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: json.pagination.totalPages,
      }));
    };
    fetchData();
  }, [pagination.page, pagination.limit, sortConfig]);

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
  };

  const getSortArrow = (field: string) => {
    if (sortConfig.field === field) {
      return sortConfig.order === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div>
      <h2>All Counties</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th
              onClick={() => handleSort("countyName")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "countyName" ? "#f0f8ff" : "transparent",
              }}
            >
              County Name{getSortArrow("countyName")}
            </th>
            <th
              onClick={() => handleSort("state")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "state" ? "#f0f8ff" : "transparent",
              }}
            >
              State{getSortArrow("state")}
            </th>
            <th>Main URL</th>
            <th>Tax Office URL</th>
            <th>Other Tax URL</th>
            <th>Phone</th>
            <th>Email</th>
            <th
              onClick={() => handleSort("nextAuctionDate")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "nextAuctionDate" ? "#f0f8ff" : "transparent",
              }}
            >
              Next Auction Date{getSortArrow("nextAuctionDate")}
            </th>
            <th
              onClick={() => handleSort("auctionFormat")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "auctionFormat" ? "#f0f8ff" : "transparent",
              }}
            >
              Auction Format{getSortArrow("auctionFormat")}
            </th>
            <th>Notes</th>
            <th
              onClick={() => handleSort("createdAt")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "createdAt" ? "#f0f8ff" : "transparent",
              }}
            >
              Created At{getSortArrow("createdAt")}
            </th>
            <th
              onClick={() => handleSort("updatedAt")}
              style={{
                cursor: "pointer",
                backgroundColor: sortConfig.field === "updatedAt" ? "#f0f8ff" : "transparent",
              }}
            >
              Updated At{getSortArrow("updatedAt")}
            </th>
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
        <Pagination.First
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(1)}
        />
        <Pagination.Prev
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        />

        {/* Condensed Pagination */}
        {pagination.totalPages > 5 ? (
          <>
            <Pagination.Item
              active={pagination.page === 1}
              onClick={() => handlePageChange(1)}
            >
              1
            </Pagination.Item>
            {pagination.page > 3 && <Pagination.Ellipsis disabled />}
            {Array.from(
              { length: 3 },
              (_, i) => pagination.page - 1 + i
            )
              .filter((p) => p > 1 && p < pagination.totalPages)
              .map((p) => (
                <Pagination.Item
                  key={p}
                  active={pagination.page === p}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Pagination.Item>
              ))}
            {pagination.page < pagination.totalPages - 2 && <Pagination.Ellipsis disabled />}
            <Pagination.Item
              active={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.totalPages)}
            >
              {pagination.totalPages}
            </Pagination.Item>
          </>
        ) : (
          [...Array(pagination.totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === pagination.page}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))
        )}

        <Pagination.Next
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        />
        <Pagination.Last
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
        />
      </Pagination>
    </div>
  );
}