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
    width: 130,
  },
  {
    field: `companyNamePDF`,
    headerName: "Company Name (pdf)",
    width: 130,
  },
  {
    field: "companyNameCH",
    headerName: "Company Name (companyhouse.gov)",
    width: 130,
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

  React.useEffect(() => {
    SponsorshipApi.getCompanies(0, 10, "London").then((res) => {
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
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
};

export default Home;
