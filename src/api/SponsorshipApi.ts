import { AxiosPromise } from "axios";
import {
  CompanySearchResponse,
  CompanySponsorControllerApiFactory,
  CompanySponsorDetailResponse,
  CompanySponsorDto,
  JobApplicationControllerApiFactory,
  JobApplicationCreateDto,
  PageCompanySponsorDto,
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

  static postJobApplicationEvent(
    jobApplication: JobApplicationCreateDto
  ): AxiosPromise<any> {
    const api = JobApplicationControllerApiFactory();
    return api.postNewJobApplication(jobApplication);
  }
}

export default SponsorshipApi;
