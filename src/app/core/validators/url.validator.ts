import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ApplicationValidators {

  static urlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return null; 
    }
    return { invalidUrl: true }; 
  }

  static cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;

    if (!cpf) {
      return null;
    }

    const cleanedCpf = String(cpf).replace(/\D/g, '');

    if (cleanedCpf.length !== 11 || /^(.)\1+$/.test(cleanedCpf)) {
        return { invalidCpf: true };
    }

    try {
        let sum = 0;
        let remainder: number;

        for (let i = 1; i <= 9; i++) {
            sum = sum + parseInt(cleanedCpf.substring(i - 1, i), 10) * (11 - i);
        }
        remainder = sum % 11;
        const digit1 = (remainder < 2) ? 0 : 11 - remainder;

        if (digit1 !== parseInt(cleanedCpf.substring(9, 10), 10)) {
             return { invalidCpf: true };
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cleanedCpf.substring(i - 1, i), 10) * (12 - i);
        }
        remainder = sum % 11;
        const digit2 = (remainder < 2) ? 0 : 11 - remainder;

        if (digit2 !== parseInt(cleanedCpf.substring(10, 11), 10)) {
            return { invalidCpf: true };
        }

        return null;
    } catch (e) {
         console.error("Error validating CPF:", e);
         return { invalidCpf: true };
    }
  }

  static cnpjValidator(control: AbstractControl): ValidationErrors | null {
    const cnpj = control.value;

    if (!cnpj) {
        return null;
    }

    const cleanedCnpj = String(cnpj).replace(/\D/g, '');

    if (cleanedCnpj.length !== 14 || /^(.)\1+$/.test(cleanedCnpj)) {
        return { invalidCnpj: true };
    }

    try {
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        let remainder: number;

        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanedCnpj.charAt(i), 10) * weights1[i];
        }
        remainder = sum % 11;
        const digit1 = remainder < 2 ? 0 : 11 - remainder;

        if (digit1 !== parseInt(cleanedCnpj.charAt(12), 10)) {
            return { invalidCnpj: true };
        }

        sum = 0;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanedCnpj.charAt(i), 10) * weights2[i];
        }
        remainder = sum % 11;
        const digit2 = remainder < 2 ? 0 : 11 - remainder;

        if (digit2 !== parseInt(cleanedCnpj.charAt(13), 10)) {
            return { invalidCnpj: true };
        }

        return null;
    } catch (e) {
        console.error("Error validating CNPJ:", e);
        return { invalidCnpj: true };
    }
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
  
    if (!value) {
      return null;
    }
  
    const cleanedPhone = String(value).replace(/\D/g, '');
  
    // Telefones celulares e fixos no Brasil variam de 10 a 11 dígitos
    const isValidPhone = /^(\d{10}|\d{11})$/.test(cleanedPhone);
  
    if (!isValidPhone) {
      return { invalidPhone: true };
    }
  
    return null;
  }
}