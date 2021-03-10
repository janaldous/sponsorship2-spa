import { green } from "@material-ui/core/colors";
import { Columns, DataGrid, RowParams } from "@material-ui/data-grid";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import queryString from "query-string";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import SponsorshipApi from "./api/SponsorshipApi";

interface CompanySponsorRow {
  id?: number;
  companyNumberCH?: string;
  companyNamePDF?: string;
  companyNameCH?: string;
  townPDF?: string;
  localityCH?: string;
  postCodeCH?: string;
}

const columns: Columns = [
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
  {
    field: "checked",
    headerName: "checked",
    width: 40,
    renderCell: (params) =>
      params.value ? (
        <CheckBoxIcon style={{ color: green[500] }} />
      ) : (
        <div></div>
      ),
  },
];

const CompanySponsorTable: React.FC<{}> = () => {
  const [rows, setRows] = React.useState<Array<CompanySponsorRow>>([]);
  const pageSizeDefault = 8;
  const [rowCount, setRowCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);

  const history = useHistory();
  const location = useLocation();
  const { zone, pageIndex } = queryString.parse(location.search);

  React.useEffect(() => {
    if (!zone) {
      throw new Error("Query parameter 'zone' is required");
    }
    let pageLookup = page - 1;
    SponsorshipApi.getCompanies(pageLookup, pageSizeDefault, +zone).then(
      (res) => {
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
            checked: x.checked,
          })) || []
        );
      }
    );
  }, [page, zone]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        pageSize={pageSizeDefault}
        page={page}
        onPageChange={(params) => setPage(params.page)}
        paginationMode="server"
        rowHeight={49}
        pagination
        onRowClick={(param: RowParams) =>
          history.push({
            pathname: `company/${param.row.id}`,
            search: `?redirect=${btoa(
              "/company?zone=" + zone + "&pageIndex=" + page
            )}`,
          })
        }
      />
    </div>
  );
};

export default CompanySponsorTable;
