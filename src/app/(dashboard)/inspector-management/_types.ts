export type InspectorAddress = {
  StreetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  taxId?: string | null;
};

export type InspectorProfile = {
  yearsOfExperience?: string | null;
  aseCertificationNumber?: string | null;
  certificationsAndTraining?: string | null;
  currentEmployer?: string | null;
  contractorStatus?: string | null;
  availableHoursPerWeek?: string | null;
  preferredServiceAreas?: string[] | null;
  hasReliableTransportation?: boolean | null;
  availableOnWeekends?: boolean | null;
  criminalBackground?: string | null;
  drivingRecord?: string | null;
  professionalReferences?: string | null;
  motivation?: string | null;
  additionalSkills?: string | null;
  isApproved: boolean;
};

export type Inspector = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  address?: InspectorAddress | null;
  inspectorProfile: InspectorProfile;
};

export type InspectorApiResponse = {
  status: boolean;
  message: string;
  data: {
    inspectors: Inspector[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};
