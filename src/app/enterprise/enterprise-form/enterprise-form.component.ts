import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateMask, cnpjMask, maskitoElement, parseDateMask, formatDateMask, formatISODateToBR } from 'src/app/core/constants/mask.constants';
import { ApplicationValidators } from 'src/app/core/validators/url.validator';
import { EnterpriseService } from '../services/enterprise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Enterprise } from '../models/enterprise.type';
import { take } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-enterprise-form',
  templateUrl: './enterprise-form.component.html',
  styleUrls: ['./enterprise-form.component.scss'],
  standalone: false,
})
export class EnterpriseFormComponent implements OnInit {

  dateMask = dateMask;
  cnpjMask = cnpjMask;
  maskitoElement = maskitoElement;
  selectedFile: File | null = null;

  enterpriseForm: FormGroup = new FormGroup({
    legalName: new FormControl('', [
      Validators.required, Validators.minLength(3), Validators.maxLength(150)
    ]),
    tradeName: new FormControl('', [
      Validators.required, Validators.minLength(3), Validators.maxLength(150)
    ]),
    foundationDate: new FormControl('', [Validators.required]),
    cnpj: new FormControl('', [
      Validators.required,
      ApplicationValidators.cnpjValidator
    ]),
    address: new FormControl('', [
      Validators.required, Validators.minLength(3), Validators.maxLength(250)
    ]),
  });

  constructor(
    private enterpriseService: EnterpriseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.enterpriseService.getById(id).pipe(
        take(1)
      ).subscribe({
        next: (enterprise) => {
          if (enterprise) {
            const formattedEnterprise = {
              ...enterprise,
              foundationDate: enterprise.foundationDate instanceof Date 
                ? formatDateMask(enterprise.foundationDate)
                : formatISODateToBR(enterprise.foundationDate)
            };
            this.enterpriseForm.patchValue(formattedEnterprise);
          }
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      });
    }
  }

  hasError(field: string, error: string) {
    const formControl = this.enterpriseForm.get(field);
    return formControl?.touched && formControl?.errors?.[error];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.showError('Por favor, selecione apenas arquivos de imagem (JPEG, PNG, GIF, WebP)');
        event.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastService.showError('O arquivo deve ter no máximo 5MB');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  save() {
    if (this.enterpriseForm.valid) {
      const formValue = this.enterpriseForm.value;
      const enterprise: Enterprise = {
        ...formValue,
        foundationDate: parseDateMask(formValue.foundationDate),
        id: this.activatedRoute.snapshot.params['id']
      };

      this.enterpriseService.save(enterprise, this.selectedFile).subscribe({
        next: () => {
          const isEditMode = !!this.activatedRoute.snapshot.params['id'];
          this.toastService.showSuccess(isEditMode ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!');
          this.router.navigate(['/enterprise']);
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      });
    }
  }
}
