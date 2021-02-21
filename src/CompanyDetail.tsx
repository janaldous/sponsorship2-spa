import * as React from "react";
import { useParams } from "react-router";
import { CompanySponsorDto } from "./api/generated";
import SponsorshipApi from "./api/generated/SponsorshipApi";

interface CompanyDetailRequestParams {
  id: string;
}
const CompanyDetail: React.FC<{}> = (props) => {
  const [
    companySponsor,
    setCompanySponsor,
  ] = React.useState<CompanySponsorDto>();
  const { id } = useParams<CompanyDetailRequestParams>();

  React.useEffect(() => {
    SponsorshipApi.getCompany(+id).then((res) => {
      setCompanySponsor(res.data);
    });
  }, []);

  return (
    <div>
      <div>{companySponsor?.companyHouseEntry?.companyName}</div>
      <pre style={{ textAlign: "start" }}>
        {JSON.stringify(companySponsor, null, 2)}
      </pre>
    </div>
  );
};

export default CompanyDetail;
