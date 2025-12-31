// Model attribution metadata for ethical use, future opt-in royalties, and takedown requests
// This is passive metadata only - no enforcement, no mandatory royalties
export interface ModelAttribution {
  source_platform?: string;
  model_url?: string;
  designer_name?: string;
  designer_profile_url?: string;
  license_note?: string;
  attribution_claimable_until?: string; // ISO date, now + 1 year
}

// Helper to create attribution with claimable date
export const createAttribution = (partial: Omit<ModelAttribution, 'attribution_claimable_until'>): ModelAttribution => {
  const claimableDate = new Date();
  claimableDate.setFullYear(claimableDate.getFullYear() + 1);
  
  return {
    ...partial,
    attribution_claimable_until: claimableDate.toISOString(),
  };
};

// Request print form data
export interface PrintRequestFormData {
  modelUrl: string;
  repositoryId?: string;
  repositoryName?: string;
  notes?: string;
  jobSize: 'small' | 'medium' | 'large';
  materialType: string;
  quantity: number;
  attribution?: ModelAttribution;
}
