import { Button } from "@material-ui/core";
import * as React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  CompanySearchResponse,
  CompanySponsorDetailResponse,
} from "./api/generated";
import SponsorshipApi from "./api/SponsorshipApi";

interface CompanyDetailRequestParams {
  id: string;
}
const CompanyDetail: React.FC<{}> = (props) => {
  const [
    companySponsor,
    setCompanySponsor,
  ] = React.useState<CompanySponsorDetailResponse>();
  const [
    ukTierSponsor,
    setUKTierSponsor,
  ] = React.useState<CompanySearchResponse>();
  const { id } = useParams<CompanyDetailRequestParams>();

  React.useEffect(() => {
    if (isNaN(+id)) {
      throw new Error("Path variable 'id' is an invalid number");
    }
    SponsorshipApi.getCompany(+id).then((res) => {
      setCompanySponsor(res.data);
    });
    SponsorshipApi.getUKTierSponsor(+id).then((res) => {
      setUKTierSponsor(res.data);
    });
  }, []);

  return (
    <div>
      <div>
        {companySponsor?.companySponsor?.companyHouseEntry?.companyName}
      </div>
      <pre style={{ textAlign: "start" }}>
        {JSON.stringify(companySponsor, null, 2)}
      </pre>
      <pre style={{ textAlign: "start" }}>
        {JSON.stringify(ukTierSponsor, null, 2)}
      </pre>
      <div style={{ textAlign: "start" }}>
        {ukTierSponsor &&
          ukTierSponsor.companies &&
          ukTierSponsor?.companies?.length > 0 &&
          ukTierSponsor?.companies[0].website && (
            <a target={"_blank"} href={ukTierSponsor?.companies[0].website}>
              {ukTierSponsor?.companies[0].website}
            </a>
          )}
      </div>
      <Button variant="contained" color="primary">
        Apply
      </Button>
    </div>
  );
};

export default CompanyDetail;
