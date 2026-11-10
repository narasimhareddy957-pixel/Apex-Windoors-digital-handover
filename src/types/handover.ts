export type InspectionStatus = 'Yes' | 'No' | 'N/A';

export interface ChecklistItem {
  id: number;
  description: string;
  status: InspectionStatus;
  remarks: string;
  category?: 'Operation' | 'Hardware' | 'Weatherproofing' | 'Installation Alignment' | 'Glass & Protection' | 'Handover & Keys';
}

export interface WindowScheduleItem {
  id: string;
  openingCode: string; // e.g. W1, W2, D1, D2
  location: string; // e.g. Living Room Balcony, Master Bedroom
  type: string; // e.g. 3-Track Sliding with Mesh, Casement Window with Friction Stay
  dimensions?: string; // e.g. 8'0" x 7'0"
  glassType: string; // e.g. 5mm Toughened Clear
  status: 'Inspected & Passed' | 'Minor Snag' | 'Pending Adjustment';
  notes?: string;
}

export interface SnagPhotoItem {
  id: string;
  title: string;
  location: string;
  status: 'Verified' | 'Pending Snag' | 'Resolved';
  photoUrl?: string;
  notes?: string;
}

export interface ProjectDetails {
  projectName: string;
  siteAddress: string;
  contractorName: string;
  contractorPhone: string;
  clientName: string;
  clientPhone: string;
  poNo: string;
  completionDate: string;
  profileType: string;
  glassSpecification: string;
  totalUnits: string;
  colorFinish?: string; // e.g. Traffic White, Anthracite Grey, Walnut Woodgrain
}

export interface HandoverRecord {
  id: string;
  certificateNo: string;
  createdAt: string;
  status: 'Draft' | 'Submitted' | 'Certified';
  projectDetails: ProjectDetails;
  checklist: ChecklistItem[];
  windowSchedule?: WindowScheduleItem[];
  photos: SnagPhotoItem[];
  feedback: {
    rating: number;
    text: string;
    verifiedByClient: boolean;
  };
  clientSignatureDataUrl: string;
  clientSignerName: string;
  clientSignedAt?: string;
  contractorSignatureDataUrl: string;
  contractorSignerName: string;
  contractorSignedAt?: string;
  warrantyPeriod: string;
  keysHandedOverCount?: number;
}
