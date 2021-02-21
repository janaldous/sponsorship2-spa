import * as React from "react";
import { useParams } from "react-router";
import { CompanySponsorDetailResponse } from "./api/generated";
import SponsorshipApi from "./api/generated/SponsorshipApi";

interface CompanyDetailRequestParams {
  id: string;
}
const CompanyDetail: React.FC<{}> = (props) => {
  const [
    companySponsor,
    setCompanySponsor,
  ] = React.useState<CompanySponsorDetailResponse>();
  const { id } = useParams<CompanyDetailRequestParams>();

  React.useEffect(() => {
    if (isNaN(+id)) {
      throw new Error("Path variable 'id' is an invalid number");
    }
    SponsorshipApi.getCompany(+id).then((res) => {
      setCompanySponsor(res.data);
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
    </div>
  );
};

export default CompanyDetail;
