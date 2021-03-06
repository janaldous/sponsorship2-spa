import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  TextField,
} from "@material-ui/core";
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
  const [isDialogOpen, setDrawerOpen] = React.useState<boolean>(false);
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

  const handleOpenDialog = () => setDrawerOpen(true);
  const handleCloseDialog = () => setDrawerOpen(false);

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

      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Apply
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyDetail;
