import { MaskitoElementPredicate } from "@maskito/core";
import { maskitoDateOptionsGenerator, maskitoNumberOptionsGenerator, maskitoParseDate, maskitoStringifyDate } from "@maskito/kit";

const dateMask = maskitoDateOptionsGenerator({ mode: 'dd/mm/yyyy', separator: '/' });
const priceMask = maskitoNumberOptionsGenerator({
  decimalSeparator: ',',
  precision: 2,
  thousandSeparator: '.'
})

const cnpjMask = {
  mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
};

const cpfMask = {
  mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
};

const phoneMask = {
  mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
};

const maskitoElement: MaskitoElementPredicate = async (el) =>
  (el as HTMLIonInputElement).getInputElement();

const parseDateMask = (date: string) => {
  return maskitoParseDate(date, {mode: 'dd/mm/yyyy'})
}
const formatDateMask = (date: Date) => {
  return maskitoStringifyDate(date,{mode: 'dd/mm/yyyy',separator:"/"});
}

const formatISODateToBR = (isoDate: string): string => {
  if (!isoDate) return '';
  
  if (isoDate.includes('/')) return isoDate;
  
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export {
  dateMask,
  priceMask,
  cnpjMask,
  cpfMask,
  phoneMask,
  maskitoElement,
  parseDateMask,
  formatDateMask,
  formatISODateToBR
}
