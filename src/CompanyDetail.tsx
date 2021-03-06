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
  JobApplicationCreateDto,
  JobApplicationCreateDtoApplicationMethodEnum,
  JobApplicationCreateDtoStatusEnum,
  JobApplicationCreateDtoTechCompanyTypeEnum,
  JobApplicationDto,
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
  const [
    jobApplication,
    setJobApplication,
  ] = React.useState<JobApplicationCreateDto>();
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
      <pre style={{ textAlign: "start" }}>
        {JSON.stringify(jobApplicationHistory, null, 2)}
      </pre>

      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Apply
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Job Application</DialogTitle>
        <DialogContent>
          <InputLabel id="jobapplication-applicationmethod-label">
            Application method
          </InputLabel>
          <Select
            labelId="jobapplication-applicationmethod-label"
            id="jobapplication-applicationmethod-select"
            name="applicationMethod"
            value={jobApplication?.applicationMethod}
            onChange={handleChange}
          >
            {Object.values(JobApplicationCreateDtoApplicationMethodEnum).map(
              (method) => (
                <MenuItem value={method}>{method}</MenuItem>
              )
            )}
          </Select>
          <InputLabel id="jobapplication-status-label">
            Application status
          </InputLabel>
          <Select
            labelId="jobapplication-status-label"
            id="jobapplication-status-select"
            name="status"
            value={jobApplication?.status}
            onChange={handleChange}
          >
            {Object.values(JobApplicationCreateDtoStatusEnum).map((status) => (
              <MenuItem value={status}>{status}</MenuItem>
            ))}
          </Select>
          <InputLabel id="jobapplication-category-label">
            Tech Company Category
          </InputLabel>
          <Select
            labelId="jobapplication-category-label"
            id="jobapplication-category-select"
            name="techCompanyType"
            value={jobApplication?.techCompanyType}
            onChange={handleChange}
          >
            {Object.values(JobApplicationCreateDtoTechCompanyTypeEnum).map(
              (status) => (
                <MenuItem value={status}>{status}</MenuItem>
              )
            )}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="website"
            name="website"
            label="Website"
            type="text"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitForm} color="primary">
            Sumbit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyDetail;
