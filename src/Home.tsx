import { DataGrid } from "@material-ui/data-grid";
import * as React from "react";
import SponsorshipApi from "./api/generated/SponsorshipApi";

interface CompanySponsorRow {
  id?: number;
  companyNumberCH?: string;
  companyNamePDF?: string;
  companyNameCH?: string;
  townPDF?: string;
  localityCH?: string;
  postCodeCH?: string;
}

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: `companyNumberCH`,
    headerName: "Company Number (companyhouse.gov)",
    width: 100,
  },
  {
    field: `companyNamePDF`,
    headerName: "Company Name (pdf)",
    width: 180,
  },
  {
    field: "companyNameCH",
    headerName: "Company Name (companyhouse.gov)",
    width: 180,
  },
  {
    field: "townPDF",
    headerName: "Town (pdf)",
    width: 90,
  },
  {
    field: "localityCH",
    headerName: "Town (companyhouse.gov)",
    width: 90,
  },
  {
    field: "postCodeCH",
    headerName: "Post Code (companyhouse.gov)",
    width: 120,
  },
];

const Home: React.FC<{}> = () => {
  const [rows, setRows] = React.useState<Array<CompanySponsorRow>>([]);
  const pageSize = 10;
  const [rowCount, setRowCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);

  React.useEffect(() => {
    SponsorshipApi.getCompanies(page, pageSize, "London").then((res) => {
      setRowCount(res.data.totalElements || 0);
      setRows(
        res.data.content?.map((x) => ({
          id: x.id,
          companyNumberCH: x.companyHouseEntry?.companyNumber,
          companyNamePDF: x.pdfSponsor?.companyName,
          companyNameCH: x.companyHouseEntry?.companyName,
          townPDF: x.pdfSponsor?.town,
          localityCH: x.companyHouseEntry?.addressLocality,
          postCodeCH: x.companyHouseEntry?.addressPostCode,
        })) || []
      );
    });
  }, [page]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        pageSize={pageSize}
        page={page}
        onPageChange={(params) => setPage(params.page)}
        paginationMode="server"
        rowHeight={49}
        pagination
        checkboxSelection
      />
    </div>
  );
};

export default Home;
