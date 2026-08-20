export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Laki-laki' },
  { value: 'FEMALE', label: 'Perempuan' },
  { value: 'OTHER', label: 'Lainnya' },
];

export function genderLabel(gender?: Gender | null): string | null {
  if (!gender) return null;
  return GENDER_OPTIONS.find((g) => g.value === gender)?.label ?? null;
}
