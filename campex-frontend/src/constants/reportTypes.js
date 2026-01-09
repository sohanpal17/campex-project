export const REPORT_TYPES = [
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate content' },
  { value: 'SCAM', label: 'Scam or fraud' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'FAKE_LISTING', label: 'Fake listing' },
  { value: 'OTHER', label: 'Other' },
];

export const getReportTypeLabel = (value) => {
  const type = REPORT_TYPES.find((t) => t.value === value);
  return type ? type.label : value;
};