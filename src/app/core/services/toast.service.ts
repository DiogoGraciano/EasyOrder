import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) { }

  async showSuccess(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showError(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'danger',
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showWarning(message: string, duration: number = 4000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'warning',
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showInfo(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'primary',
      position: 'top',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async handleError(error: any) {
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          errorMessage = this.extractServerMessage(error) || 'Dados inválidos. Verifique as informações e tente novamente.';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para realizar esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 409:
          errorMessage = this.extractServerMessage(error) || 'Conflito de dados. O recurso já existe ou está sendo usado.';
          break;
        case 422:
          errorMessage = this.extractServerMessage(error) || 'Dados inválidos. Verifique as informações fornecidas.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = this.extractServerMessage(error) || `Erro ${error.status}: ${error.statusText}`;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    await this.showError(errorMessage);
  }

  private extractServerMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      if (error.error.message) {
        return error.error.message;
      }
      
      if (error.error.error) {
        return error.error.error;
      }
      
      if (error.error.errors && Array.isArray(error.error.errors)) {
        return error.error.errors.join(', ');
      }
      
      if (error.error.errors && typeof error.error.errors === 'object') {
        const errorMessages: string[] = [];
        Object.values(error.error.errors).forEach((fieldErrors: any) => {
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(...fieldErrors);
          } else if (typeof fieldErrors === 'string') {
            errorMessages.push(fieldErrors);
          }
        });
        return errorMessages.join(', ');
      }
    }
    
    return null;
  }
} 