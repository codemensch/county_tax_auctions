import { Table } from 'react-bootstrap';
import { County } from '@/app/page';

interface CountyTableProps {
    counties: County[];
}

function CountyTable({ counties }: CountyTableProps) {
    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
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
            {counties.map(county => (
                <tr key={county.id}>
                <td>{county.id}</td>
                <td>{county.countyName}</td>
                <td>{county.state}</td>
                <td>{county.urlMain}</td>
                <td>{county.urlTaxOffice}</td>
                <td>{county.urlTaxOther || ''}</td>
                <td>{county.phone || ''}</td>
                <td>{county.email || ''}</td>
                <td>{county.nextAuctionDate ? new Date(county.nextAuctionDate).toLocaleDateString() : ''}</td>
                <td>{county.auctionFormat}</td>
                <td>{ county.notes || ''}</td>
                <td>{new Date(county.createdAt).toLocaleString()}</td>
                <td>{new Date(county.updatedAt).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default CountyTable;