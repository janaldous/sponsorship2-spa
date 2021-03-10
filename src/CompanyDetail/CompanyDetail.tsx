import {
  AppBar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  createStyles,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { differenceInDays } from "date-fns";
import { differenceInHours, differenceInMinutes } from "date-fns/esm";
import parse from "date-fns/parse";
import queryString from "query-string";
import * as React from "react";
import { useHistory, useLocation, useParams } from "react-router";
import {
  CompanySearchResponse,
  CompanySponsorDetailResponse,
  JobApplicationDto,
  JobApplicationEventDto,
  TrainStation,
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
  const [nearbyTrainStations, setNearbyTrainStations] = React.useState<
    Array<TrainStation>
  >();
  const { id } = useParams<CompanyDetailRequestParams>();
  const history = useHistory();
  const location = useLocation();
  const { redirect } = queryString.parse(location.search);

  React.useEffect(() => {
    if (isNaN(+id)) {
      throw new Error("Path variable 'id' is an invalid number");
    }
    SponsorshipApi.getCompany(+id).then((res) => {
      setCompanySponsor(res.data);
      const postCode =
        res.data.companySponsor?.companyHouseEntry?.addressPostCode;
      if (postCode) {
        SponsorshipApi.getNearByStops(postCode).then((res2) => {
          setNearbyTrainStations(res2.data);
        });
      }
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

  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" style={{ marginBottom: "8px" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() =>
              typeof redirect === "string" && history.push(atob(redirect))
            }
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {companySponsor?.companySponsor?.companyHouseEntry?.companyName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                PDF Sponsor
              </Typography>
              <div>
                {companySponsor &&
                  companySponsor?.companySponsor &&
                  companySponsor.companySponsor.pdfSponsor &&
                  Object.entries(
                    companySponsor?.companySponsor?.pdfSponsor
                  ).map(([key, value]) => (
                    <Row key={key} keyProp={key} value={value} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Company House API
              </Typography>
              <div>
                {companySponsor &&
                  companySponsor?.companySponsor &&
                  companySponsor.companySponsor.companyHouseEntry &&
                  Object.entries(
                    companySponsor?.companySponsor?.companyHouseEntry
                  )
                    .filter(
                      ([key, value]) => value !== null && value !== undefined
                    )
                    .map(([key, value]) => (
                      <Row key={key} keyProp={key} value={value} />
                    ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Company Sponsor
              </Typography>
              <div>
                {companySponsor &&
                  companySponsor?.companySponsor &&
                  Object.entries(companySponsor?.companySponsor)
                    .filter(
                      ([key, value]) =>
                        key !== "companyHouseEntry" && key !== "pdfSponsor"
                    )
                    .map(([key, value]) => (
                      <Row key={key} keyProp={key} value={value} />
                    ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {
                    "Nearby stations (based on proximity <= 1km and postcode match)"
                  }
                </Typography>

                <List>
                  {nearbyTrainStations &&
                    nearbyTrainStations.map((trainStation) => (
                      <ListItem
                        key={trainStation.name}
                      >{`${trainStation.name} [${trainStation.zone}] [${trainStation.modes}] [${trainStation.lines}] {${trainStation.distance}m}`}</ListItem>
                    ))}
                  <Divider />
                  {companySponsor &&
                    companySponsor?.nearbyTubeStations &&
                    companySponsor.nearbyTubeStations.map((trainStation) => (
                      <ListItem
                        key={trainStation.id}
                      >{`${trainStation.stationName} [${trainStation.zone}]`}</ListItem>
                    ))}
                </List>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  uktiersponsor.co.uk
                </Typography>
                {ukTierSponsor &&
                  ukTierSponsor.companies &&
                  ukTierSponsor?.companies?.length > 0 &&
                  ukTierSponsor?.companies[0].website && (
                    <div style={{ display: "flex", marginBottom: "4px" }}>
                      <div
                        style={{
                          flex: 1,
                          textAlign: "start",
                          wordBreak: "break-all",
                        }}
                      >
                        <a
                          target={"_blank"}
                          href={ukTierSponsor?.companies[0].website}
                        >
                          {ukTierSponsor?.companies[0].website}
                        </a>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={setAsWebsite}
                        >
                          Set as Website
                        </Button>
                      </div>
                    </div>
                  )}
                {ukTierSponsor &&
                  ukTierSponsor.companies &&
                  ukTierSponsor?.companies?.length > 0 &&
                  ukTierSponsor?.companies[0].socialWebsite && (
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          flex: 1,
                          textAlign: "start",
                          wordBreak: "break-all",
                        }}
                      >
                        <a
                          target={"_blank"}
                          href={ukTierSponsor?.companies[0].socialWebsite}
                        >
                          {ukTierSponsor?.companies[0].socialWebsite}
                        </a>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={setAsLinkedIn}
                        >
                          Set as LinkedIn
                        </Button>
                      </div>
                    </div>
                  )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Job Application Log
                </Typography>
                {!jobApplicationHistory &&
                  "Currently, no job application events"}
                <List>
                  {jobApplicationHistory?.map((event) => (
                    <ListItem key={event?.id}>
                      <ListItemText primary={event?.id} />
                      <ListItemText
                        primary={
                          event?.timestamp
                            ? timeAgo(
                                parse(
                                  event?.timestamp,
                                  "yyyy-MM-dd'T'HH:mm:ss.SSSSSS",
                                  new Date()
                                )
                              )
                            : null
                        }
                      />
                      <ListItemText primary={event?.status} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleOpenDialog}
              >
                Apply
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

const Row: React.FC<{ keyProp: string; value: any }> = (props) => {
  return (
    <div
      style={{
        paddingBottom: "4px",
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          fontWeight: 600,
          textAlign: "right",
          marginRight: "4px",
        }}
      >
        {props.keyProp}
      </div>
      <div
        style={{
          flex: 1,
          textAlign: "left",
          marginLeft: "4px",
        }}
      >
        {props.value !== null ? (
          typeof props.value === "boolean" ? (
            <CheckBoxIcon style={{ color: green[500] }} />
          ) : (
            props.value.toString()
          )
        ) : (
          "-"
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
function timeAgo(date: Date): string {
  const dayDifference = differenceInDays(new Date(), date);
  if (dayDifference < 1) {
    const hourDifference = differenceInHours(new Date(), date);
    if (hourDifference < 1) {
      return differenceInMinutes(new Date(), date) + "min ago";
    } else {
      return hourDifference + "h ago";
    }
  } else {
    return dayDifference + " days ago";
  }
}
