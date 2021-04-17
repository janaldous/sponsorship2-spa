import { AxiosPromise } from "axios";
import {
  CompanySearchResponse,
  CompanySponsorControllerApiFactory,
  CompanySponsorDetailResponse,
  JobApplicationControllerApiFactory,
  JobApplicationDto,
  JobApplicationEventDto,
  NearbyStopsControllerApiFactory,
  PageCompanySponsorDto,
  TrainStation,
  UkTierSponsorControllerApiFactory,
} from "./generated/api";

class SponsorshipApi {
  static getCompanies(
    page: number,
    size: number,
    zone: number
  ): AxiosPromise<PageCompanySponsorDto> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanySponsor(page, size, zone);
  }

  static getCompany(id: number): AxiosPromise<CompanySponsorDetailResponse> {
    const companySponsorApi = CompanySponsorControllerApiFactory();
    return companySponsorApi.getCompanySponsorById(id);
  }

  static getUKTierSponsor(id: number): AxiosPromise<CompanySearchResponse> {
    const ukTierSponsorApi = UkTierSponsorControllerApiFactory();
    return ukTierSponsorApi.getUKTierSponsor(id);
  }

  static getJobApplicationByCompanySponsor(
    companySponsorid: number
  ): AxiosPromise<Array<JobApplicationDto>> {
    const api = JobApplicationControllerApiFactory();
    return api.getJobApplicationByFilter(companySponsorid);
  }

  static postJobApplicationEvent(
    jobApplication: JobApplicationEventDto
  ): AxiosPromise<any> {
    const api = JobApplicationControllerApiFactory();
    return api.postNewJobApplication(jobApplication);
  }

  static getNearByStops(postCode: string): AxiosPromise<Array<TrainStation>> {
    return NearbyStopsControllerApiFactory().getNearbyStops(postCode);
  }
}

export default SponsorshipApi;
