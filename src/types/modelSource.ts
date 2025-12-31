// Model source metadata for future-proofing designer attribution and licensing
export interface ModelSource {
  platform?: string;
  modelUrl?: string;
  designerName?: string;
  designerProfileUrl?: string;
  licenseNote?: string;
  notes?: string;
}

// Request print form data
export interface PrintRequestFormData {
  modelUrl: string;
  repositoryId?: string;
  repositoryName?: string;
  notes?: string;
  jobSize: 'small' | 'medium' | 'large';
  materialType: string;
  quantity: number;
  modelSource: ModelSource;
}
