import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import * as React from "react";
import { useParams } from "react-router";
import {
  CompanySearchResponse,
  CompanySponsorDetailResponse,
  JobApplicationDto,
  JobApplicationEventDto,
  JobApplicationEventDtoApplicationMethodEnum,
  JobApplicationEventDtoCategoriesEnum,
  JobApplicationEventDtoStatusEnum,
  JobApplicationEventDtoTechStackEnum,
} from "../api/generated";
import SponsorshipApi from "../api/SponsorshipApi";
import JobApplicationFormDialog from "./JobApplicationFormDialog";

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
  const [
    jobApplication,
    setJobApplication,
  ] = React.useState<JobApplicationEventDto>();
  const [jobApplicationHistory, setJobApplicationHistory] = React.useState<
    Array<JobApplicationDto>
  >();
  const [isDialogOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = React.useState<number>(0);
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
    setJobApplication((oldValue) => ({ ...oldValue, companySponsorId: +id }));
  }, []);

  React.useEffect(() => {
    SponsorshipApi.getJobApplicationByCompanySponsor(+id).then((res) => {
      setJobApplicationHistory(res.data);
    });
  }, [submissionCount]);

  const handleOpenDialog = () => setDrawerOpen(true);
  const handleCloseDialog = () => setDrawerOpen(false);

  const handleChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value as string;
    const name = e.target.name as keyof typeof jobApplication;
    if (name) {
      setJobApplication((oldValue) => {
        return { ...oldValue, companySponsorId: +id, [name]: value };
      });
    } else {
      console.warn("did not set state");
    }
  };

  const handleSubmitForm = () => {
    if (jobApplication) {
      SponsorshipApi.postJobApplicationEvent(jobApplication)
        .then(() => {
          handleCloseDialog();
          setSubmissionCount((oldValue) => ++oldValue);
          alert("Successful");
        })
        .catch(() => {
          alert("Something went wrong");
        });
    } else {
      handleCloseDialog();
      alert("Something went wrong");
    }
  };

  const setAsWebsite = () => {
    if (
      ukTierSponsor &&
      ukTierSponsor.companies &&
      ukTierSponsor?.companies?.length > 0 &&
      ukTierSponsor?.companies[0].website
    ) {
      const website = ukTierSponsor?.companies[0].website;
      setJobApplication((oldValue) => ({
        ...oldValue,
        companySponsorId: +id,
        website,
      }));
    }
  };

  const setAsLinkedIn = () => {
    if (
      ukTierSponsor &&
      ukTierSponsor.companies &&
      ukTierSponsor?.companies?.length > 0 &&
      ukTierSponsor?.companies[0].socialWebsite
    ) {
      const website = ukTierSponsor?.companies[0].socialWebsite;
      setJobApplication((oldValue) => ({
        ...oldValue,
        companySponsorId: +id,
        linkedInUrl: website,
      }));
    }
  };

  return (
    <div>
      <div>
        {companySponsor?.companySponsor?.companyHouseEntry?.companyName}
      </div>
      <pre style={{ textAlign: "start" }}>
        {JSON.stringify(companySponsor, null, 2)}
      </pre>
      <pre style={{ textAlign: "start" }}>
        {ukTierSponsor
          ? JSON.stringify(ukTierSponsor, null, 2)
          : "Loading uk tier sponsor"}
      </pre>
      {ukTierSponsor &&
        ukTierSponsor.companies &&
        ukTierSponsor?.companies?.length > 0 &&
        ukTierSponsor?.companies[0].website && (
          <div style={{ display: "flex" }}>
            <div style={{ textAlign: "start" }}>
              <a target={"_blank"} href={ukTierSponsor?.companies[0].website}>
                {ukTierSponsor?.companies[0].website}
              </a>
            </div>
            <Button variant="contained" color="primary" onClick={setAsWebsite}>
              Set as Website
            </Button>
          </div>
        )}
      {ukTierSponsor &&
        ukTierSponsor.companies &&
        ukTierSponsor?.companies?.length > 0 &&
        ukTierSponsor?.companies[0].socialWebsite && (
          <div style={{ display: "flex" }}>
            <div style={{ textAlign: "start" }}>
              <a
                target={"_blank"}
                href={ukTierSponsor?.companies[0].socialWebsite}
              >
                {ukTierSponsor?.companies[0].socialWebsite}
              </a>
            </div>
            <Button variant="contained" color="primary" onClick={setAsLinkedIn}>
              Set as LinkedIn
            </Button>
          </div>
        )}
      <pre style={{ textAlign: "start" }}>
        {jobApplicationHistory
          ? JSON.stringify(jobApplicationHistory, null, 2)
          : "Currently, no job application events"}
      </pre>

      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Apply
      </Button>
      <JobApplicationFormDialog
        isDialogOpen={isDialogOpen}
        onChangeInput={handleChange}
        onCloseDialog={handleCloseDialog}
        onSubmitForm={handleSubmitForm}
        jobApplication={jobApplication}
      />
    </div>
  );
};

export default CompanyDetail;
