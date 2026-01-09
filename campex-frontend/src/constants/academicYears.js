export const ACADEMIC_YEARS = [
  { value: 'FE', label: 'First Year Engineering (FE)' },
  { value: 'SE', label: 'Second Year Engineering (SE)' },
  { value: 'TE', label: 'Third Year Engineering (TE)' },
  { value: 'BE', label: 'Final Year Engineering (BE)' },
];

export const getYearLabel = (value) => {
  const year = ACADEMIC_YEARS.find((y) => y.value === value);
  return year ? year.label : value;
};