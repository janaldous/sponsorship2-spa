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
import {
  JobApplicationEventDto,
  JobApplicationEventDtoApplicationMethodEnum,
  JobApplicationEventDtoCategoriesEnum,
  JobApplicationEventDtoStatusEnum,
  JobApplicationEventDtoTechStackEnum,
} from "../api/generated";

interface JobApplicationFormDialogProps {
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  jobApplication?: JobApplicationEventDto;
  onChangeInput: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
  onSubmitForm: () => void;
}

const JobApplicationFormDialog: React.FC<JobApplicationFormDialogProps> = (
  props
) => {
  return (
    <Dialog
      open={props.isDialogOpen}
      onClose={props.onCloseDialog}
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
          value={props.jobApplication?.applicationMethod}
          onChange={props.onChangeInput}
        >
          {Object.values(JobApplicationEventDtoApplicationMethodEnum).map(
            (method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
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
          value={props.jobApplication?.status}
          onChange={props.onChangeInput}
        >
          {Object.values(JobApplicationEventDtoStatusEnum).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="jobapplication-category-label">
          Tech Company Category
        </InputLabel>
        <Select
          labelId="jobapplication-category-label"
          id="jobapplication-category-select"
          name="categories"
          value={
            props.jobApplication?.categories?.map((tech) => tech.toString()) ||
            []
          }
          onChange={props.onChangeInput}
          multiple
        >
          {Object.values(JobApplicationEventDtoCategoriesEnum).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="jobapplication-techstack-label">Tech Stack</InputLabel>
        <Select
          labelId="jobapplication-techstack-label"
          id="jobapplication-techstack-select"
          name="techStack"
          value={
            props.jobApplication?.techStack?.map((tech) => tech.toString()) ||
            []
          }
          onChange={props.onChangeInput}
          multiple
        >
          {Object.values(JobApplicationEventDtoTechStackEnum).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <TextField
          autoFocus
          margin="dense"
          id="website"
          name="website"
          label="Website"
          type="text"
          value={props.jobApplication?.website}
          fullWidth
          onChange={props.onChangeInput}
        />
        <TextField
          autoFocus
          margin="dense"
          id="linkedInUrl"
          name="linkedInUrl"
          label="LinkedIn URL"
          type="text"
          value={props.jobApplication?.linkedInUrl}
          fullWidth
          onChange={props.onChangeInput}
        />
        <TextField
          autoFocus
          margin="dense"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={props.jobApplication?.email}
          fullWidth
          onChange={props.onChangeInput}
        />
        <TextField
          autoFocus
          margin="dense"
          id="notes"
          name="notes"
          label="Notes"
          type="text"
          value={props.jobApplication?.notes}
          fullWidth
          onChange={props.onChangeInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCloseDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={props.onSubmitForm} color="primary">
          Sumbit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplicationFormDialog;
